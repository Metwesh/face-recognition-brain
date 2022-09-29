BEGIN TRANSACTION;

INSERT into users (name, email, joined) values ('supervisor', 'supervisor', '2022-01-01');
INSERT into login (hash, email) values ('$2a$10$3CllXUfQacF7JrG5gu6lxOAF3xiE4R3WSp3XjM0cYi4xoAieBfkZO', 'supervisor');

INSERT into users (name, email, joined) values ('Mohamed', 'm_1234@gmail.com', '2022-02-02');
INSERT into login (hash, email) values ('$2a$10$PCgeloTZywxwwiDxKogrQu6utx6VLAYQ/oQn777TGcu6XBwIM.4Dq', 'm_1234@gmail.com');

COMMIT;