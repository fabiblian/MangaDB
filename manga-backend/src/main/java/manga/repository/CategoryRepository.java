package manga.repository;

import manga.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;

/** 
 * Repostitory für Kategorie 
 */
public interface CategoryRepository extends JpaRepository<Category, Integer> {
	/**
	 * Prüft, ob bereits eine Kategorie mit dem Namen existiert
	 *
	 * @param name Name der Kategorie
	 * @return true, wenn die Kategorie existiert
	 */
    boolean existsByNameIgnoreCase(String name);
}
