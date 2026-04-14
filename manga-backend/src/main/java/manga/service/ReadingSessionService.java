package manga.service;

import manga.model.Manga;
import manga.model.ReadingSession;
import manga.model.Status;
import manga.model.User;
import manga.model.UserManga;
import manga.repository.MangaRepository;
import manga.repository.ReadingSessionRepository;
import manga.repository.UserMangaRepository;
import manga.repository.UserRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class ReadingSessionService {

    private final ReadingSessionRepository readingSessionRepository;
    private final UserRepository userRepository;
    private final MangaRepository mangaRepository;
    private final UserMangaRepository userMangaRepository;

    public ReadingSessionService(
            ReadingSessionRepository readingSessionRepository,
            UserRepository userRepository,
            MangaRepository mangaRepository,
            UserMangaRepository userMangaRepository
    ) {
        this.readingSessionRepository = readingSessionRepository;
        this.userRepository = userRepository;
        this.mangaRepository = mangaRepository;
        this.userMangaRepository = userMangaRepository;
    }

    @Transactional(readOnly = true)
    public List<ReadingSession> findAll(String username, boolean isAdmin) {
        if (isAdmin) {
            return readingSessionRepository.findAll();
        }

        User currentUser = findCurrentUser(username);
        return readingSessionRepository.findAllByUserIdOrderByReadAtDesc(currentUser.getId());
    }

    public ReadingSession create(ReadingSession input, String username, boolean isAdmin) {
        User currentUser = findCurrentUser(username);

        if (input.getManga() == null || input.getManga().getId() == null) {
            throw new IllegalArgumentException("Manga ist Pflicht");
        }

        Manga manga = mangaRepository.findById(input.getManga().getId())
                .orElseThrow(() -> new IllegalArgumentException("Manga nicht gefunden"));

        User targetUser = resolveTargetUser(input, currentUser, isAdmin);
        Status resultingStatus = determineResultingStatus(targetUser.getId(), manga);

        ReadingSession session = new ReadingSession();
        session.setUser(targetUser);
        session.setManga(manga);
        session.setReadAt(LocalDateTime.now());
        session.setNote(input.getNote());
        session.setResultingStatus(resultingStatus);
        ReadingSession savedSession = readingSessionRepository.save(session);

        UserManga userManga = userMangaRepository.findByUserIdAndMangaId(targetUser.getId(), manga.getId())
                .orElseGet(() -> {
                    UserManga entry = new UserManga();
                    entry.setUser(targetUser);
                    entry.setManga(manga);
                    return entry;
                });

        userManga.setStatus(resultingStatus);
        userMangaRepository.save(userManga);

        return savedSession;
    }

    public void delete(Long id, String username, boolean isAdmin) {
        if (isAdmin) {
            if (!readingSessionRepository.existsById(id)) {
                throw new IllegalArgumentException("ReadingSession not found");
            }
            readingSessionRepository.deleteById(id);
            return;
        }

        User currentUser = findCurrentUser(username);
        ReadingSession session = readingSessionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("ReadingSession not found"));

        if (!session.getUser().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("Zugriff verweigert");
        }

        readingSessionRepository.deleteById(id);
    }

    private User findCurrentUser(String username) {
        return userRepository.findByUsernameIgnoreCase(username)
                .orElseThrow(() -> new IllegalArgumentException("User nicht gefunden"));
    }

    private User resolveTargetUser(ReadingSession input, User currentUser, boolean isAdmin) {
        if (!isAdmin) {
            Integer requestedUserId = input.getUser() == null ? null : input.getUser().getId();
            if (requestedUserId != null && !requestedUserId.equals(currentUser.getId())) {
                throw new AccessDeniedException("Zugriff verweigert");
            }
            return currentUser;
        }

        Integer targetUserId = input.getUser() == null ? null : input.getUser().getId();
        if (targetUserId == null) {
            throw new IllegalArgumentException("User ist Pflicht");
        }

        return userRepository.findById(targetUserId)
                .orElseThrow(() -> new IllegalArgumentException("User nicht gefunden"));
    }

    private Status determineResultingStatus(Integer userId, Manga manga) {
        Manga lastKnownVolume = mangaRepository.findTopByTitleIgnoreCaseOrderByVolumeDesc(manga.getTitle())
                .orElse(manga);

        if (manga.getVolume().equals(lastKnownVolume.getVolume())) {
            return Status.COMPLETED;
        }

        return userMangaRepository.findByUserIdAndMangaId(userId, manga.getId())
                .map(UserManga::getStatus)
                .filter(status -> status == Status.COMPLETED)
                .orElse(Status.READING);
    }
}
