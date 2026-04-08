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
            for (User user : userRepository.findAll()) {
                boolean changed = false;

                if (user.getRole() == null) {
                    user.setRole(Role.USER);
                    changed = true;
                }

                if (user.getPassword() == null || user.getPassword().isBlank() || !user.getPassword().startsWith("$2")) {
                    String defaultPassword = "admin".equalsIgnoreCase(user.getUsername())
                            ? UserService.DEFAULT_ADMIN_PASSWORD
                            : UserService.DEFAULT_USER_PASSWORD;
                    user.setPassword(userService.encodePassword(defaultPassword));
                    changed = true;
                }

                if (changed) {
                    userRepository.save(user);
                }
            }

            if (userRepository.findByUsernameIgnoreCase("admin").isEmpty()) {
                User admin = new User(
                        "admin",
                        "admin@manga.local",
                        userService.encodePassword(UserService.DEFAULT_ADMIN_PASSWORD),
                        Role.ADMIN
                );
                userRepository.save(admin);
            }
        };
    }
}
