package manga.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
/**
 * Manga User-Einträge .
 */
@Entity
@Table(name = "users")
public class User {
	 
	/**
     * Eindeutige ID des User-Eintrags.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
   
    /**
     * Benutzername des Users.
     */
    @NotBlank
    @Size(min = 3, max = 50)
    private String username;
   
    /**
     * E-Mail-Adresse des Users.
     */
    @NotBlank
    @Email
    @Size(max = 100)
    private String email;
    
    /**
     * Standardkonstruktor.
     */
    public User() {
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
