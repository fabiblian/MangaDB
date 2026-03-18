# Projektabgabe 294_LB

Diese Abgabe enthaelt:

- `manga-frontend` (React/Vite Frontend)
- `manga-backend` (Spring Boot Backend)
- `294_Projektdokumentation.pdf` (Dokumentation)

## Was in die ZIP gehoert

- `manga-frontend/src`
- `manga-frontend/public`
- `manga-frontend/package.json`
- `manga-frontend/package-lock.json`
- `manga-frontend/vite.config.js`
- `manga-frontend/index.html`
- `manga-backend/src`
- `manga-backend/pom.xml`
- `manga-backend/docker-compose.yml` (falls verwendet)
- `manga-backend/db` (falls verwendet)
- `294_Projektdokumentation.pdf`
- `README.md` (diese Datei)

## Was nicht in die ZIP gehoert

- `node_modules`
- `dist`
- `target`
- `.git`
- `.settings`
- IDE-Metadaten (`.project`, `.classpath`, etc.)

## Projekt starten

## 1. Backend starten

Im Ordner `manga-backend`:

```bash
mvn spring-boot:run
```

## 2. Frontend starten

Im Ordner `manga-frontend`:

```bash
npm install
npm run dev
```

## 3. Frontend-Tests ausfuehren

Im Ordner `manga-frontend`:

```bash
npm test
```

## Empfohlene ZIP-Struktur

```text
294_LB.zip
|-- manga-frontend/
|-- manga-backend/
|-- 294_Projektdokumentation.pdf
`-- README.md
```