package manga.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * Manga-Einträge.
 */

@Entity
@Table(name = "mangas")
public class Manga {
	 
	/**
     * Eindeutige ID des Manga-Eintrags.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    /**
     * Titel des Mangas.
     */
    @NotBlank
    @Size(min = 2, max = 50)
    private String title;
    
    /**
     * Bandnummer des Mangas.
     */
    @NotNull
    @Min(1)
    private Integer volume;
    
    /**
     * Optionale URL zum Cover-Bild.
     */
    @Size(max = 500)
    private String imageUrl;

    /**
     * Zugehörige Kategorie des Mangas.
     */
    @ManyToOne(optional = false)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    /**
     * Verlag, bei dem der Manga erschienen ist.
     */
    @ManyToOne(optional = false)
    @JoinColumn(name = "publisher_id", nullable = false)
    private Publisher publisher;

    /**
     * Standardkonstruktor.
     */
    public Manga() {
    }

    // getter / setter
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Integer getVolume() {
        return volume;
    }

    public void setVolume(Integer volume) {
        this.volume = volume;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public Publisher getPublisher() {
        return publisher;
    }

    public void setPublisher(Publisher publisher) {
        this.publisher = publisher;
    }
}
