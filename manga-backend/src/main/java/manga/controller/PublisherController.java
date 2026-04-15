package manga.controller;

import jakarta.validation.Valid;
import manga.model.Publisher;
import manga.repository.PublisherRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/publishers")
public class PublisherController {

    private final PublisherRepository publisherRepository;

    public PublisherController(PublisherRepository publisherRepository) {
        this.publisherRepository = publisherRepository;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public List<Publisher> getAll() {
        return publisherRepository.findAll();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public ResponseEntity<?> getById(@PathVariable Integer id) {
        return publisherRepository.findById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body("Publisher not found"));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> create(@Valid @RequestBody Publisher publisher) {
        if (publisherRepository.existsByNameIgnoreCase(publisher.getName())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Publisher gibt es bereits");
        }

        Publisher saved = publisherRepository.save(publisher);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> update(@PathVariable Integer id, @Valid @RequestBody Publisher publisher) {
        if (!publisherRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Publisher not found");
        }
        publisher.setId(id);
        return ResponseEntity.ok(publisherRepository.save(publisher));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> delete(@PathVariable Integer id) {
        if (!publisherRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Publisher not found");
        }
        try {
            publisherRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (DataIntegrityViolationException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Publisher kann nicht gelöscht werden, weil noch Manga-Einträge darauf verweisen.");
        }
    }
}
