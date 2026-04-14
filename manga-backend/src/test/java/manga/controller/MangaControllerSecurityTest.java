package manga.controller;

import manga.model.Category;
import manga.model.Manga;
import manga.model.Publisher;
import manga.repository.CategoryRepository;
import manga.repository.MangaRepository;
import manga.repository.PublisherRepository;
import manga.repository.UserMangaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class MangaControllerSecurityTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private MangaRepository mangaRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private PublisherRepository publisherRepository;

    @Autowired
    private UserMangaRepository userMangaRepository;

    private Integer categoryId;
    private Integer publisherId;

    @BeforeEach
    void setUp() {
        userMangaRepository.deleteAll();
        mangaRepository.deleteAll();
        categoryRepository.deleteAll();
        publisherRepository.deleteAll();

        Category category = new Category();
        category.setName("Action");
        categoryId = categoryRepository.save(category).getId();

        Publisher publisher = new Publisher();
        publisher.setName("Test Publisher");
        publisherId = publisherRepository.save(publisher).getId();

        Manga manga = new Manga();
        manga.setTitle("Test Manga");
        manga.setVolume(1);
        manga.setCategory(categoryRepository.findById(categoryId).orElseThrow());
        manga.setPublisher(publisherRepository.findById(publisherId).orElseThrow());
        mangaRepository.save(manga);
    }

    @Test
    void getMangas_withoutAuth_shouldReturn401() throws Exception {
        mockMvc.perform(get("/mangas"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value("Nicht authentifiziert"));
    }

    @Test
    @WithMockUser(username = "user1", roles = {"USER"})
    void createManga_asUser_shouldReturn403() throws Exception {
        String mangaJson = """
                {
                  "title": "Forbidden Manga",
                  "volume": 2,
                  "category": { "id": %d },
                  "publisher": { "id": %d }
                }
                """.formatted(categoryId, publisherId);

        mockMvc.perform(post("/mangas")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mangaJson))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.error").value("Zugriff verweigert"));
    }

    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void createManga_asAdmin_shouldReturn201() throws Exception {
        String mangaJson = """
                {
                  "title": "Admin Manga",
                  "volume": 2,
                  "category": { "id": %d },
                  "publisher": { "id": %d }
                }
                """.formatted(categoryId, publisherId);

        mockMvc.perform(post("/mangas")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mangaJson))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.title").value("Admin Manga"))
                .andExpect(jsonPath("$.id").isNumber());
    }
}
