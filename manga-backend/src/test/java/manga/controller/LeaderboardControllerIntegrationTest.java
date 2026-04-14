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
import manga.repository.ReadingSessionRepository;
import manga.repository.UserMangaRepository;
import manga.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class LeaderboardControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserMangaRepository userMangaRepository;

    @Autowired
    private MangaRepository mangaRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private PublisherRepository publisherRepository;

    @Autowired
    private ReadingSessionRepository readingSessionRepository;

    private Integer annaId;

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
        publisher.setName("Test Publisher");
        publisher = publisherRepository.save(publisher);

        Manga mangaOne = createManga("Alpha", 1, category, publisher);
        Manga mangaTwo = createManga("Beta", 1, category, publisher);
        Manga mangaThree = createManga("Gamma", 1, category, publisher);

        User anna = createUser("anna", "anna@example.com", Role.USER);
        User bert = createUser("bert", "bert@example.com", Role.USER);
        createUser("carla", "carla@example.com", Role.USER);
        annaId = anna.getId();

        createUserManga(anna, mangaOne, Status.COMPLETED, 9);
        createUserManga(anna, mangaTwo, Status.COMPLETED, 7);
        createUserManga(anna, mangaThree, Status.READING, 8);
        createUserManga(bert, mangaOne, Status.COMPLETED, 6);
    }

    @Test
    void getLeaderboard_withoutAuth_shouldReturn401() throws Exception {
        mockMvc.perform(get("/leaderboard"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value("Nicht authentifiziert"));
    }

    @Test
    @WithMockUser(username = "anna", roles = {"USER"})
    void getLeaderboard_shouldIncludeAllUsersAndSortByCompletedCount() throws Exception {
        mockMvc.perform(get("/leaderboard"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].rank").value(1))
                .andExpect(jsonPath("$[0].username").value("anna"))
                .andExpect(jsonPath("$[0].completedCount").value(2))
                .andExpect(jsonPath("$[1].rank").value(2))
                .andExpect(jsonPath("$[1].username").value("bert"))
                .andExpect(jsonPath("$[1].completedCount").value(1))
                .andExpect(jsonPath("$[2].rank").value(3))
                .andExpect(jsonPath("$[2].username").value("carla"))
                .andExpect(jsonPath("$[2].completedCount").value(0));
    }

    @Test
    @WithMockUser(username = "anna", roles = {"USER"})
    void getUserStats_shouldReturnAggregatedCounts() throws Exception {
        mockMvc.perform(get("/leaderboard/user/{id}/stats", annaId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.userId").value(annaId))
                .andExpect(jsonPath("$.username").value("anna"))
                .andExpect(jsonPath("$.completedCount").value(2))
                .andExpect(jsonPath("$.readingCount").value(1))
                .andExpect(jsonPath("$.plannedCount").value(0))
                .andExpect(jsonPath("$.droppedCount").value(0));
    }

    private Manga createManga(String title, int volume, Category category, Publisher publisher) {
        Manga manga = new Manga();
        manga.setTitle(title);
        manga.setVolume(volume);
        manga.setCategory(category);
        manga.setPublisher(publisher);
        return mangaRepository.save(manga);
    }

    private User createUser(String username, String email, Role role) {
        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword("encoded");
        user.setRole(role);
        return userRepository.save(user);
    }

    private void createUserManga(User user, Manga manga, Status status, Integer rating) {
        UserManga userManga = new UserManga();
        userManga.setUser(user);
        userManga.setManga(manga);
        userManga.setStatus(status);
        userManga.setRating(rating);
        userMangaRepository.save(userManga);
    }
}
