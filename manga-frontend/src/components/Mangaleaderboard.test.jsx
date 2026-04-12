import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import MangaLibraryLeaderboard from "./MangaLibraryLeaderboard";
import { getPopularMangas } from "../services/leaderboard-service";

// Mock des Services
jest.mock("../services/leaderboard-service");

describe("MangaLibraryLeaderboard Component", () => {
    const mockMangaData = [
        { id: 1, title: "One Piece", volume: 105, popularityScore: 9999 },
        { id: 2, username: "ZoroFan", gamesPlayed: 50, totalScore: 5000 },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    // ===========================================================================
    // TEST 1: Erfolgreiches Laden der Daten (Default: Global)
    // ===========================================================================
    test("lädt und zeigt das Ranking beim ersten Rendern an", async () => {
        // --- ARRANGE ---
        getPopularMangas.mockResolvedValueOnce(mockMangaData);

        // --- ACT ---
        render(<MangaLibraryLeaderboard />);

        // --- ASSERT ---
        // Loading State sollte kurz sichtbar sein
        expect(screen.getByText(/Manga-Daten werden analysiert/i)).toBeInTheDocument();

        // Warten auf Datenanzeige
        await waitFor(() => {
            expect(screen.getByText("One Piece")).toBeInTheDocument();
            expect(screen.getByText("ZoroFan")).toBeInTheDocument();
        });

        // Medaillen-Logik prüfen
        expect(screen.getByText("🥇")).toBeInTheDocument(); // Index 0 + 1
        expect(screen.getByText("🥈")).toBeInTheDocument(); // Index 1 + 1

        expect(getPopularMangas).toHaveBeenCalledWith("global");
    });

    // ===========================================================================
    // TEST 2: Kategoriewechsel
    // ===========================================================================
    test("wechselt die Kategorie und lädt neue Daten", async () => {
        // --- ARRANGE ---
        getPopularMangas.mockResolvedValue(mockMangaData);
        render(<MangaLibraryLeaderboard />);

        // Warten bis initial geladen
        await waitFor(() => expect(getPopularMangas).toHaveBeenCalledTimes(1));

        // --- ACT ---
        const shonenButton = screen.getByRole("button", { name: /Shonen/i });
        fireEvent.click(shonenButton);

        // --- ASSERT ---
        expect(shonenButton).toHaveClass("tab-button--active");
        await waitFor(() => {
            expect(getPopularMangas).toHaveBeenCalledWith("shonen");
        });
    });

    // ===========================================================================
    // TEST 3: Fehlerbehandlung
    // ===========================================================================
    test("zeigt eine Fehlermeldung an, wenn der API-Call fehlschlägt", async () => {
        // --- ARRANGE ---
        const errorMessage = "Ranking konnte nicht geladen werden.";
        getPopularMangas.mockRejectedValueOnce(new Error("Network Error"));

        // --- ACT ---
        render(<MangaLibraryLeaderboard />);

        // --- ASSERT ---
        await waitFor(() => {
            expect(screen.getByText(errorMessage)).toBeInTheDocument();
        });

        // Retry Button prüfen
        const retryBtn = screen.getByRole("button", { name: /Erneut versuchen/i });
        expect(retryBtn).toBeInTheDocument();
    });

    // ===========================================================================
    // TEST 4: Leeres Ranking
    // ===========================================================================
    test("zeigt Platzhalter-Nachricht, wenn keine Daten vorhanden sind", async () => {
        // --- ARRANGE ---
        getPopularMangas.mockResolvedValueOnce([]); // Leeres Array zurückgeben

        // --- ACT ---
        render(<MangaLibraryLeaderboard />);

        // --- ASSERT ---
        await waitFor(() => {
            expect(screen.getByText(/Noch keine Einträge vorhanden/i)).toBeInTheDocument();
        });
    });
});