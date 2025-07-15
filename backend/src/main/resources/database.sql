
-- Bảng users
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(5) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    enabled BOOLEAN NOT NULL DEFAULT FALSE, 
    role VARCHAR(20) NOT NULL DEFAULT 'PLAYER'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Bảng authentication_code
CREATE TABLE IF NOT EXISTS authentication_code (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    code CHAR(6) NOT NULL,
    expires_at DATETIME NOT NULL,
    used BOOLEAN NOT NULL DEFAULT FALSE,
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Thêm cột owner_id vào bảng sports_fields (nếu chưa có)
ALTER TABLE sports_fields ADD COLUMN IF NOT EXISTS owner_id BIGINT;
ALTER TABLE sports_fields ADD CONSTRAINT fk_owner FOREIGN KEY (owner_id) REFERENCES users(id);

-- Tạo bảng maintenance nếu chưa có
CREATE TABLE IF NOT EXISTS maintenance (
    id BIGSERIAL PRIMARY KEY,
    field_id BIGINT NOT NULL REFERENCES sports_fields(id),
    date DATE NOT NULL,
    description TEXT,
    priority VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'SCHEDULED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

