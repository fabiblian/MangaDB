package manga.controller;

import manga.model.Publisher;
import manga.repository.PublisherRepository;
import jakarta.validation.Valid;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST für Verläge.
 */
@RestController
@RequestMapping("/publishers")
public class PublisherController {

    private PublisherRepository publisherRepository;

    public PublisherController(PublisherRepository publisherRepository) {
        this.publisherRepository = publisherRepository;
    }
   
    @GetMapping
    public List<Publisher> getAll() {
        return publisherRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Integer id) {
        return publisherRepository.findById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body("Publisher not found"));
    }
    
    /**
     * Erstellt einen neuen Publisher.
     *
     * @param publisher Publisher, welcher erstellt werden soll
     * @return Publisher und HTTP-Status 201
     *         oder HTTP-Status 409 wenn der Publisher bereits existiert
     */
    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody Publisher publisher) {
    	
    	if (publisherRepository.existsByNameIgnoreCase(publisher.getName())) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT) 
                    .body("Publisher gibt es bereits");
        }
    	

        Publisher saved = publisherRepository.save(publisher);
        return ResponseEntity
        		.status(HttpStatus.CREATED)
        		.body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Integer id, @Valid @RequestBody Publisher publisher) {
        if (!publisherRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Publisher not found");
        }
        publisher.setId(id);
        return ResponseEntity.ok(publisherRepository.save(publisher));
    }
    

    /**
     * Löscht einen Publisher nach seiner ID.
     *
     * @param id ID des zu löschenden Publishers
     * @return HTTP-Status 204 wenn der Publisher gelöscht wurde
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Integer id) {
        if (!publisherRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Publisher not found");
        }
        try {
            publisherRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (DataIntegrityViolationException ex) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body("Publisher kann nicht geloescht werden, weil noch Manga-Eintraege darauf verweisen.");
        }
    }

}
