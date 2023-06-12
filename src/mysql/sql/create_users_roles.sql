-- 创建用户权限表
CREATE TABLE `role` (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE `permission` (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  description VARCHAR(255)
);

CREATE TABLE user (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL
);

CREATE TABLE user_role (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  roleId INT NOT NULL,
  FOREIGN KEY (userId) REFERENCES user(id),
  FOREIGN KEY (roleId) REFERENCES role(id)
);

CREATE TABLE role_permission (
  id INT AUTO_INCREMENT PRIMARY KEY,
  roleId INT NOT NULL,
  permissionId INT NOT NULL,
  FOREIGN KEY (roleId) REFERENCES role(id),
  FOREIGN KEY (permissionId) REFERENCES permission(id)
);



-- 接着，我们可以插入一些数据，以便后续测试：

-- INSERT INTO `role` (name) VALUES ('admin'), ('editor'), ('user');

-- INSERT INTO `permission` (name,description) VALUES 
-- ('create','Can create new records'),
-- ('read','Can read existing records'),
-- ('update','Can update existing records'),
-- ('delete','Can delete existing records');

-- INSERT INTO user (username,password,email) VALUES 
-- ('admin','password','admin@example.com'),
-- ('editor','password','editor@example.com'),
-- ('user','password','user@example.com');

-- INSERT INTO user_role (userId,roleId) VALUES 
-- (1,1),(2,2),(3,3);

-- INSERT INTO role_permission (roleId,permissionId) VALUES 
-- (1,1),(1,2),(1,3),(1,4),
-- (2,1),(2,2),(2,3),
-- (3,2),(3,3);


-- 查询userid 用户身份

SELECT role.id, role.name, permission.id, permission.name
FROM user_role
JOIN role ON user_role.roleId = role.id
JOIN role_permission ON role.id = role_permission.roleId
JOIN permission ON role_permission.permissionId = permission.id
WHERE user_role.userId = 1;


-- 联合查询 合并查询 与 聚合字段


SELECT user.id, user_role.userId, user_role.roleId, username, uuid ,role.name as 'role_name', GROUP_CONCAT(permissionId) AS permissions 
FROM user 
INNER JOIN user_role 
ON user.id = user_role.userId 
INNER JOIN role 
ON role.id = user_role.roleId 
INNER JOIN role_permission 
ON role_permission.roleId  = role.id 
WHERE user.id  = 1 
GROUP BY user.id, user_role.userId, user_role.roleId, username, uuid, role_name;

