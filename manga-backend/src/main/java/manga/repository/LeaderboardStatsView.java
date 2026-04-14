package manga.repository;

public interface LeaderboardStatsView {

    Integer getUserId();

    String getUsername();

    Long getCompletedCount();

    Long getReadingCount();

    Long getPlannedCount();

    Long getDroppedCount();

    Double getAverageRating();
}
