package manga.config;

import manga.model.Role;
import manga.model.User;
import manga.repository.UserRepository;
import manga.service.UserService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initializeUsers(UserRepository userRepository, UserService userService) {
        return args -> {
            upsertDemoUser(
                    userRepository,
                    userService,
                    "admin",
                    "admin@manga.local",
                    UserService.DEFAULT_ADMIN_PASSWORD,
                    Role.ADMIN
            );
            upsertDemoUser(
                    userRepository,
                    userService,
                    "hans",
                    "hans@mail.com",
                    UserService.DEFAULT_USER_PASSWORD,
                    Role.USER
            );
            upsertDemoUser(
                    userRepository,
                    userService,
                    "tom",
                    "tom@mail.com",
                    UserService.DEFAULT_USER_PASSWORD,
                    Role.USER
            );
            upsertDemoUser(
                    userRepository,
                    userService,
                    "marco",
                    "marco@mail.com",
                    UserService.DEFAULT_USER_PASSWORD,
                    Role.USER
            );
        };
    }

    private void upsertDemoUser(
            UserRepository userRepository,
            UserService userService,
            String username,
            String email,
            String rawPassword,
            Role role
    ) {
        User user = userRepository.findByUsernameIgnoreCase(username)
                .orElseGet(User::new);

        user.setUsername(username);
        user.setEmail(email);
        user.setRole(role);
        user.setPassword(userService.encodePassword(rawPassword));

        userRepository.save(user);
    }
}
