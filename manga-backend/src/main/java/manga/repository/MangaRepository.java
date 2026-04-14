package manga.repository;

import manga.model.Manga;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * Repository fuer Manga-Eintraege.
 */
public interface MangaRepository extends JpaRepository<Manga, Integer> {

    boolean existsByTitleIgnoreCaseAndVolume(String title, Integer volume);

    Optional<Manga> findTopByTitleIgnoreCaseOrderByVolumeDesc(String title);
}
