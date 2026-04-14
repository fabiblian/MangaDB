package manga.dto;

public class LeaderboardEntryDTO {

    private final Integer rank;
    private final Integer userId;
    private final String username;
    private final Long completedCount;
    private final Long readingCount;
    private final Long plannedCount;
    private final Long droppedCount;

    public LeaderboardEntryDTO(Integer rank, UserStatsDTO stats) {
        this.rank = rank;
        this.userId = stats.getUserId();
        this.username = stats.getUsername();
        this.completedCount = stats.getCompletedCount();
        this.readingCount = stats.getReadingCount();
        this.plannedCount = stats.getPlannedCount();
        this.droppedCount = stats.getDroppedCount();
    }

    public Integer getRank() {
        return rank;
    }

    public Integer getUserId() {
        return userId;
    }

    public String getUsername() {
        return username;
    }

    public Long getCompletedCount() {
        return completedCount;
    }

    public Long getReadingCount() {
        return readingCount;
    }

    public Long getPlannedCount() {
        return plannedCount;
    }

    public Long getDroppedCount() {
        return droppedCount;
    }
}
