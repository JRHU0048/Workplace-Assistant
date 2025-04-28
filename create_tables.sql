-- 1. 创建数据库
CREATE DATABASE IF NOT EXISTS career_helper 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_general_ci;

-- 2. 使用该数据库
USE career_helper;

-- 3. 删除已存在的表
DROP TABLE IF EXISTS qa_records;
DROP TABLE IF EXISTS users;

-- 4. 创建用户表
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  openid VARCHAR(100),
  nickname VARCHAR(100),
  avatar VARCHAR(255),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. 创建问答记录表
CREATE TABLE qa_records (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (username) REFERENCES users(username) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. 创建索引（提高查询性能）
CREATE INDEX idx_username ON qa_records(username);
CREATE INDEX idx_created_at ON qa_records(created_at);

-- 7. 验证表结构
SHOW TABLES;
DESCRIBE users;
DESCRIBE qa_records;


/* -- 1. 创建数据库
CREATE DATABASE IF NOT EXISTS career_helper 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_general_ci;

-- 2. 使用该数据库
USE career_helper;

-- 3. 删除已存在的表
DROP TABLE IF EXISTS qa_records;
DROP TABLE IF EXISTS users;

-- 4. 创建用户表
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  openid VARCHAR(100) NOT NULL,
  nickname VARCHAR(100),
  avatar VARCHAR(255),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY (openid)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. 创建问答记录表
CREATE TABLE qa_records (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. 创建索引（提高查询性能）
CREATE INDEX idx_user_id ON qa_records(user_id);
CREATE INDEX idx_created_at ON qa_records(created_at);

-- 7. 验证表结构
SHOW TABLES;
DESCRIBE users;
DESCRIBE qa_records; */

