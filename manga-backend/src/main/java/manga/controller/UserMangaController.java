package manga.controller;

import jakarta.validation.Valid;
import manga.model.UserManga;
import manga.repository.UserMangaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user-manga")
public class UserMangaController {

    private final UserMangaRepository userMangaRepository;

    public UserMangaController(UserMangaRepository userMangaRepository) {
        this.userMangaRepository = userMangaRepository;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public List<UserManga> getAll() {
        return userMangaRepository.findAll();
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public ResponseEntity<?> create(@Valid @RequestBody UserManga userManga) {
        if (userMangaRepository.existsByUserIdAndMangaId(
                userManga.getUser().getId(),
                userManga.getManga().getId())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Dieser Manga hat schon einen Eintrag");
        }

        return ResponseEntity.ok(userMangaRepository.save(userManga));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public ResponseEntity<UserManga> update(@PathVariable Long id, @Valid @RequestBody UserManga userManga) {
        if (!userMangaRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        userManga.setId(id);
        return ResponseEntity.ok(userMangaRepository.save(userManga));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        if (!userMangaRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("UserManga not found");
        }
        userMangaRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
