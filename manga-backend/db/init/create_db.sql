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
('Shojo'),
('Josei'),
('Psychological'),
('Sports');

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
('One Piece', 1, 'https://upload.wikimedia.org/wikipedia/en/9/90/One_Piece%2C_Volume_61_Cover_%28Japanese%29.jpg', 1, 1),
('One Piece', 2, 'https://upload.wikimedia.org/wikipedia/en/9/90/One_Piece%2C_Volume_61_Cover_%28Japanese%29.jpg', 1, 1),
('Naruto', 1, 'https://upload.wikimedia.org/wikipedia/en/thumb/9/94/NarutoCoverTankobon1.jpg/250px-NarutoCoverTankobon1.jpg', 1, 2),
('Attack on Titan', 1, 'https://upload.wikimedia.org/wikipedia/en/d/d6/Shingeki_no_Kyojin_manga_volume_1.jpg', 2, 3),
('Demon Slayer', 1, 'https://upload.wikimedia.org/wikipedia/en/thumb/0/09/Demon_Slayer_-_Kimetsu_no_Yaiba%2C_volume_1.jpg/250px-Demon_Slayer_-_Kimetsu_no_Yaiba%2C_volume_1.jpg', 1, 2),
('Bleach', 1, 'https://upload.wikimedia.org/wikipedia/en/3/3f/Bleach_%28manga%29_1.png', 1, 1),
('Bleach', 2, 'https://upload.wikimedia.org/wikipedia/en/3/3f/Bleach_%28manga%29_1.png', 1, 1),
('Jujutsu Kaisen', 1, 'https://upload.wikimedia.org/wikipedia/en/thumb/4/46/Jujutsu_kaisen.jpg/250px-Jujutsu_kaisen.jpg', 1, 2),
('Chainsaw Man', 1, 'https://upload.wikimedia.org/wikipedia/en/thumb/2/24/Chainsawman.jpg/250px-Chainsawman.jpg', 2, 2),
('Death Note', 1, 'https://upload.wikimedia.org/wikipedia/en/thumb/6/6f/Death_Note_Vol_1.jpg/250px-Death_Note_Vol_1.jpg', 5, 1),
('Tokyo Ghoul', 1, 'https://upload.wikimedia.org/wikipedia/en/thumb/e/e5/Tokyo_Ghoul_volume_1_cover.jpg/250px-Tokyo_Ghoul_volume_1_cover.jpg', 2, 3),
('Hunter x Hunter', 1, 'https://upload.wikimedia.org/wikipedia/en/e/e8/Hunter_%C3%97_Hunter_vol._1.png', 1, 1),
('Hunter x Hunter', 2, 'https://upload.wikimedia.org/wikipedia/en/e/e8/Hunter_%C3%97_Hunter_vol._1.png', 1, 1),
('My Hero Academia', 1, 'https://upload.wikimedia.org/wikipedia/en/thumb/5/5a/Boku_no_Hero_Academia_Volume_1.png/250px-Boku_no_Hero_Academia_Volume_1.png', 1, 2),
('Fruits Basket', 1, 'https://upload.wikimedia.org/wikipedia/en/thumb/e/e6/Fruits_Basket_manga.jpg/250px-Fruits_Basket_manga.jpg', 3, 2),
('Sailor Moon', 1, 'https://upload.wikimedia.org/wikipedia/en/e/e5/SMVolume1.jpg', 3, 1),
('Blue Lock', 1, 'https://upload.wikimedia.org/wikipedia/en/c/c6/Blue_Lock_manga_volume_1.png', 6, 3),
('Vinland Saga', 1, 'https://upload.wikimedia.org/wikipedia/en/thumb/5/51/Vinland_Saga_volume_01_cover.jpg/250px-Vinland_Saga_volume_01_cover.jpg', 2, 1),
('Berserk', 1, 'https://upload.wikimedia.org/wikipedia/en/thumb/4/4a/Berserk_vol01.png/250px-Berserk_vol01.png', 2, 3),
('Spy x Family', 1, 'https://upload.wikimedia.org/wikipedia/en/thumb/5/51/Spy_Family_vol_1.jpg/250px-Spy_Family_vol_1.jpg', 1, 2),
('Kaiju No. 8', 1, 'https://upload.wikimedia.org/wikipedia/en/thumb/c/cd/Kaiju_No_8.jpg/250px-Kaiju_No_8.jpg', 1, 2),
('Nana', 1, 'https://static.wikia.nocookie.net/vsbattles/images/0/09/NANA%28manga%29.jpg/revision/latest?cb=20210305234549', 4, 1),
('Kimi ni Todoke', 1, 'https://upload.wikimedia.org/wikipedia/en/9/9a/Kimi_ni_Todoke_vol_1.jpg', 3, 2),
('Fullmetal Alchemist', 1, 'https://upload.wikimedia.org/wikipedia/en/thumb/9/9d/Fullmetal123.jpg/250px-Fullmetal123.jpg', 1, 1);

INSERT IGNORE INTO user_manga (user_id, manga_id, status, rating, note) VALUES
(1, 1, 'COMPLETED', 9, 'Starker Start'),
(1, 2, 'READING', 2, 'Bin dran'),
(2, 3, 'PLANNED', NULL, 'Als naechstes'),
(3, 4, 'DROPPED', 4, 'Nicht mein Stil'),
(2, 5, 'COMPLETED', 8, 'Sehr spannend');
