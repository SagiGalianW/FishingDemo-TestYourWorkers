DROP TABLE IF EXISTS worker_test;
DROP TABLE IF EXISTS test;
DROP TABLE IF EXISTS manager;
DROP TABLE IF EXISTS worker;
DROP TABLE IF EXISTS human;

CREATE TABLE human(
	human_id SERIAL PRIMARY KEY,
	first_name VARCHAR(100) NOT NULL,
	last_name VARCHAR(100) NOT NULL,
	phone VARCHAR(20) UNIQUE,
	email VARCHAR(100) UNIQUE
);

CREATE TABLE manager (
   	human_id INT PRIMARY KEY REFERENCES human(human_id) ON DELETE CASCADE,
	pass VARCHAR(100) NOT NULL
);

CREATE TABLE worker (
   	human_id INT PRIMARY KEY REFERENCES human(human_id) ON DELETE CASCADE
);

CREATE TABLE test (
    test_id SERIAL PRIMARY KEY,     
    manager_id INT NOT NULL REFERENCES manager(human_id) ON DELETE RESTRICT,       
    start_date DATE NOT NULL
);

CREATE TABLE worker_test (
    worker_id INT NOT NULL REFERENCES worker(human_id) ON DELETE CASCADE,      
    test_id INT NOT NULL REFERENCES test(test_id) ON DELETE CASCADE,          
    is_failed BOOLEAN DEFAULT FALSE,
	PRIMARY KEY (worker_id, test_id)
);

---------------------------- INSERTING DEMO DATA ----------------------------
-- Insert data into the 'human' table
INSERT INTO human (first_name, last_name, phone, email) VALUES
('Alice', 'Smith', '111-222-3333', 'alice.smith@example.com'),
('Bob', 'Johnson', '444-555-6666', 'bob.johnson@example.com'),
('Charlie', 'Brown', '777-888-9999', 'charlie.brown@example.com'),
('Diana', 'Prince', '000-111-2222', 'diana.prince@example.com'),
('Eve', 'Adams', '333-444-5555', 'eve.adams@example.com');

-- Insert data into the 'manager' table
-- Alice (human_id 1) and Bob (human_id 2) will be managers
INSERT INTO manager (human_id, pass) VALUES
(1, 123),
(2, 321);

-- Insert data into the 'worker' table
-- Charlie (human_id 3), Diana (human_id 4), and Eve (human_id 5) will be workers
INSERT INTO worker (human_id) VALUES
(3),
(4),
(5);

-- Insert data into the 'test' table
-- Manager Alice (human_id 1) starts two tests
-- Manager Bob (human_id 2) starts one test
INSERT INTO test (manager_id, start_date) VALUES
(1, '2025-01-10'), -- Test 1 by Alice
(1, '2025-01-15'), -- Test 2 by Alice
(2, '2025-01-12'); -- Test 3 by Bob

-- Insert data into the 'worker_test' table
-- Linking workers to tests and indicating if they failed
INSERT INTO worker_test (worker_id, test_id, is_failed) VALUES
(3, 1, FALSE), -- Charlie took Test 1, passed
(3, 2, TRUE),  -- Charlie took Test 2, failed
(4, 1, FALSE), -- Diana took Test 1, passed
(4, 3, FALSE), -- Diana took Test 3, passed
(5, 2, FALSE), -- Eve took Test 2, passed
(5, 3, TRUE);  -- Eve took Test 3, failed









