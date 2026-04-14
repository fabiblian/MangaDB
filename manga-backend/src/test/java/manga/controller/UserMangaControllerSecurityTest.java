package manga.controller;

import manga.model.Category;
import manga.model.Manga;
import manga.model.Publisher;
import manga.model.Role;
import manga.model.Status;
import manga.model.User;
import manga.model.UserManga;
import manga.repository.CategoryRepository;
import manga.repository.MangaRepository;
import manga.repository.PublisherRepository;
import manga.repository.UserMangaRepository;
import manga.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class UserMangaControllerSecurityTest {

    @Autowired
    private MockMvc mockMvc;

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
    private Manga mangaOne;
    private Manga mangaTwo;
    private Long hansEntryId;
    private Long tomEntryId;

    @BeforeEach
    void setUp() {
        userMangaRepository.deleteAll();
        mangaRepository.deleteAll();
        userRepository.deleteAll();
        categoryRepository.deleteAll();
        publisherRepository.deleteAll();

        Category category = new Category();
        category.setName("Drama");
        category = categoryRepository.save(category);

        Publisher publisher = new Publisher();
        publisher.setName("Test Publisher");
        publisher = publisherRepository.save(publisher);

        mangaOne = new Manga();
        mangaOne.setTitle("User Scope Manga");
        mangaOne.setVolume(1);
        mangaOne.setCategory(category);
        mangaOne.setPublisher(publisher);
        mangaOne = mangaRepository.save(mangaOne);

        mangaTwo = new Manga();
        mangaTwo.setTitle("Other Scope Manga");
        mangaTwo.setVolume(1);
        mangaTwo.setCategory(category);
        mangaTwo.setPublisher(publisher);
        mangaTwo = mangaRepository.save(mangaTwo);

        hans = new User("hans", "hans@example.com", "pw", Role.USER);
        hans = userRepository.save(hans);

        tom = new User("tom", "tom@example.com", "pw", Role.USER);
        tom = userRepository.save(tom);

        UserManga hansEntry = new UserManga();
        hansEntry.setUser(hans);
        hansEntry.setManga(mangaOne);
        hansEntry.setStatus(Status.PLANNED);
        hansEntry.setRating(7);
        hansEntry.setNote("Hans entry");
        hansEntryId = userMangaRepository.save(hansEntry).getId();

        UserManga tomEntry = new UserManga();
        tomEntry.setUser(tom);
        tomEntry.setManga(mangaTwo);
        tomEntry.setStatus(Status.READING);
        tomEntry.setRating(8);
        tomEntry.setNote("Tom entry");
        tomEntryId = userMangaRepository.save(tomEntry).getId();
    }

    @Test
    @WithMockUser(username = "hans", roles = {"USER"})
    void getAll_asUser_shouldReturnOnlyOwnEntries() throws Exception {
        mockMvc.perform(get("/user-manga"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].user.username").value("hans"))
                .andExpect(jsonPath("$[0].note").value("Hans entry"));
    }

    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void getAll_asAdmin_shouldReturnAllEntries() throws Exception {
        mockMvc.perform(get("/user-manga"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)));
    }

    @Test
    @WithMockUser(username = "hans", roles = {"USER"})
    void create_asUserForAnotherUser_shouldReturn403() throws Exception {
        String payload = """
                {
                  "user": { "id": %d },
                  "manga": { "id": %d },
                  "status": "PLANNED",
                  "rating": 5,
                  "note": "not allowed"
                }
                """.formatted(tom.getId(), mangaTwo.getId());

        mockMvc.perform(post("/user-manga")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isForbidden())
                .andExpect(content().string("Zugriff verweigert"));
    }

    @Test
    @WithMockUser(username = "hans", roles = {"USER"})
    void update_foreignEntryAsUser_shouldReturn403() throws Exception {
        String payload = """
                {
                  "status": "COMPLETED",
                  "rating": 9,
                  "note": "should fail"
                }
                """;

        mockMvc.perform(put("/user-manga/{id}", tomEntryId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isForbidden())
                .andExpect(content().string("Zugriff verweigert"));
    }

    @Test
    @WithMockUser(username = "hans", roles = {"USER"})
    void delete_foreignEntryAsUser_shouldReturn403() throws Exception {
        mockMvc.perform(delete("/user-manga/{id}", tomEntryId))
                .andExpect(status().isForbidden())
                .andExpect(content().string("Zugriff verweigert"));
    }
}
