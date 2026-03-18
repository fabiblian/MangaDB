package manga.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * Status für User-Manga .
 */
@Entity
@Table(
        name = "user_manga",
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "manga_id"})
)
public class UserManga {

    /**
     * Eindeutige ID des User-Manga-Eintrags.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Zugehöriger User-Eintrag.
     */
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @NotNull(message = "nicht null")
    private User user;

    /**
     * Zugehöriger Manga-Eintrag.
     */
    @ManyToOne /// erkläre 
    @JoinColumn(name = "manga_id", nullable = false)
    @NotNull(message = "nicht null")
    private Manga manga;

    /**
     * Aktueller Status des Mangas vom User.
     */
    @NotNull(message = "nicht null")
    @Enumerated(EnumType.STRING)
    private Status status;
    
    /**
     * Bewertung des Mangas durch den User (0–10).
     */
    @Min(value = 0, message = "rating  min 0")
    @Max(value = 10, message = "rating  max 10")
    private Integer rating;


    /**
     * Optionale Notiz des Users zum Manga.
     */
    @Size(max = 255, message = "nicht mehr als 255 Buchstaben")
    private String note;
    
    /**
     * Standardkonstruktor.
     */
    public UserManga() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Manga getManga() {
        return manga;
    }

    public void setManga(Manga manga) {
        this.manga = manga;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }
}
