BEGIN TRANSACTION;

INSERT into users (name, email, joined) values ('supervisor', 'supervisor@gmail.com', '2022-01-01');
INSERT into login (hash, email) values ('$2a$10$z3bM9vYiTSEwLcVOUTEt/eOGnO9kvjV5weg1VRGC2sPmOCyrLtAxW', 'supervisor@gmail.com');

COMMIT;