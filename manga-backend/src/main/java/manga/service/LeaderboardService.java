package manga.service;

import manga.dto.LeaderboardEntryDTO;
import manga.dto.UserStatsDTO;
import manga.repository.LeaderboardStatsView;
import manga.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class LeaderboardService {

    private final UserRepository userRepository;

    public LeaderboardService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<LeaderboardEntryDTO> getLeaderboard() {
        List<UserStatsDTO> stats = userRepository.fetchLeaderboardStats().stream()
                .map(this::toUserStats)
                .toList();
        List<LeaderboardEntryDTO> leaderboard = new ArrayList<>(stats.size());

        for (int i = 0; i < stats.size(); i++) {
            leaderboard.add(new LeaderboardEntryDTO(i + 1, stats.get(i)));
        }

        return leaderboard;
    }

    public UserStatsDTO getUserStats(Integer userId) {
        return userRepository.fetchUserStatsById(userId)
                .map(this::toUserStats)
                .orElseThrow(() -> new IllegalArgumentException("User nicht gefunden"));
    }

    private UserStatsDTO toUserStats(LeaderboardStatsView view) {
        return new UserStatsDTO(
                view.getUserId(),
                view.getUsername(),
                view.getCompletedCount(),
                view.getReadingCount(),
                view.getPlannedCount(),
                view.getDroppedCount()
        );
    }
}
