package manga.repository;

import manga.model.ReadingSession;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ReadingSessionRepository extends JpaRepository<ReadingSession, Long> {

    List<ReadingSession> findAllByUserIdOrderByReadAtDesc(Integer userId);

    Optional<ReadingSession> findByIdAndUserId(Long id, Integer userId);
}
