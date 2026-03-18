package manga.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
	/**
	 * Manga Kategorien  ( Shonen, Seinen).
	 */
	@Entity
	@Table(name = "categories")
	public class Category {
		
		 /**
	     * Eindeutige ID der Kategorie.
	     */

	    @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Integer id;

	    /**
	     * Name der Kategorie.
	     */
	    @NotBlank
	    @Size(min = 2, max = 50)
	    private String name;
	    
	    /**
	     * Standardkonstruktor.
	     */
	    public Category() {
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

