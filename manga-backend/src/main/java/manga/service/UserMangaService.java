package manga.service;

import manga.model.User;
import manga.model.UserManga;
import manga.repository.UserMangaRepository;
import manga.repository.UserRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class UserMangaService {

    private final UserMangaRepository userMangaRepository;
    private final UserRepository userRepository;

    public UserMangaService(UserMangaRepository userMangaRepository, UserRepository userRepository) {
        this.userMangaRepository = userMangaRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<UserManga> findAll(String username, boolean isAdmin) {
        if (isAdmin) {
            return userMangaRepository.findAll();
        }

        return userMangaRepository.findAllByUserId(findCurrentUser(username).getId());
    }

    public UserManga create(UserManga userManga, String username, boolean isAdmin) {
        User currentUser = findCurrentUser(username);
        if (userManga.getManga() == null || userManga.getManga().getId() == null) {
            throw new IllegalArgumentException("Manga ist Pflicht");
        }
        if (userManga.getStatus() == null) {
            throw new IllegalArgumentException("Status ist Pflicht");
        }
        Integer targetUserId = resolveTargetUserId(userManga, currentUser, isAdmin);

        if (userMangaRepository.existsByUserIdAndMangaId(targetUserId, userManga.getManga().getId())) {
            throw new IllegalArgumentException("Dieser Manga hat schon einen Eintrag");
        }

        userManga.setUser(resolveTargetUser(userManga, currentUser, isAdmin));
        return userMangaRepository.save(userManga);
    }

    public UserManga update(Long id, UserManga userManga, String username, boolean isAdmin) {
        if (userManga.getStatus() == null) {
            throw new IllegalArgumentException("Status ist Pflicht");
        }

        UserManga existing;
        if (isAdmin) {
            existing = userMangaRepository.findById(id).orElse(null);
        } else {
            User currentUser = findCurrentUser(username);
            existing = userMangaRepository.findById(id).orElse(null);
            if (existing != null && !existing.getUser().getId().equals(currentUser.getId())) {
                throw new AccessDeniedException("Zugriff verweigert");
            }
        }

        if (existing == null) {
            return null;
        }

        existing.setStatus(userManga.getStatus());
        existing.setRating(userManga.getRating());
        existing.setNote(userManga.getNote());
        return userMangaRepository.save(existing);
    }

    public void delete(Long id, String username, boolean isAdmin) {
        if (isAdmin) {
            if (!userMangaRepository.existsById(id)) {
                throw new IllegalArgumentException("UserManga not found");
            }

            userMangaRepository.deleteById(id);
            return;
        }

        User currentUser = findCurrentUser(username);
        UserManga existing = userMangaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("UserManga not found"));

        if (!existing.getUser().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("Zugriff verweigert");
        }

        userMangaRepository.deleteById(id);
    }

    private User findCurrentUser(String username) {
        return userRepository.findByUsernameIgnoreCase(username)
                .orElseThrow(() -> new IllegalArgumentException("User nicht gefunden"));
    }

    private Integer resolveTargetUserId(UserManga userManga, User currentUser, boolean isAdmin) {
        if (!isAdmin) {
            Integer requestedUserId = userManga.getUser() == null ? null : userManga.getUser().getId();
            if (requestedUserId != null && !requestedUserId.equals(currentUser.getId())) {
                throw new AccessDeniedException("Zugriff verweigert");
            }
            return currentUser.getId();
        }

        if (userManga.getUser() == null || userManga.getUser().getId() == null) {
            throw new IllegalArgumentException("User ist Pflicht");
        }

        return userManga.getUser().getId();
    }

    private User resolveTargetUser(UserManga userManga, User currentUser, boolean isAdmin) {
        if (!isAdmin) {
            return currentUser;
        }

        Integer targetUserId = userManga.getUser() == null ? null : userManga.getUser().getId();
        if (targetUserId == null) {
            throw new IllegalArgumentException("User ist Pflicht");
        }

        return userRepository.findById(targetUserId)
                .orElseThrow(() -> new IllegalArgumentException("User nicht gefunden"));
    }
}
