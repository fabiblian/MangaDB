package manga.service;

import manga.model.Role;
import manga.model.User;
import manga.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional
public class UserService {

    public static final String DEFAULT_USER_PASSWORD = "welcome123";
    public static final String DEFAULT_ADMIN_PASSWORD = "admin123";

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User registerUser(String username, String email, String rawPassword, Role role) {
        validateUniqueUser(username, email, null);

        User user = new User();
        user.setUsername(username.trim());
        user.setEmail(normalizeEmail(email));
        user.setPassword(passwordEncoder.encode(rawPassword));
        user.setRole(role == null ? Role.USER : role);
        return userRepository.save(user);
    }

    public User createUserByAdmin(User input) {
        validateUniqueUser(input.getUsername(), input.getEmail(), null);

        User user = new User();
        user.setUsername(input.getUsername().trim());
        user.setEmail(normalizeEmail(input.getEmail()));
        user.setRole(input.getRole() == null ? Role.USER : input.getRole());
        user.setPassword(passwordEncoder.encode(resolveRawPassword(input.getPassword(), DEFAULT_USER_PASSWORD)));
        return userRepository.save(user);
    }

    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsernameIgnoreCase(username);
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmailIgnoreCase(email);
    }

    public Optional<User> findByLogin(String usernameOrEmail) {
        if (usernameOrEmail == null || usernameOrEmail.isBlank()) {
            return Optional.empty();
        }
        return usernameOrEmail.contains("@")
                ? findByEmail(usernameOrEmail.trim())
                : findByUsername(usernameOrEmail.trim());
    }

    public Optional<User> authenticate(String usernameOrEmail, String rawPassword) {
        return findByLogin(usernameOrEmail)
                .filter(user -> passwordEncoder.matches(rawPassword, user.getPassword()));
    }

    public User updateUserByAdmin(Integer id, User input) {
        User existing = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User nicht gefunden"));

        validateUniqueUser(input.getUsername(), input.getEmail(), id);

        existing.setUsername(input.getUsername().trim());
        existing.setEmail(normalizeEmail(input.getEmail()));

        if (input.getRole() != null) {
            existing.setRole(input.getRole());
        }

        if (input.getPassword() != null && !input.getPassword().isBlank()) {
            existing.setPassword(passwordEncoder.encode(input.getPassword()));
        }

        return userRepository.save(existing);
    }

    public void deleteById(Integer id) {
        userRepository.deleteById(id);
    }

    public String encodePassword(String rawPassword) {
        return passwordEncoder.encode(rawPassword);
    }

    private void validateUniqueUser(String username, String email, Integer currentUserId) {
        if (username == null || username.isBlank()) {
            throw new IllegalArgumentException("Username ist erforderlich");
        }

        userRepository.findByUsernameIgnoreCase(username.trim())
                .filter(user -> !user.getId().equals(currentUserId))
                .ifPresent(user -> {
                    throw new IllegalArgumentException("Username ist bereits vergeben");
                });

        String normalizedEmail = normalizeEmail(email);
        userRepository.findByEmailIgnoreCase(normalizedEmail)
                .filter(user -> !user.getId().equals(currentUserId))
                .ifPresent(user -> {
                    throw new IllegalArgumentException("Email ist bereits registriert");
                });
    }

    private String normalizeEmail(String email) {
        return email == null ? null : email.trim().toLowerCase();
    }

    private String resolveRawPassword(String password, String fallbackPassword) {
        if (password == null || password.isBlank()) {
            return fallbackPassword;
        }
        return password;
    }
}
