package manga.controller;

import jakarta.validation.Valid;
import manga.model.UserManga;
import manga.repository.UserMangaRepository;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user-manga")
public class UserMangaController {

    private final UserMangaRepository userMangaRepository;

    public UserMangaController(UserMangaRepository userMangaRepository) {
        this.userMangaRepository = userMangaRepository;
    }
    
    /**
    * Liefert alle Benutzer-Einträge.
    *
    * @return Liste aller Benutzer-Einträge
    */
   
    // get
    @GetMapping
    public List<UserManga> getAll() {
        return userMangaRepository.findAll();
    }
    /**
     * Erstellt einen neuen Benutzer.
     *
     * @param user Benutzer, der erstellt werden soll
     * @return erstellter Benutzer oder HTTP-Status 409 bei Duplikat
     */
    // Post 
    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody UserManga userManga) {
    	if (userMangaRepository.existsByUserIdAndMangaId(
                userManga.getUser().getId(),
                userManga.getManga().getId())) {

            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body("Dieser Manga hat schon einen Eintrag");
        }
    	return ResponseEntity
        		.ok(userMangaRepository.save(userManga));
    }
    
    /**
     * Aktualisiert einen bestehenden Benutzer.
     *
     * @param id   ID des Benutzer-Eintrag
     * @param user neue Benutzerdaten
     * @return aktualisierter Benutzer oder HTTP-Status 404
     */
    // replace/update
    @PutMapping("/{id}")
    public ResponseEntity<UserManga> update(@PathVariable Long id, @Valid @RequestBody UserManga userManga) {
        if (!userMangaRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        userManga.setId(id);
        return ResponseEntity.ok(userMangaRepository.save(userManga));
    }
    
    /**
     * Löscht einen Benutzer anhand der ID.
     *
     * @param id ID des Benutzer Gintrag
     * @return HTTP-Status 204 wenn er erfolgreich gelöscht wurde 
     */
    // DELETE nach ID
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        if (!userMangaRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("UserManga not found");
        }
        userMangaRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
