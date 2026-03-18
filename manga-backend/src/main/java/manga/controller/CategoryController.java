package manga.controller;

import manga.model.Category;
import manga.repository.CategoryRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller für Kategorien.
 */
@RestController
@RequestMapping("/categories")
public class CategoryController {

    private CategoryRepository categoryRepository;

    public CategoryController(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    /**
     * Liefert alle vorhandenen Kategorien.
     *
     * @return Liste aller gespeicherten Kategorien
     */
    @GetMapping
    public List<Category> getAll() {       
       return categoryRepository.findAll(); 
    }
    
    /**
     * Erstellt eine neue Kategorie.
     * 
     *
     * @param category Kategorie, die erstellt werden soll
     * @return erstellt Kategorie und HTTP-Status 201
     *         oder HTTP-Status 409 wenn name es den namen bereits gibt
     */
    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody Category category) {
    		
    		if (categoryRepository.existsByNameIgnoreCase(
    			category.getName())) {
    			
            return ResponseEntity
                    .status(HttpStatus.CONFLICT) 
                    .body("Kategorie gibt es bereits");
        }
        Category saved = categoryRepository.save(category); 
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(saved);
    }
    
    /**
     * Löscht eine Kategorie nach ID.
     *
     * @param id ID der zu löschenden Kategorie
     * @return HTTP-Status 204 wenn es erfolgreich gelöscht wurde 
     */
    
  
   @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) { 
        categoryRepository.deleteById(id);
        return ResponseEntity.noContent().build(); 
    }

}
