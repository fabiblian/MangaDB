package manga.controller;

import jakarta.validation.Valid;
import manga.model.User;
import manga.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for user management.
 */
@RestController
@RequestMapping("/users")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    /**
     * Liefert alle Benutzer.
     *
     * @return Liste aller Benutzer
     */
    // GET /users
    @GetMapping
    public List<User> getAll() {
        return userRepository.findAll();
    }
    /**
     * Erstellt einen Benutzer.
     *
     * @param user Benutzer, welcher erstellt werden soll
     * @return {@link ResponseEntity} mit dem erstellten Benutzer und HTTP-Status 201
     *         oder HTTP-Status 409 wenn der Benutzer bereits existiert
     */
    // POST /users
    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody User user) {

        if (userRepository.existsByUsernameIgnoreCase(user.getUsername())) {
            return ResponseEntity
            		.status(HttpStatus.CONFLICT)
            		.body("User gibt es bereits");
        }

        User saved = userRepository.save(user);
        return ResponseEntity
        		.status(HttpStatus.CREATED)
        		.body(saved);
    }

    /**
     * Aktualisiert einen vorhandenen Benutzer.
     *
     * @param id ID des Benutzers, welcher aktualisiert werden soll
     * @param user Neue Benutzerdaten
     * @return Benutzer und HTTP-Status 200
     */
    // update/ replace 
    @PutMapping("/{id}")
    public ResponseEntity<?> update(
            @PathVariable Integer id,
            @RequestBody User user) {


        user.setId(id);
        return ResponseEntity.ok(userRepository.save(user));
    }
    /**
     * Löscht einen Benutzer nach ID.
     *
     * @param id ID des zu löschenden Benutzers
     * @return HTTP-Status 204 wenn der Benutzer gelöscht wurde
     */
    // Delete nach ID 
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        userRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

}
