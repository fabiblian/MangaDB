import React, { useState, useEffect } from 'react';
import { useAuth } from "../contexts/AuthContext";

import { startMangaSession, finishMangaSession } from '../services/manga-service';

const MangaLibrarySession = ({ categoryId, user }) => {
    const [session, setSession] = useState(null);
    const [processedCount, setProcessedCount] = useState(0);

    // 1. Session starten, sobald die Komponente geladen wird
    useEffect(() => {
        const init = async () => {
            const newSession = await startMangaSession(user.id, categoryId);
            setSession(newSession);
        };
        init();
    }, [user.id, categoryId]);

    const handleMangaAction = () => {
        // User hat einen Manga interagiert (z.B. gelesen/geliked)
        setProcessedCount(prev => prev + 1);
    };

    const handleFinish = async () => {
        if (session) {
            await finishMangaSession(session.id, processedCount);
            alert(`Session beendet! Du hast ${processedCount} Mangas bearbeitet.`);
            // Hier könntest du den User zurück zur Übersicht leiten
        }
    };

    return (
        <div className="manga-session-card">
            <h2>Manga-Entdeckung: {categoryId}</h2>
            <p>In dieser Session bearbeitet: <strong>{processedCount}</strong></p>

            {/* Hier würdest du deine Manga-Liste rendern */}
            <button onClick={handleMangaAction}>Manga als 'gelesen' markieren (+1 Punkt)</button>

            <hr />

            <button
                className="finish-btn"
                onClick={handleFinish}
                style={{ backgroundColor: '#28a745', color: 'white' }}
            >
                Session im Profil speichern
            </button>
        </div>
    );
};

export default MangaLibrarySession;