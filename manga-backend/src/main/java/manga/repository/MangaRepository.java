package manga.repository;

import manga.model.Manga;
import org.springframework.data.jpa.repository.JpaRepository;
/** 
 * Repostitory für Kategorie 
 */
public interface MangaRepository extends JpaRepository<Manga, Integer> {
    
	   /**
     * Prüft, ob bereits ein Manga mit dem Titel und Band existiert

     *
     * @param title  Titel des Mangas
     * @param volume Bandnummer des Mangas
     * @return {@code true}, wenn der Manga existiert
     */
	boolean existsByTitleIgnoreCaseAndVolume(String title, Integer volume);
}
