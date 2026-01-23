CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_google_account unique,
    accessToken TEXT,
    name TEXT,
    email unique,
    password TEXT
)

CREATE TABLE IF NOT EXISTS verification_codes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_user INTEGER,
    email unique,
    code TEXT unique,
    expiresAt DATETIME DEFAULT (DATETIME('now', '+10 minutes')),
    used BOOLEAN DEFAULT 0,
    usedAt DATETIME,
    FOREIGN KEY (id_user) REFERENCES users(id),
    FOREIGN KEY (email) REFERENCES users(email)
);

-- Trigger to delete old codes for the same email before inserting a new one
CREATE TRIGGER IF NOT EXISTS cleanup_old_codes_per_user
BEFORE INSERT ON verification_codes
BEGIN
    DELETE FROM verification_codes WHERE email = NEW.email;
END;

-- Trigger to clean up all expired codes before any new code is inserted
CREATE TRIGGER IF NOT EXISTS cleanup_expired_codes
BEFORE INSERT ON verification_codes
BEGIN
    DELETE FROM verification_codes WHERE expiresAt < DATETIME('now');
END;

-- Trigger to clean up all expired codes before any code is updated
CREATE TRIGGER IF NOT EXISTS cleanup_expired_codes_on_update
BEFORE UPDATE ON verification_codes
BEGIN
    DELETE FROM verification_codes WHERE expiresAt < DATETIME('now');
END;

