-- Sample data for users
INSERT INTO users (id_google_account, accessToken, name, email, password) VALUES
('google_123', 'access_token_abc', 'Juan Perez', 'juan.perez@example.com', 'hashed_password_1'),
('google_456', 'access_token_def', 'Maria Garcia', 'maria.garcia@example.com', 'hashed_password_2'),
(NULL, NULL, 'Usuario Local', 'local@test.com', 'local_pass_123');

-- Sample data for verification codes
INSERT INTO verification_codes (email, code, expiresAt, used) VALUES
('juan.perez@example.com', '123456', DATETIME('now', '+10 minutes'), 0),
('maria.garcia@example.com', '654321', DATETIME('now', '-5 minutes'), 0), -- Expired
('local@test.com', '000000', DATETIME('now', '+10 minutes'), 1); -- Used
