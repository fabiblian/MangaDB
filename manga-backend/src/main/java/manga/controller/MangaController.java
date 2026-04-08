package manga.controller;

import jakarta.validation.Valid;
import manga.model.Manga;
import manga.repository.MangaRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/mangas")
public class MangaController {

    private final MangaRepository mangaRepository;

    public MangaController(MangaRepository mangaRepository) {
        this.mangaRepository = mangaRepository;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public List<Manga> getAll() {
        return mangaRepository.findAll();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public ResponseEntity<Manga> getById(@PathVariable Integer id) {
        return mangaRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> create(@Valid @RequestBody Manga manga) {
        if (mangaRepository.existsByTitleIgnoreCaseAndVolume(manga.getTitle(), manga.getVolume())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Manga gibt es bereits");
        }

        Manga saved = mangaRepository.save(manga);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Manga> update(@PathVariable Integer id, @Valid @RequestBody Manga manga) {
        if (!mangaRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        manga.setId(id);
        return ResponseEntity.ok(mangaRepository.save(manga));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> delete(@PathVariable Integer id) {
        if (!mangaRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Manga not found");
        }
        try {
            mangaRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (DataIntegrityViolationException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Manga kann nicht geloescht werden, weil noch UserManga-Eintraege darauf verweisen.");
        }
    }
}
