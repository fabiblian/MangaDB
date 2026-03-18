package manga.repository;

import manga.model.UserManga;
import org.springframework.data.jpa.repository.JpaRepository;
/** 
 * Repostitory für User-Einträge
 */
public interface UserMangaRepository extends JpaRepository<UserManga, Long> {
	 /**
     * Prüft, ob bereits ein User mit dem Benutzernamen existiert
     *
     * @param username Benutzername des Users
     * @return True wenn der User existiert
     */
	
	boolean existsByUserIdAndMangaId(Integer userId, Integer mangaId);
}
