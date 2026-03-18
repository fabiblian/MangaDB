package manga.repository;

import manga.model.Publisher;
import org.springframework.data.jpa.repository.JpaRepository;

/** 
 * Repostitory für Verläge 
 */
public interface PublisherRepository extends JpaRepository<Publisher, Integer> {
    
	  /**
     * Prüft, ob bereits ein Verlag mit dem Namen existiert
     *
     * @param name Name des Verlags
     * @return True wenn der Verlag existiert
     */
	boolean existsByNameIgnoreCase(String name);
}
