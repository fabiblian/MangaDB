package manga.controller;

import manga.model.Category;
import manga.model.Manga;
import manga.model.Publisher;
import manga.model.ReadingSession;
import manga.model.Role;
import manga.model.Status;
import manga.model.User;
import manga.model.UserManga;
import manga.repository.CategoryRepository;
import manga.repository.MangaRepository;
import manga.repository.PublisherRepository;
import manga.repository.ReadingSessionRepository;
import manga.repository.UserMangaRepository;
import manga.repository.UserRepository;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class ReadingSessionControllerSecurityTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ReadingSessionRepository readingSessionRepository;

    @Autowired
    private UserMangaRepository userMangaRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MangaRepository mangaRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private PublisherRepository publisherRepository;

    private User hans;
    private User tom;
    private Manga titleVol1;
    private Manga titleVol2;
    private Manga otherVol1;
    private Long tomSessionId;

    @BeforeEach
    void setUp() {
        readingSessionRepository.deleteAll();
        userMangaRepository.deleteAll();
        mangaRepository.deleteAll();
        userRepository.deleteAll();
        categoryRepository.deleteAll();
        publisherRepository.deleteAll();

        Category category = new Category();
        category.setName("Action");
        category = categoryRepository.save(category);

        Publisher publisher = new Publisher();
        publisher.setName("Session Publisher");
        publisher = publisherRepository.save(publisher);

        titleVol1 = createManga("Session Title", 1, category, publisher);
        titleVol2 = createManga("Session Title", 2, category, publisher);
        otherVol1 = createManga("Other Title", 1, category, publisher);

        hans = userRepository.save(new User("hans", "hans@example.com", "pw", Role.USER));
        tom = userRepository.save(new User("tom", "tom@example.com", "pw", Role.USER));

        ReadingSession hansSession = new ReadingSession();
        hansSession.setUser(hans);
        hansSession.setManga(titleVol1);
        hansSession.setReadAt(LocalDateTime.now().minusDays(1));
        hansSession.setResultingStatus(Status.READING);
        hansSession.setNote("Hans session");
        readingSessionRepository.save(hansSession);

        ReadingSession tomSession = new ReadingSession();
        tomSession.setUser(tom);
        tomSession.setManga(otherVol1);
        tomSession.setReadAt(LocalDateTime.now());
        tomSession.setResultingStatus(Status.COMPLETED);
        tomSession.setNote("Tom session");
        tomSessionId = readingSessionRepository.save(tomSession).getId();
    }

    @Test
    @WithMockUser(username = "hans", roles = {"USER"})
    void getAll_asUser_shouldReturnOnlyOwnSessions() throws Exception {
        mockMvc.perform(get("/reading-sessions"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].user.username").value("hans"))
                .andExpect(jsonPath("$[0].note").value("Hans session"));
    }

    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void getAll_asAdmin_shouldReturnAllSessions() throws Exception {
        mockMvc.perform(get("/reading-sessions"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)));
    }

    @Test
    @WithMockUser(username = "hans", roles = {"USER"})
    void create_asUserForAnotherUser_shouldReturn403AndKeepCount() throws Exception {
        long beforeCount = readingSessionRepository.count();

        String payload = """
                {
                  "user": { "id": %d },
                  "manga": { "id": %d },
                  "note": "not allowed"
                }
                """.formatted(tom.getId(), otherVol1.getId());

        mockMvc.perform(post("/reading-sessions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isForbidden())
                .andExpect(content().string("Zugriff verweigert"));

        Assertions.assertEquals(beforeCount, readingSessionRepository.count());
    }

    @Test
    @WithMockUser(username = "hans", roles = {"USER"})
    void create_shouldCreateMissingUserMangaWithReading() throws Exception {
        String payload = """
                {
                  "manga": { "id": %d },
                  "note": "new progress"
                }
                """.formatted(titleVol1.getId());

        mockMvc.perform(post("/reading-sessions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.resultingStatus").value("READING"));

        UserManga createdEntry = userMangaRepository.findByUserIdAndMangaId(hans.getId(), titleVol1.getId())
                .orElseThrow();

        Assertions.assertEquals(Status.READING, createdEntry.getStatus());
    }

    @Test
    @WithMockUser(username = "hans", roles = {"USER"})
    void create_shouldUpdatePlannedToReading() throws Exception {
        UserManga plannedEntry = new UserManga();
        plannedEntry.setUser(hans);
        plannedEntry.setManga(titleVol1);
        plannedEntry.setStatus(Status.PLANNED);
        userMangaRepository.save(plannedEntry);

        String payload = """
                {
                  "manga": { "id": %d },
                  "note": "continue reading"
                }
                """.formatted(titleVol1.getId());

        mockMvc.perform(post("/reading-sessions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.resultingStatus").value("READING"));

        UserManga updatedEntry = userMangaRepository.findByUserIdAndMangaId(hans.getId(), titleVol1.getId())
                .orElseThrow();

        Assertions.assertEquals(Status.READING, updatedEntry.getStatus());
    }

    @Test
    @WithMockUser(username = "hans", roles = {"USER"})
    void create_shouldSetCompletedForLastKnownVolume() throws Exception {
        String payload = """
                {
                  "manga": { "id": %d },
                  "note": "finished final volume"
                }
                """.formatted(titleVol2.getId());

        mockMvc.perform(post("/reading-sessions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.resultingStatus").value("COMPLETED"));

        UserManga updatedEntry = userMangaRepository.findByUserIdAndMangaId(hans.getId(), titleVol2.getId())
                .orElseThrow();

        Assertions.assertEquals(Status.COMPLETED, updatedEntry.getStatus());
    }

    @Test
    @WithMockUser(username = "hans", roles = {"USER"})
    void delete_foreignSessionAsUser_shouldReturn403() throws Exception {
        mockMvc.perform(delete("/reading-sessions/{id}", tomSessionId))
                .andExpect(status().isForbidden())
                .andExpect(content().string("Zugriff verweigert"));
    }

    private Manga createManga(String title, int volume, Category category, Publisher publisher) {
        Manga manga = new Manga();
        manga.setTitle(title);
        manga.setVolume(volume);
        manga.setCategory(category);
        manga.setPublisher(publisher);
        return mangaRepository.save(manga);
    }
}
