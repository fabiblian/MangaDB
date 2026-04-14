package manga.controller;

import manga.model.UserManga;
import manga.service.UserMangaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user-manga")
public class UserMangaController {

    private final UserMangaService userMangaService;

    public UserMangaController(UserMangaService userMangaService) {
        this.userMangaService = userMangaService;
    }

    @GetMapping
    public List<UserManga> getAll(Authentication authentication) {
        return userMangaService.findAll(authentication.getName(), isAdmin(authentication));
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody UserManga userManga, Authentication authentication) {
        try {
            return ResponseEntity.ok(userMangaService.create(userManga, authentication.getName(), isAdmin(authentication)));
        } catch (AccessDeniedException ex) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ex.getMessage());
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id,
                                    @RequestBody UserManga userManga,
                                    Authentication authentication) {
        try {
            UserManga updated = userMangaService.update(id, userManga, authentication.getName(), isAdmin(authentication));
            return updated == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(updated);
        } catch (AccessDeniedException ex) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ex.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id, Authentication authentication) {
        try {
            userMangaService.delete(id, authentication.getName(), isAdmin(authentication));
            return ResponseEntity.noContent().build();
        } catch (AccessDeniedException ex) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ex.getMessage());
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }
    }

    private boolean isAdmin(Authentication authentication) {
        return authentication.getAuthorities().stream()
                .anyMatch(authority -> "ROLE_ADMIN".equals(authority.getAuthority()));
    }
}
