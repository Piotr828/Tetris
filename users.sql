CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    login TEXT NOT NULL,
    password TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    xp INTEGER DEFAULT 0,
    best_score INTEGER DEFAULT 0
);
SELECT * FROM users;
ALTER TABLE users ADD COLUMN ostatnia_zmiana TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
