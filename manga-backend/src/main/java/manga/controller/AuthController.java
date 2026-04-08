package manga.controller;

import jakarta.validation.Valid;
import manga.dto.LoginRequestDTO;
import manga.dto.LoginResponseDTO;
import manga.dto.RegisterRequestDTO;
import manga.dto.RegisterResponseDTO;
import manga.model.Role;
import manga.model.User;
import manga.service.JwtService;
import manga.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserService userService;
    private final JwtService jwtService;

    public AuthController(UserService userService, JwtService jwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequestDTO request) {
        try {
            User user = userService.registerUser(
                    request.getUsername(),
                    request.getEmail(),
                    request.getPassword(),
                    Role.USER
            );

            return ResponseEntity.ok(new RegisterResponseDTO(
                    user.getId(),
                    user.getUsername(),
                    user.getEmail(),
                    user.getRole().name()
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequestDTO request) {
        return userService.authenticate(request.getUsernameOrEmail(), request.getPassword())
                .<ResponseEntity<?>>map(user -> ResponseEntity.ok(
                        new LoginResponseDTO(
                                jwtService.generateToken(user.getUsername(), user.getRole().name()),
                                user.getId(),
                                user.getUsername(),
                                user.getEmail(),
                                user.getRole().name(),
                                jwtService.getExpirationTime()
                        )))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Ungueltige Anmeldedaten")));
    }
}
