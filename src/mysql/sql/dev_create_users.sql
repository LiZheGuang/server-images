INSERT INTO user (username, password,uuid) VALUES
('admin1', 'admin' ,(CONCAT_WS('-', SUBSTRING(MD5(RAND()), 1, 8), SUBSTRING(MD5(RAND()), 9,4), SUBSTRING(MD5(RAND()), 13,4), SUBSTRING(MD5(RAND()), 17,4), SUBSTRING(MD5(RAND()), 21)))),
('admin2', 'admin',(CONCAT_WS('-', SUBSTRING(MD5(RAND()), 1, 8), SUBSTRING(MD5(RAND()), 9,4), SUBSTRING(MD5(RAND()), 13,4), SUBSTRING(MD5(RAND()), 17,4), SUBSTRING(MD5(RAND()), 21)))),
('admin3', 'admin',(CONCAT_WS('-', SUBSTRING(MD5(RAND()), 1, 8), SUBSTRING(MD5(RAND()), 9,4), SUBSTRING(MD5(RAND()), 13,4), SUBSTRING(MD5(RAND()), 17,4), SUBSTRING(MD5(RAND()), 21)))),
('admin4', 'admin',(CONCAT_WS('-', SUBSTRING(MD5(RAND()), 1, 8), SUBSTRING(MD5(RAND()), 9,4), SUBSTRING(MD5(RAND()), 13,4), SUBSTRING(MD5(RAND()), 17,4), SUBSTRING(MD5(RAND()), 21)))),
('admin5', 'admin',(CONCAT_WS('-', SUBSTRING(MD5(RAND()), 1, 8), SUBSTRING(MD5(RAND()), 9,4), SUBSTRING(MD5(RAND()), 13,4), SUBSTRING(MD5(RAND()), 17,4), SUBSTRING(MD5(RAND()), 21)))),
('admin6', 'admin',(CONCAT_WS('-', SUBSTRING(MD5(RAND()), 1, 8), SUBSTRING(MD5(RAND()), 9,4), SUBSTRING(MD5(RAND()), 13,4), SUBSTRING(MD5(RAND()), 17,4), SUBSTRING(MD5(RAND()), 21)))),
('admin7', 'admin',(CONCAT_WS('-', SUBSTRING(MD5(RAND()), 1, 8), SUBSTRING(MD5(RAND()), 9,4), SUBSTRING(MD5(RAND()), 13,4), SUBSTRING(MD5(RAND()), 17,4), SUBSTRING(MD5(RAND()), 21)))),
('admin8', 'admin',(CONCAT_WS('-', SUBSTRING(MD5(RAND()), 1, 8), SUBSTRING(MD5(RAND()), 9,4), SUBSTRING(MD5(RAND()), 13,4), SUBSTRING(MD5(RAND()), 17,4), SUBSTRING(MD5(RAND()), 21)))),
('admin9', 'admin',(CONCAT_WS('-', SUBSTRING(MD5(RAND()), 1, 8), SUBSTRING(MD5(RAND()), 9,4), SUBSTRING(MD5(RAND()), 13,4), SUBSTRING(MD5(RAND()), 17,4), SUBSTRING(MD5(RAND()), 21)))),
('admin10', 'admin',(CONCAT_WS('-', SUBSTRING(MD5(RAND()), 1, 8), SUBSTRING(MD5(RAND()), 9,4), SUBSTRING(MD5(RAND()), 13,4), SUBSTRING(MD5(RAND()), 17,4), SUBSTRING(MD5(RAND()), 21))));