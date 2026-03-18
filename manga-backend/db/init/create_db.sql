CREATE DATABASE IF NOT EXISTS manga_db;
USE manga_db;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(50) UNIQUE
);

CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS publishers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS mangas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(50) NOT NULL,
  volume INT NOT NULL,

  category_id INT NOT NULL,
  publisher_id INT NOT NULL,

  CONSTRAINT fk_manga_category
    FOREIGN KEY (category_id) REFERENCES categories(id),

  CONSTRAINT fk_manga_publisher
    FOREIGN KEY (publisher_id) REFERENCES publishers(id)
);

CREATE TABLE IF NOT EXISTS user_manga (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  manga_id INT NOT NULL,

  status ENUM('PLANNED', 'READING', 'COMPLETED', 'DROPPED') NOT NULL,
  rating INT,
  note VARCHAR(255),

  CONSTRAINT fk_user_manga_user
    FOREIGN KEY (user_id) REFERENCES users(id),

  CONSTRAINT fk_user_manga_manga
    FOREIGN KEY (manga_id) REFERENCES mangas(id),

  CONSTRAINT uq_user_manga UNIQUE (user_id, manga_id)
);



--> Kategorien
INSERT INTO categories (name) VALUES
('Shonen'),
('Seinen'),
('Shojo');

--> Verlage
INSERT INTO publishers (name) VALUES
('Carlsen'),
('Tokyopop'),
('Kazé');

--> Benutzer
INSERT INTO users (username, email) VALUES
('hans', 'hans@mail.com'),
('tom', 'tom@mail.com'),
('marco', 'marco@mail.com');

--> Manga
INSERT INTO mangas (title, volume, category_id, publisher_id) VALUES
('One Piece', 1, 1, 1),
('One Piece', 2, 1, 1),
('Naruto', 1, 1, 2),
('Attack on Titan', 1, 2, 3),
('Demon Slayer', 1, 1, 2);

-->Status( User-manga
INSERT INTO user_manga (user_id, manga_id, status, rating, note) VALUES
(1, 1, 'COMPLETED', 9, 'Starker Start'),
(1, 2, 'READING', 2, 'Bin dran'),
(2, 3, 'PLANNED', NULL, 'Als nächstes'),
(3, 4, 'DROPPED', 4, 'Nicht mein Stil'),
(2, 5, 'COMPLETED', 8, 'Sehr spannend');

