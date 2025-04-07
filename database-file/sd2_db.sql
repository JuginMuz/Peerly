-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: db
-- Generation Time: Mar 17, 2025 at 03:36 PM
-- Server version: 9.2.0
-- PHP Version: 8.2.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Create Database: `sd2_db`
--
-- CREATE DATABASE sd2_db;

-- 
-- Selecting sd2_db
--
-- USE sd2_db;
--
-- Table structure for table `authentication`
--

CREATE TABLE `authentication` (
  `user_id` varchar(7) NOT NULL,
  `password` varchar(60) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `authentication`
--

INSERT INTO `authentication` (`user_id`, `password`) VALUES
('ALI0001', '$2b$10$abcAliceHash'),
('BOB0001', '$2b$10$abcBobHash'),
('CHA0001', '$2b$10$abcCharlieHash'),
('DIA0001', '$2b$10$abcDianaHash'),
('ETH0001', '$2b$10$hashEthan'),
('FIO0001', '$2b$10$hashFiona'),
('GEO0001', '$2b$10$hashGeorge'),
('HAN0001', '$2b$10$hashHannah'),
('IAN0001', '$2b$10$hashIan'),
('JUL0001', '$2b$10$hashJulia'),
('KEV0001', '$2b$10$hashKevin'),
('LAU0001', '$2b$10$hashLaura'),
('MIC0001', '$2b$10$hashMichael'),
('NAT0001', '$2b$10$hashNatalie');

-- --------------------------------------------------------

--
-- Table structure for table `comments`
--

CREATE TABLE `comments` (
  `comment_id` bigint NOT NULL,
  `user_id` varchar(7) DEFAULT NULL,
  `post_id` bigint DEFAULT NULL,
  `description` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `comments`
--

INSERT INTO `comments` (`comment_id`, `user_id`, `post_id`, `description`, `created_at`, `updated_at`) VALUES
(1, 'ALI0001', 1, 'Thanks for reading my post!', '2025-03-04 11:16:23', '2025-03-04 11:16:23'),
(2, 'BOB0001', 3, 'Nice!', '2025-03-04 11:16:23', '2025-03-13 21:00:23'),
(3, 'GUR0001', 3, 'I can relate!', '2025-03-13 20:59:28', '2025-03-13 20:59:28'),
(4, 'ETH0001', 7, 'Great insights on mechanical design!', '2025-03-17 14:30:38', '2025-03-17 14:30:38'),
(5, 'FIO0001', 8, 'Interesting perspective on business strategies.', '2025-03-17 14:30:38', '2025-03-17 14:30:38'),
(6, 'GEO0001', 9, 'Impressive electrical circuit innovations!', '2025-03-17 14:30:38', '2025-03-17 14:30:38'),
(7, 'HAN0001', 10, 'Fascinating dive into human psychology.', '2025-03-17 14:30:38', '2025-03-17 14:30:38'),
(8, 'IAN0001', 11, 'Data science is truly transformative.', '2025-03-17 14:30:38', '2025-03-17 14:30:38'),
(9, 'JUL0001', 12, 'Civil engineering marvels are inspiring.', '2025-03-17 14:30:38', '2025-03-17 14:30:38'),
(10, 'KEV0001', 13, 'Biology research always fascinates me.', '2025-03-17 14:30:38', '2025-03-17 14:30:38'),
(11, 'LAU0001', 14, 'Chemistry experiments are so creative!', '2025-03-17 14:30:38', '2025-03-17 14:30:38'),
(12, 'MIC0001', 15, 'Astrophysics is out of this world!', '2025-03-17 14:30:38', '2025-03-17 14:30:38'),
(13, 'NAT0001', 6, 'Algorithms are very intriguing!', '2025-03-17 14:30:38', '2025-03-17 14:30:38'),
(14, 'ALI0001', 5, 'Wow! I\'m super excited for the launch.', '2025-03-17 15:26:21', '2025-03-17 15:26:21');

-- --------------------------------------------------------

--
-- Table structure for table `fields_of_study`
--

CREATE TABLE `fields_of_study` (
  `field_id` int NOT NULL,
  `field_name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `fields_of_study`
--

INSERT INTO `fields_of_study` (`field_id`, `field_name`) VALUES
(1, 'Computer Science'),
(2, 'Mechanical Engineering'),
(3, 'Business Administration'),
(4, 'Computer Science'),
(5, 'Mechanical Engineering'),
(6, 'Business Administration'),
(7, 'Electrical Engineering'),
(8, 'Psychology'),
(9, 'Data Science'),
(10, 'Civil Engineering'),
(11, 'Biology'),
(12, 'Chemistry'),
(13, 'Physics');

-- --------------------------------------------------------

--
-- Table structure for table `likes`
--

CREATE TABLE `likes` (
  `user_id` varchar(7) NOT NULL,
  `post_id` bigint NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `likes`
--

INSERT INTO `likes` (`user_id`, `post_id`) VALUES
('BOB0001', 1),
('ALI0001', 2),
('DIA0001', 3),
('NAT0001', 6),
('ETH0001', 7),
('FIO0001', 8),
('GEO0001', 9),
('HAN0001', 10),
('IAN0001', 11),
('JUL0001', 12),
('KEV0001', 13),
('LAU0001', 14),
('MIC0001', 15);

-- --------------------------------------------------------

--
-- Table structure for table `posts`
--

CREATE TABLE `posts` (
  `post_id` bigint NOT NULL,
  `user_id` varchar(7) DEFAULT NULL,
  `description` text,
  `media_url` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `posts`
--

INSERT INTO `posts` (`post_id`, `user_id`, `description`, `media_url`, `created_at`, `updated_at`) VALUES
(1, 'ALI0001', 'Have a look at the newly introduced platform \"Peerly\" logo, by the Peerly team. I\'m excited for the launch.', '/images/Peerly-Logo.png', '2025-03-04 11:16:23', '2025-03-10 15:59:08'),
(2, 'BOB0001', 'Learning Node.js is fun', '/images/node.webp', '2025-03-04 11:16:23', '2025-03-10 16:06:14'),
(3, 'CHA0001', 'A trigger in MySQL is a special type of stored procedure that automatically executes in response to certain events on a specific table. Triggers help enforce business rules, maintain data integrity, and automate database operations.\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n', '', '2025-03-04 11:16:23', '2025-03-17 15:16:43'),
(4, 'ALI0001', 'Did you guys checked the latest screenshots shared by \"Peerly\"?\r\nHave a look!', '/images/updateonpeerly.png', '2025-03-11 15:13:07', '2025-03-11 15:16:02'),
(5, 'GUR0001', 'Look at our Class Diagram Guys!\r\nFun fact, I made it using PlantUML!', '/images/class_diagram.png', '2025-03-11 20:22:43', '2025-03-11 20:22:43'),
(6, 'ETH0001', 'Exploring new algorithms in computer science.', '/images/algorithm.jpeg', '2025-03-17 14:30:37', '2025-03-17 14:48:40'),
(7, 'FIO0001', 'My experience with advanced mechanical design.', '/images/mechanical_engineering.png', '2025-03-17 14:30:37', '2025-03-17 14:50:01'),
(8, 'GEO0001', 'Sharing insights on startup business strategies.', '/images/business_strategies.png', '2025-03-17 14:30:37', '2025-03-17 14:52:07'),
(9, 'HAN0001', 'Innovations in electrical circuit design.', '/images/electric_circuit.jpeg', '2025-03-17 14:30:37', '2025-03-17 14:55:01'),
(10, 'IAN0001', 'Human psychology and artificial intelligence (AI) are deeply interconnected, as AI systems are designed to mimic human cognition, decision-making, and problem-solving. Psychology helps AI researchers understand human perception, learning, and behavior, enabling the creation of intelligent systems like chatbots, recommendation algorithms, and autonomous machines. Cognitive psychology influences AI’s neural networks and deep learning, while behavioral psychology aids in human-AI interactions. AI also contributes to psychology by analyzing vast data sets for mental health diagnostics and behavioral insights. As AI evolves, ethical considerations and emotional intelligence integration become crucial in enhancing human-AI collaboration and improving psychological well-being.', '', '2025-03-17 14:30:37', '2025-03-17 15:01:05'),
(11, 'JUL0001', 'Data science tips, tricks, and best practices.', '/images/datascience.jpeg', '2025-03-17 14:30:37', '2025-03-17 15:03:21'),
(12, 'KEV0001', 'Marvels of modern civil engineering projects.', '/images/civil.jpeg', '2025-03-17 14:30:37', '2025-03-17 15:05:56'),
(13, 'LAU0001', 'Discoveries in cutting-edge biological research.', '/images/biological_research.jpeg', '2025-03-17 14:30:37', '2025-03-17 15:08:43'),
(14, 'MIC0001', 'Check this out for amazing chemistry experiments and findings.', '/images/chemistry.jpeg', '2025-03-17 14:30:37', '2025-03-17 15:11:14'),
(15, 'NAT0001', 'Deep dive into quantum physics and astrophysics.', '/images/quantum.png', '2025-03-17 14:30:37', '2025-03-17 15:12:36');

-- --------------------------------------------------------

--
-- Table structure for table `post_tags`
--

CREATE TABLE `post_tags` (
  `post_id` bigint NOT NULL,
  `tag_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `post_tags`
--

INSERT INTO `post_tags` (`post_id`, `tag_id`) VALUES
(1, 1),
(2, 1),
(5, 1),
(2, 2),
(3, 2),
(9, 5),
(13, 5),
(8, 6),
(7, 7),
(12, 7),
(5, 8),
(9, 8),
(11, 8),
(10, 9),
(14, 9),
(6, 10),
(10, 10),
(11, 10),
(15, 10),
(5, 11),
(6, 11),
(14, 11),
(7, 12),
(12, 12),
(15, 12),
(8, 13),
(13, 13);

-- --------------------------------------------------------

--
-- Table structure for table `tags`
--

CREATE TABLE `tags` (
  `tag_id` int NOT NULL,
  `tag_name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `tags`
--

INSERT INTO `tags` (`tag_id`, `tag_name`) VALUES
(1, 'Node.js'),
(2, 'MySQL'),
(5, 'Electronics'),
(6, 'Marketing'),
(7, 'Engineering'),
(8, 'JavaScript'),
(9, 'AI'),
(10, 'Python'),
(11, 'Science'),
(12, 'Physics'),
(13, 'Exciting');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_seq` int NOT NULL,
  `user_id` varchar(7) NOT NULL,
  `first_name` varchar(25) DEFAULT NULL,
  `last_name` varchar(25) DEFAULT NULL,
  `email_id` varchar(500) NOT NULL,
  `profile_picture` varchar(500) DEFAULT NULL,
  `gender` varchar(25) DEFAULT NULL,
  `bio` text,
  `field_id` int DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `city` text,
  `work_at` text,
  `went_to` text,
  `goes_to` text,
  `relationship_status` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_seq`, `user_id`, `first_name`, `last_name`, `email_id`, `profile_picture`, `gender`, `bio`, `field_id`, `dob`, `city`, `work_at`, `went_to`, `goes_to`, `relationship_status`) VALUES
(1, 'ALI0001', 'Alice', 'Smith', 'alice.smith@example.com', '/images/node.webp', 'Female', 'I love CS!', 1, '2000-05-10', 'New York', 'ABC Company', 'XYZ School', 'University of Roehampton, London', 'Single'),
(2, 'BOB0001', 'Bob', 'Johnson', 'bob.johnson@example.com', '/images/bob.jpeg', 'Male', 'Full-stack dev.', 1, '1998-02-15', 'Boston', 'Freelancer', 'CDF School', 'Graduated', 'In a relationship'),
(3, 'CHA0001', 'Charlie', 'Davis', 'charlie.davis@example.com', '/images/charlie.jpeg', 'Male', 'Mechanical eng.', 2, '1999-07-22', 'Chicago', NULL, NULL, NULL, 'Married'),
(4, 'DIA0001', 'Diana', 'Evans', 'diana.evans@example.com', '/images/diana.jpeg', 'Female', 'Business major.', 3, '2001-11-01', 'Houston', NULL, NULL, NULL, 'Single'),
(5, 'GUR0001', 'Gurkiratjot', 'Singh', 'gurkiratjotsingh@gmail.com', '/images/my.jpeg', 'Male', 'I work at \"Peerly\"', 1, '2004-10-25', 'London', 'Peerly Corp.', 'Ryan International School, India', 'University of Roehampton, London', 'Born single to remain single.'),
(6, 'ETH0001', 'Ethan', 'Brown', 'ethan.brown@example.com', NULL, 'Male', 'Exploring algorithms and coding challenges.', 1, '1997-08-30', 'San Francisco', NULL, NULL, NULL, 'Single'),
(7, 'FIO0001', 'Fiona', 'Green', 'fiona.green@example.com', NULL, 'Female', 'Passionate about mechanical design.', 2, '1998-04-12', 'Boston', NULL, NULL, NULL, 'Single'),
(8, 'GEO0001', 'George', 'Harris', 'george.harris@example.com', NULL, 'Male', 'Sharing insights on business strategies.', 3, '1996-09-05', 'New York', NULL, NULL, NULL, 'Married'),
(9, 'HAN0001', 'Hannah', 'Lee', 'hannah.lee@example.com', NULL, 'Female', 'Loves working on electrical circuits.', 4, '1999-11-20', 'Los Angeles', NULL, NULL, NULL, 'Single'),
(10, 'IAN0001', 'Ian', 'Miller', 'ian.miller@example.com', NULL, 'Male', 'Curious about human psychology.', 5, '1995-07-15', 'Chicago', NULL, NULL, NULL, 'In a relationship'),
(11, 'JUL0001', 'Julia', 'Nelson', 'julia.nelson@example.com', NULL, 'Female', 'Data science and analytics enthusiast.', 6, '2000-02-28', 'Seattle', NULL, NULL, NULL, 'Single'),
(12, 'KEV0001', 'Kevin', 'OBrien', 'kevin.obrien@example.com', NULL, 'Male', 'Passionate about civil engineering projects.', 7, '1994-03-10', 'Miami', NULL, NULL, NULL, 'Married'),
(13, 'LAU0001', 'Laura', 'Parker', 'laura.parker@example.com', NULL, 'Female', 'Biology researcher and nature lover.', 8, '1997-12-05', 'Denver', NULL, NULL, NULL, 'Single'),
(14, 'MIC0001', 'Michael', 'Quinn', 'michael.quinn@example.com', NULL, 'Male', 'Enthusiastic about chemical experiments.', 9, '1993-08-22', 'Atlanta', NULL, NULL, NULL, 'Married'),
(15, 'NAT0001', 'Natalie', 'Roberts', 'natalie.roberts@example.com', NULL, 'Female', 'Physics nerd and astrophysics fan.', 10, '1998-06-30', 'Portland', NULL, NULL, NULL, 'Single');

--
-- Triggers `users`
--
DELIMITER $$
CREATE TRIGGER `trg_auto_user_id` BEFORE INSERT ON `users` FOR EACH ROW BEGIN
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
END
$$
DELIMITER ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `authentication`
--
ALTER TABLE `authentication`
  ADD PRIMARY KEY (`user_id`);

--
-- Indexes for table `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`comment_id`),
  ADD KEY `fk_comments_users` (`user_id`),
  ADD KEY `fk_comments_posts` (`post_id`);

--
-- Indexes for table `fields_of_study`
--
ALTER TABLE `fields_of_study`
  ADD PRIMARY KEY (`field_id`);

--
-- Indexes for table `likes`
--
ALTER TABLE `likes`
  ADD PRIMARY KEY (`user_id`,`post_id`),
  ADD KEY `fk_likes_posts` (`post_id`);

--
-- Indexes for table `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`post_id`),
  ADD KEY `fk_posts_users` (`user_id`);

--
-- Indexes for table `post_tags`
--
ALTER TABLE `post_tags`
  ADD PRIMARY KEY (`post_id`,`tag_id`),
  ADD KEY `fk_post_tags_tags` (`tag_id`);

--
-- Indexes for table `tags`
--
ALTER TABLE `tags`
  ADD PRIMARY KEY (`tag_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_seq`),
  ADD UNIQUE KEY `email_id` (`email_id`),
  ADD UNIQUE KEY `user_id` (`user_id`),
  ADD KEY `fk_users_fields_of_study` (`field_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `comments`
--
ALTER TABLE `comments`
  MODIFY `comment_id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `fields_of_study`
--
ALTER TABLE `fields_of_study`
  MODIFY `field_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `posts`
--
ALTER TABLE `posts`
  MODIFY `post_id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `tags`
--
ALTER TABLE `tags`
  MODIFY `tag_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_seq` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `authentication`
--
ALTER TABLE `authentication`
  ADD CONSTRAINT `fk_auth_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `fk_comments_posts` FOREIGN KEY (`post_id`) REFERENCES `posts` (`post_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_comments_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `likes`
--
ALTER TABLE `likes`
  ADD CONSTRAINT `fk_likes_posts` FOREIGN KEY (`post_id`) REFERENCES `posts` (`post_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_likes_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `posts`
--
ALTER TABLE `posts`
  ADD CONSTRAINT `fk_posts_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `post_tags`
--
ALTER TABLE `post_tags`
  ADD CONSTRAINT `fk_post_tags_posts` FOREIGN KEY (`post_id`) REFERENCES `posts` (`post_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_post_tags_tags` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`tag_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `fk_users_fields_of_study` FOREIGN KEY (`field_id`) REFERENCES `fields_of_study` (`field_id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
