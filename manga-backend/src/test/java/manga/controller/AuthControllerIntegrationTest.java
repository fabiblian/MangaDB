package manga.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class AuthControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void registerThenLogin_withUsername_shouldReturnJwtToken() throws Exception {
        String registerJson = """
                {
                  "username": "integrationuser",
                  "email": "integrationuser@example.com",
                  "password": "secret123"
                }
                """;

        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(registerJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").isNumber())
                .andExpect(jsonPath("$.role").value("USER"));

        String loginJson = """
                {
                  "usernameOrEmail": "integrationuser",
                  "password": "secret123"
                }
                """;

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(loginJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isString())
                .andExpect(jsonPath("$.id").isNumber())
                .andExpect(jsonPath("$.username").value("integrationuser"))
                .andExpect(jsonPath("$.role").value("USER"));
    }

    @Test
    void login_withWrongPassword_shouldReturn401() throws Exception {
        String registerJson = """
                {
                  "username": "wrongpassworduser",
                  "email": "wrongpassword@example.com",
                  "password": "secret123"
                }
                """;

        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(registerJson))
                .andExpect(status().isOk());

        String loginJson = """
                {
                  "usernameOrEmail": "wrongpassworduser",
                  "password": "falsch123"
                }
                """;

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                .content(loginJson))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value("Ungültige Anmeldedaten"));
    }
}
