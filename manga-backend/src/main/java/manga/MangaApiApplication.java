package manga;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Startklasse der Manga-API.
 * Initialisiert die Spring-Boot-Anwendung 
 */
@SpringBootApplication
@RestController
public class MangaApiApplication {
	
	/**
	 * Startet die Spring-Boot-Applikation.
	 *
	 */

    public static void main(String[] args) {
        SpringApplication.run(MangaApiApplication.class, args);
    }
    /**
     * Liefert eine einfache Willkommensnachricht.
     *
     * @return Willkommensnachricht 
     */
    @GetMapping("/")
    public String index() {
        return "Willkommen bei Mangadb";
    }
}
