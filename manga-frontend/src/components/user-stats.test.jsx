import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import UserStats from "./UserStats";
import { useAuth } from "../contexts/AuthContext";
import { getUserStats } from "../services/leaderboard-service";

// 1. Mocks definieren
jest.mock("../contexts/AuthContext");
jest.mock("../services/leaderboard-service");

describe("UserStats Component", () => {
    const mockUser = { id: "123", username: "TestGamer" };
    const mockStats = {
        username: "TestGamer",
        gamesPlayed: 10,
        totalScore: 500,
        averageScore: 50.0,
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    // ===========================================================================
    // TEST: ERFOLGREICHES LADEN DER STATS
    // ===========================================================================
    test("lädt und zeigt Statistiken an, wenn der User eingeloggt ist", async () => {
        // --- ARRANGE ---
        useAuth.mockReturnValue({
            isAuthenticated: true,
            user: mockUser,
        });
        getUserStats.mockResolvedValueOnce(mockStats);

        // --- ACT ---
        render(<UserStats />);

        // --- ASSERT ---
        // Prüfen, ob Ladezustand erscheint
        expect(screen.getByText(/Lädt deine Statistiken/i)).toBeInTheDocument();

        // Warten, bis die Daten angezeigt werden
        await waitFor(() => {
            expect(screen.getByText("10")).toBeInTheDocument(); // Games Played
            expect(screen.getByText("500")).toBeInTheDocument(); // Total Score
            expect(screen.getByText("50.0")).toBeInTheDocument(); // Average
        });

        expect(getUserStats).toHaveBeenCalledWith("123");
        expect(screen.getByText(/Spieler:/i)).toHaveTextContent("TestGamer");
    });

    // ===========================================================================
    // TEST: NICHT EINGELOGGT
    // ===========================================================================
    test("zeigt Login-Aufforderung, wenn User nicht authentifiziert ist", () => {
        // --- ARRANGE ---
        useAuth.mockReturnValue({
            isAuthenticated: false,
            user: null,
        });

        // --- ACT ---
        render(<UserStats />);

        // --- ASSERT ---
        expect(screen.getByText(/Login erforderlich/i)).toBeInTheDocument();
        expect(screen.getByRole("link", { name: /Zum Login/i })).toBeInTheDocument();
        expect(getUserStats).not.toHaveBeenCalled();
    });

    // ===========================================================================
    // TEST: FEHLERFALL
    // ===========================================================================
    test("zeigt Fehlermeldung an, wenn der API-Call fehlschlägt", async () => {
        // --- ARRANGE ---
        useAuth.mockReturnValue({
            isAuthenticated: true,
            user: mockUser,
        });
        getUserStats.mockRejectedValueOnce(new Error("API Error"));

        // --- ACT ---
        render(<UserStats />);

        // --- ASSERT ---
        await waitFor(() => {
            expect(screen.getByText(/Fehler beim Laden der Statistiken/i)).toBeInTheDocument();
        });

        // Prüfen, ob der "Erneut versuchen"-Button da ist
        const retryButton = screen.getByRole("button", { name: /Erneut versuchen/i });
        expect(retryButton).toBeInTheDocument();
    });

    // ===========================================================================
    // TEST: REFRESH FUNKTIONALITÄT
    // ===========================================================================
    test("aktualisiert die Daten, wenn der Refresh-Button geklickt wird", async () => {
        // --- ARRANGE ---
        useAuth.mockReturnValue({ isAuthenticated: true, user: mockUser });
        getUserStats.mockResolvedValue(mockStats);
        render(<UserStats />);

        await waitFor(() => expect(getUserStats).toHaveBeenCalledTimes(1));

        // --- ACT ---
        const refreshButton = screen.getByRole("button", { name: /Aktualisieren/i });
        fireEvent.click(refreshButton);

        // --- ASSERT ---
        expect(getUserStats).toHaveBeenCalledTimes(2);
    });
});