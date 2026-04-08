CREATE DATABASE IF NOT EXISTS manga_db;
USE manga_db;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL
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
  image_url VARCHAR(500),
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

INSERT IGNORE INTO categories (name) VALUES
('Shonen'),
('Seinen'),
('Shojo');

INSERT IGNORE INTO publishers (name) VALUES
('Carlsen'),
('Tokyopop'),
('Kaze');

INSERT IGNORE INTO users (username, email, password, role) VALUES
('hans', 'hans@mail.com', '$2a$10$Y7G8mB7xWjL6kzP0jQK1R.nx6pXf7S7QYfQx9g8Qw2w7bJm4Q5G4y', 'USER'),
('tom', 'tom@mail.com', '$2a$10$Y7G8mB7xWjL6kzP0jQK1R.nx6pXf7S7QYfQx9g8Qw2w7bJm4Q5G4y', 'USER'),
('marco', 'marco@mail.com', '$2a$10$Y7G8mB7xWjL6kzP0jQK1R.nx6pXf7S7QYfQx9g8Qw2w7bJm4Q5G4y', 'USER'),
('admin', 'admin@manga.local', '$2a$10$QHgE6bD0x0mJ8uXbTLTxW.1xM6n8D4L3m9j6v3f0N4J0qQnS6kM2u', 'ADMIN');

INSERT IGNORE INTO mangas (title, volume, image_url, category_id, publisher_id) VALUES
('One Piece', 1, '/covers/onepeace.jpg', 1, 1),
('One Piece', 2, '/covers/onepeace.jpg', 1, 1),
('Naruto', 1, '/covers/naruto.jpg', 1, 2),
('Attack on Titan', 1, '/covers/aot.jpg', 2, 3),
('Demon Slayer', 1, NULL, 1, 2);

INSERT IGNORE INTO user_manga (user_id, manga_id, status, rating, note) VALUES
(1, 1, 'COMPLETED', 9, 'Starker Start'),
(1, 2, 'READING', 2, 'Bin dran'),
(2, 3, 'PLANNED', NULL, 'Als naechstes'),
(3, 4, 'DROPPED', 4, 'Nicht mein Stil'),
(2, 5, 'COMPLETED', 8, 'Sehr spannend');
