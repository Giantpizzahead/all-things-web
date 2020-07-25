CREATE TABLE users (
  user_id int(11) AUTO_INCREMENT PRIMARY KEY NOT NULL,
  email varchar(256) NOT NULL,
  username varchar(256) NOT NULL,
  password varchar(256) NOT NULL
);

INSERT INTO users (email, username, password) VALUES ('bob_wang@gmail.com', 'bobwang123', 'coolpass99');

INSERT INTO users (email, username, password) VALUES ('emma_likes_coding@yahoo.com', 'emma-swift', 'password');

INSERT INTO users (email, username, password) VALUES ('pizzahead@icloud.com', 'pizzahead', 'abcdEFGHijkl');