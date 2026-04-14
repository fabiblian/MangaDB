package manga.repository;

import manga.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

/**
 * Repository fuer Benutzer.
 */
public interface UserRepository extends JpaRepository<User, Integer> {

    Optional<User> findByUsernameIgnoreCase(String username);

    Optional<User> findByEmailIgnoreCase(String email);

    boolean existsByUsernameIgnoreCase(String username);

    boolean existsByEmailIgnoreCase(String email);

    @Query(value = """
            select
                u.id as userId,
                u.username as username,
                coalesce(sum(case when um.status = 'COMPLETED' then 1 else 0 end), 0) as completedCount,
                coalesce(sum(case when um.status = 'READING' then 1 else 0 end), 0) as readingCount,
                coalesce(sum(case when um.status = 'PLANNED' then 1 else 0 end), 0) as plannedCount,
                coalesce(sum(case when um.status = 'DROPPED' then 1 else 0 end), 0) as droppedCount
            from users u
            left join user_manga um on um.user_id = u.id
            group by u.id, u.username
            order by completedCount desc, lower(u.username) asc
            """, nativeQuery = true)
    List<LeaderboardStatsView> fetchLeaderboardStats();

    @Query(value = """
            select
                u.id as userId,
                u.username as username,
                coalesce(sum(case when um.status = 'COMPLETED' then 1 else 0 end), 0) as completedCount,
                coalesce(sum(case when um.status = 'READING' then 1 else 0 end), 0) as readingCount,
                coalesce(sum(case when um.status = 'PLANNED' then 1 else 0 end), 0) as plannedCount,
                coalesce(sum(case when um.status = 'DROPPED' then 1 else 0 end), 0) as droppedCount
            from users u
            left join user_manga um on um.user_id = u.id
            where u.id = :userId
            group by u.id, u.username
            """, nativeQuery = true)
    Optional<LeaderboardStatsView> fetchUserStatsById(@Param("userId") Integer userId);
}
