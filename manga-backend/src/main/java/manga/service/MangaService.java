package manga.service;

import manga.model.Manga;
import manga.repository.MangaRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class MangaService {

    private final MangaRepository mangaRepository;

    public MangaService(MangaRepository mangaRepository) {
        this.mangaRepository = mangaRepository;
    }

    @Transactional(readOnly = true)
    public List<Manga> findAll() {
        return mangaRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Manga findByIdOrNull(Integer id) {
        return mangaRepository.findById(id).orElse(null);
    }

    public Manga create(Manga manga) {
        if (mangaRepository.existsByTitleIgnoreCaseAndVolume(manga.getTitle(), manga.getVolume())) {
            throw new IllegalArgumentException("Manga gibt es bereits");
        }

        return mangaRepository.save(manga);
    }

    public Manga update(Integer id, Manga manga) {
        if (!mangaRepository.existsById(id)) {
            return null;
        }

        manga.setId(id);
        return mangaRepository.save(manga);
    }

    public void delete(Integer id) {
        if (!mangaRepository.existsById(id)) {
            throw new IllegalArgumentException("Manga not found");
        }

        try {
            mangaRepository.deleteById(id);
            mangaRepository.flush();
        } catch (DataIntegrityViolationException ex) {
            throw new IllegalStateException(
                    "Manga kann nicht geloescht werden, weil noch UserManga-Eintraege darauf verweisen.",
                    ex
            );
        }
    }
}
