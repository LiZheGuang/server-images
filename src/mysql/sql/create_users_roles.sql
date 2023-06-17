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



-- 通过role id 查询到用户身份对应权限

SELECT role.id as roleId,role.name ,GROUP_CONCAT(role_permission.permissionId) AS permissions
FROM role
LEFT JOIN role_permission ON role.id = role_permission.roleId 
WHERE role.id
GROUP BY role.id;


-- 这条 SQL 语句的作用是在 role_permission 表上创建一个名为 permissionId 的外键约束，
-- 其中 permissionId 是 role_permission 表中的一个列名，它将引用 permission 表中的 id 列。
-- 也就是说，role_permission 表中的 permissionId 列的值必须在 permission 表的 id 列中存在，
-- 否则将无法插入该行。
-- 此外，该约束定义了一个 ON DELETE CASCADE 动作。这意味着，如果在 permission 表中删除某一行，
-- 与之相关的所有 role_permission 表的行都会被删除。
-- 这样可以确保数据库中的数据完整性，避免无效的外键引用。
  ALTER TABLE role_permission ADD CONSTRAINT permissionId
  FOREIGN KEY (permissionId)
  REFERENCES permission(id)
  ON DELETE CASCADE;
