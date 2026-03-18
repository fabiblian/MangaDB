package manga.controller;

import jakarta.validation.Valid;
import manga.model.Manga;
import manga.repository.MangaRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
/**
 * REST controller für Mangas.
 */
@RestController
@RequestMapping("/mangas")
public class MangaController {

    private final MangaRepository mangaRepository;

    public MangaController(MangaRepository mangaRepository) {
        this.mangaRepository = mangaRepository;
    }
    
    /**
     * Liefert alle vorhandenen Mangas.
     *
     * @return Liste aller gespeicherten Mangas
     */
    // GET all
    @GetMapping
    public List<Manga> getAll() {
        return mangaRepository.findAll();
    }
    
    /**
     * Liefert einen Manga anhand seiner ID.
     *
     * @param id ID des Mangas
     * @return Manga und HTTP-Status 200
     *         oder HTTP-Status 404 wenn der Manga nicht gefunden wurde 
     */
    // get nach ID
    @GetMapping("/{id}")
    public ResponseEntity<Manga> getById(@PathVariable Integer id) {
        return mangaRepository.findById(id) 
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    /**
     * Erstellt einen neuen Manga.
     *
     * @param manga Manga, der erstellt werden soll
     * @return mit dem erstellten Manga und HTTP-Status 201
     *         oder HTTP-Status 409 wenn der Manga bereits existiert
     */
    // POST erstellen 
    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody Manga manga) {
    		if (mangaRepository.existsByTitleIgnoreCaseAndVolume(
    	        manga.getTitle(),
    	        manga.getVolume())) {
    			
    			return ResponseEntity
	    	    		.status(HttpStatus.CONFLICT)
	    	    		.body("Manga gibt es bereits");
    

        }
        Manga saved = mangaRepository.save(manga);
        return ResponseEntity
        		.status(HttpStatus.CREATED)
        		.body(saved);
    }
    /**
     * Aktualisiert einen vorhandenen Manga.
     *
     * @param id ID des Mangas welcher aktualisiert werden soll
     * @param manga Neue Daten des Mangas
     * @return aktualisierter Manga und HTTP-Status 200
     *         oder HTTP-Status 404 wenn kein Manga gefunden wurde
     */
    // PUT update
    @PutMapping("/{id}")
    public ResponseEntity<Manga> update(@PathVariable Integer id,
                                        @Valid @RequestBody Manga manga) {
        if (!mangaRepository.existsById(id)) {
            return ResponseEntity.notFound().build(); // 404
        }
        manga.setId(id);
        Manga saved = mangaRepository.save(manga);
        return ResponseEntity.ok(saved);
    }


    /**
     * Löscht einen Manga nach ID.
     *
     * @param id ID des zu löschenden Mangas
     * @return HTTP-Status 204 wenn der Manga gelöscht wurde
     */
    // löschen (nach ID) 
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Integer id) {
        if (!mangaRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Manga not found");
        }
        try {
            mangaRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (DataIntegrityViolationException ex) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body("Manga kann nicht geloescht werden, weil noch UserManga-Eintraege darauf verweisen.");
        }
    }
}
