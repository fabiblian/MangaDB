package manga.controller;

import manga.dto.LeaderboardEntryDTO;
import manga.dto.UserStatsDTO;
import manga.service.LeaderboardService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/leaderboard")
public class LeaderboardController {

    private final LeaderboardService leaderboardService;

    public LeaderboardController(LeaderboardService leaderboardService) {
        this.leaderboardService = leaderboardService;
    }

    @GetMapping
    public List<LeaderboardEntryDTO> getLeaderboard() {
        return leaderboardService.getLeaderboard();
    }

    @GetMapping("/user/{id}/stats")
    public ResponseEntity<?> getUserStats(@PathVariable Integer id) {
        try {
            UserStatsDTO stats = leaderboardService.getUserStats(id);
            return ResponseEntity.ok(stats);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", ex.getMessage()));
        }
    }
}
