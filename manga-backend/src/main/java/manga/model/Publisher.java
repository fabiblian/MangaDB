package manga.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;

/**
 *  manga Verläge (Carlsen, Tokyopop).
 */
@Entity
@Table(name = "publishers")
public class Publisher {
	
	/**
     * Eindeutige ID des Verlags.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    /**
     * Name des Verlags.
     */
    @Size(max = 100)
    private String name;
    
    /**
     * Standardkonstruktor.
     */
    public Publisher() {
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
