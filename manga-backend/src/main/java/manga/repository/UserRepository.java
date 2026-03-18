package manga.repository;

import manga.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

/** 
 * Repostitory für User
 */
public interface UserRepository extends JpaRepository<User, Integer> {
   
	/**
     * Prüft, ob bereits ein Verlag mit dem Namen existiert
  
     *
     * @param name Name des Verlags
     * @return True wenn der Verlag existiert
     */
	boolean existsByUsernameIgnoreCase(String username);
}
