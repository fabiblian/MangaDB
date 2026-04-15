package manga.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

@Entity
@Table(name = "reading_sessions")
public class ReadingSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(optional = false)
    @JoinColumn(name = "manga_id", nullable = false)
    private Manga manga;

    @Column(nullable = false)
    private LocalDateTime readAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Status resultingStatus;

    @Min(1)
    @Column(name = "chapters_read")
    private Integer chaptersRead;

    @Size(max = 255)
    @Column(length = 255)
    private String note;

    public ReadingSession() {
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

    public LocalDateTime getReadAt() {
        return readAt;
    }

    public void setReadAt(LocalDateTime readAt) {
        this.readAt = readAt;
    }

    public Status getResultingStatus() {
        return resultingStatus;
    }

    public void setResultingStatus(Status resultingStatus) {
        this.resultingStatus = resultingStatus;
    }

    public Integer getChaptersRead() {
        return chaptersRead;
    }

    public void setChaptersRead(Integer chaptersRead) {
        this.chaptersRead = chaptersRead;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }
}
