-- Authentication tables for Document Management System

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  avatar_url TEXT,
  department VARCHAR(100),
  phone VARCHAR(20),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP
);

-- Sessions table (optional - for tracking active sessions)
CREATE TABLE IF NOT EXISTS user_sessions (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  token_hash VARCHAR(255) UNIQUE NOT NULL,
  ip_address VARCHAR(45),
  user_agent TEXT,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Activity logs
CREATE TABLE IF NOT EXISTS activity_logs (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  description TEXT,
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT NOW()
);
SELECT * From users;
-- Indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON user_sessions(token_hash);
CREATE INDEX IF NOT EXISTS idx_logs_user ON activity_logs(user_id);

-- Insert default admin account (password: admin123)
-- Password hash for 'admin123' using bcrypt
INSERT INTO users (email, password, full_name, role, department) 
VALUES (
  'admin@company.com',
  '$2b$10$rXK5Ew5qXqGxJZ0Kw5Zw5eYGZm5qXqGxJZ0Kw5Zw5eYGZm5qXqGx.',
  'System Administrator',
  'admin',
  'IT Department'
) ON CONFLICT (email) DO NOTHING;

-- Insert default user account (password: user123)
INSERT INTO users (email, password, full_name, role, department) 
VALUES (
  'user@company.com',
  '$2b$10$rXK5Ew5qXqGxJZ0Kw5Zw5eYGZm5qXqGxJZ0Kw5Zw5eYGZm5qXqGx.',
  'John Doe',
  'user',
  'Sales Department'
) ON CONFLICT (email) DO NOTHING;


UPDATE users 
SET 
    -- Lấy mật khẩu hash từ tài khoản bạn vừa đăng ký thành công
    password = (SELECT password FROM users WHERE email = 'hungnguyen12102004@gmail.com'),
    
    -- Đảm bảo admin luôn active (đề phòng data cũ bị thiếu)
    is_active = true 
WHERE 
    email = 'admin@company.com'; -- Email của admin demo