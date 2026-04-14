package manga.dto;

public class UserStatsDTO {

    private final Integer userId;
    private final String username;
    private final Long completedCount;
    private final Long readingCount;
    private final Long plannedCount;
    private final Long droppedCount;
    private final Double averageRating;

    public UserStatsDTO(Integer userId,
                        String username,
                        Long completedCount,
                        Long readingCount,
                        Long plannedCount,
                        Long droppedCount,
                        Double averageRating) {
        this.userId = userId;
        this.username = username;
        this.completedCount = completedCount == null ? 0L : completedCount;
        this.readingCount = readingCount == null ? 0L : readingCount;
        this.plannedCount = plannedCount == null ? 0L : plannedCount;
        this.droppedCount = droppedCount == null ? 0L : droppedCount;
        this.averageRating = averageRating;
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

    public Double getAverageRating() {
        return averageRating;
    }
}
