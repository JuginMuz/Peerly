-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: db
-- Generation Time: March 11, 2025 at 20:34
-- Server version: 8.0.24
-- PHP Version: 7.4.20

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sd2_db`
--

-- ======================================================
-- 1. Create the database (if it doesn't already exist)
-- ======================================================
CREATE DATABASE IF NOT EXISTS sd2_db;

-- Switch to the new database
USE sd2_db;

-- ======================================================
-- 2. Create table: fields_of_study
-- ======================================================
CREATE TABLE IF NOT EXISTS fields_of_study (
    field_id INT NOT NULL AUTO_INCREMENT,
    field_name VARCHAR(255) NOT NULL,
    PRIMARY KEY (field_id)
) ENGINE=InnoDB;

-- ======================================================
-- 3. Create table: users (with user_seq auto-increment)
-- ======================================================
-- We will store an INT (user_seq) as the primary key, which MySQL will auto-increment.
-- We'll generate user_id in a BEFORE INSERT trigger:
--   user_id = UPPER(LEFT(first_name, 3)) + zero-padded 4-digit user_seq
-- Example: For first_name "Alice" and user_seq = 1, user_id => "ALI0001"


CREATE TABLE IF NOT EXISTS users (
    user_seq INT NOT NULL AUTO_INCREMENT,
    
    -- user_id will be generated automatically by trigger
    user_id VARCHAR(7) NOT NULL,

    first_name VARCHAR(25),
    last_name VARCHAR(25),
    email_id VARCHAR(500) NOT NULL UNIQUE,
    profile_picture VARCHAR(500),
    gender VARCHAR(25),
    bio TEXT,
    field_id INT,
    dob DATE,
    city TEXT,
    work_at TEXT,
    went_to TEXT,
    goes_to TEXT,
    relationship_status TEXT,

    -- user_seq is our actual primary key (AI):
    PRIMARY KEY (user_seq),

    -- Make user_id unique so no duplicates
    UNIQUE KEY (user_id),

    CONSTRAINT fk_users_fields_of_study
        FOREIGN KEY (field_id)
        REFERENCES fields_of_study(field_id)
        ON UPDATE CASCADE
        ON DELETE SET NULL
) ENGINE=InnoDB;

-- ======================================================
-- 4. BEFORE INSERT trigger: generate user_id from first_name + user_seq
-- ======================================================
DELIMITER $$
CREATE TRIGGER trg_auto_user_id
BEFORE INSERT ON users
FOR EACH ROW
BEGIN
    DECLARE prefix VARCHAR(3);
    DECLARE countForPrefix INT;

    -- Extract the first three letters (or fewer if name is shorter) and convert to uppercase.
    SET prefix = UPPER(LEFT(NEW.first_name, 3));
    
    -- Count existing users whose user_id starts with the prefix.
    SELECT COUNT(*) INTO countForPrefix FROM users WHERE user_id LIKE CONCAT(prefix, '%');
    
    -- Generate a new user_id: prefix + (count + 1), padded to 4 digits.
    SET NEW.user_id = CONCAT(prefix, LPAD(countForPrefix + 1, 4, '0'));
    
    -- Optional: Verify that the generated user_id matches the expected pattern.
    IF NEW.user_id NOT REGEXP '^[A-Z]{2,3}[0-9]{4}$' THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Invalid user_id format.';
    END IF;
END;
$$
DELIMITER ;


-- ======================================================
-- 5. Create table: authentication (1-to-1 with users.user_id)
-- ======================================================
CREATE TABLE IF NOT EXISTS authentication (
    user_id VARCHAR(7) NOT NULL,
    password VARCHAR(60) NOT NULL,     -- e.g., bcrypt/Argon2 hash
    PRIMARY KEY (user_id),
    CONSTRAINT fk_auth_users
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
) ENGINE=InnoDB;

-- ======================================================
-- 6. Create table: tags
-- ======================================================
CREATE TABLE IF NOT EXISTS tags (
    tag_id INT NOT NULL AUTO_INCREMENT,
    tag_name VARCHAR(255) NOT NULL,
    PRIMARY KEY (tag_id)
) ENGINE=InnoDB;

-- ======================================================
-- 7. Create table: posts
-- ======================================================
CREATE TABLE IF NOT EXISTS posts (
    post_id BIGINT NOT NULL AUTO_INCREMENT,
    user_id VARCHAR(7),
    description TEXT,
    media_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (post_id),
    CONSTRAINT fk_posts_users
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
) ENGINE=InnoDB;

-- ======================================================
-- 8. Create table: post_tags (many-to-many between posts and tags)
-- ======================================================
CREATE TABLE IF NOT EXISTS post_tags (
    post_id BIGINT NOT NULL,
    tag_id INT NOT NULL,
    PRIMARY KEY (post_id, tag_id),
    CONSTRAINT fk_post_tags_posts
        FOREIGN KEY (post_id)
        REFERENCES posts(post_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT fk_post_tags_tags
        FOREIGN KEY (tag_id)
        REFERENCES tags(tag_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
) ENGINE=InnoDB;

-- ======================================================
-- 9. Create table: likes (many-to-many between users and posts)
-- ======================================================
CREATE TABLE IF NOT EXISTS likes (
    user_id VARCHAR(7) NOT NULL,
    post_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, post_id),
    CONSTRAINT fk_likes_users
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT fk_likes_posts
        FOREIGN KEY (post_id)
        REFERENCES posts(post_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
) ENGINE=InnoDB;

-- ======================================================
-- 10. Create table: comments
-- ======================================================
CREATE TABLE IF NOT EXISTS comments (
    comment_id BIGINT NOT NULL AUTO_INCREMENT,
    user_id VARCHAR(7),
    post_id BIGINT,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (comment_id),
    CONSTRAINT fk_comments_users
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT fk_comments_posts
        FOREIGN KEY (post_id)
        REFERENCES posts(post_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
) ENGINE=InnoDB;

-- ======================================================
-- Done: The database 'sd2_db' with all required tables and constraints is created
--       user_id is automatically generated based on first_name + 4-digit sequence
-- ======================================================
-- ======================================================
-- Schema creation complete. Now insert sample data
-- ======================================================

-- 1) Seed the fields_of_study
INSERT INTO fields_of_study (field_name)
VALUES
    ('Computer Science'),
    ('Mechanical Engineering'),
    ('Business Administration');

-- 2) Insert multiple users
--    (We do NOT specify user_seq or user_id; the trigger will fill user_id)
INSERT INTO users (
  first_name,
  last_name,
  email_id,
  field_id,
  gender,
  dob,
  city,
  bio,
  relationship_status
) VALUES
('Alice',   'Smith',   'alice.smith@example.com', 1, 'Female',   '2000-05-10', 'New York', 'I love CS!',      'Single'),
('Bob',     'Johnson', 'bob.johnson@example.com',  1, 'Male',     '1998-02-15', 'Boston',   'Full-stack dev.', 'In a relationship'),
('Charlie', 'Davis',   'charlie.davis@example.com',2, 'Male',     '1999-07-22', 'Chicago',  'Mechanical eng.', 'Married'),
('Diana',   'Evans',   'diana.evans@example.com',  3, 'Female',   '2001-11-01', 'Houston',  'Business major.', 'Single');

-- 3) Insert matching authentication rows for each user
--    We'll match them by first_name/last_name to get their user_id
--    (In real code, you'd do it in your application logic)
INSERT INTO authentication (user_id, password)
SELECT user_id, '$2b$10$abcAliceHash'  -- Example hash placeholder
FROM users
WHERE first_name='Alice' AND last_name='Smith'
LIMIT 1;

INSERT INTO authentication (user_id, password)
SELECT user_id, '$2b$10$abcBobHash'
FROM users
WHERE first_name='Bob' AND last_name='Johnson'
LIMIT 1;

INSERT INTO authentication (user_id, password)
SELECT user_id, '$2b$10$abcCharlieHash'
FROM users
WHERE first_name='Charlie' AND last_name='Davis'
LIMIT 1;

INSERT INTO authentication (user_id, password)
SELECT user_id, '$2b$10$abcDianaHash'
FROM users
WHERE first_name='Diana' AND last_name='Evans'
LIMIT 1;

-- 4) Insert tags
INSERT INTO tags (tag_name)
VALUES
    ('Node.js'),
    ('MySQL'),
    ('Marketing');

-- 5) Insert posts referencing user_id by subselect (matching user’s name)
INSERT INTO posts (user_id, description, media_url)
SELECT u.user_id, 'My first CS post!', 'https://example.com/images/code.png'
FROM users u
WHERE u.first_name='Alice' AND u.last_name='Smith'
LIMIT 1;

INSERT INTO posts (user_id, description, media_url)
SELECT u.user_id, 'Learning Node.js is fun', 'https://example.com/images/node.png'
FROM users u
WHERE u.first_name='Bob' AND u.last_name='Johnson'
LIMIT 1;

INSERT INTO posts (user_id, description, media_url)
SELECT u.user_id, 'New mechanical design study!', 'https://example.com/images/engine.jpg'
FROM users u
WHERE u.first_name='Charlie' AND u.last_name='Davis'
LIMIT 1;

-- 6) Insert post_tags (many-to-many). We'll pick specific posts/tags by matching
--    the post descriptions we just inserted.

-- a) Tag "My first CS post!" with "Node.js" (tag_id=1)
INSERT INTO post_tags (post_id, tag_id)
SELECT p.post_id, 1
FROM posts p
WHERE p.description='My first CS post!'
LIMIT 1;

-- b) Tag "Learning Node.js is fun" with "Node.js" (tag_id=1) AND "MySQL" (tag_id=2)
INSERT INTO post_tags (post_id, tag_id)
SELECT p.post_id, 1
FROM posts p
WHERE p.description='Learning Node.js is fun'
LIMIT 1;

INSERT INTO post_tags (post_id, tag_id)
SELECT p.post_id, 2
FROM posts p
WHERE p.description='Learning Node.js is fun'
LIMIT 1;

-- c) Tag "New mechanical design study!" with "MySQL" (tag_id=2)
INSERT INTO post_tags (post_id, tag_id)
SELECT p.post_id, 2
FROM posts p
WHERE p.description='New mechanical design study!'
LIMIT 1;

-- 7) Insert likes (many-to-many: users <-> posts)

-- Bob likes Alice's post
INSERT INTO likes (user_id, post_id)
SELECT u.user_id, p.post_id
FROM users u
JOIN posts p ON p.description='My first CS post!'
WHERE u.first_name='Bob'
  AND u.last_name='Johnson'
LIMIT 1;

-- Alice likes Bob's post
INSERT INTO likes (user_id, post_id)
SELECT u.user_id, p.post_id
FROM users u
JOIN posts p ON p.description='Learning Node.js is fun'
WHERE u.first_name='Alice'
  AND u.last_name='Smith'
LIMIT 1;

-- Diana likes Charlie's post
INSERT INTO likes (user_id, post_id)
SELECT u.user_id, p.post_id
FROM users u
JOIN posts p ON p.description='New mechanical design study!'
WHERE u.first_name='Diana'
  AND u.last_name='Evans'
LIMIT 1;

-- 8) Insert comments referencing user_id and post_id

-- Alice comments on her own post
INSERT INTO comments (user_id, post_id, description)
SELECT u.user_id, p.post_id, 'Thanks for reading my post!'
FROM users u
JOIN posts p ON p.description='My first CS post!'
WHERE u.first_name='Alice'
  AND u.last_name='Smith'
LIMIT 1;

-- Bob comments on Charlie’s post
INSERT INTO comments (user_id, post_id, description)
SELECT u.user_id, p.post_id, 'Great mechanical design!'
FROM users u
JOIN posts p ON p.description='New mechanical design study!'
WHERE u.first_name='Bob'
  AND u.last_name='Johnson'
LIMIT 1;

-- Done inserting sample data!
