package manga.repository;

import manga.model.UserManga;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

/**
 * Repository fuer User-Manga-Eintraege.
 */
public interface UserMangaRepository extends JpaRepository<UserManga, Long> {

    boolean existsByUserIdAndMangaId(Integer userId, Integer mangaId);

    List<UserManga> findAllByUserId(Integer userId);

    Optional<UserManga> findByIdAndUserId(Long id, Integer userId);

    Optional<UserManga> findByUserIdAndMangaId(Integer userId, Integer mangaId);
}
