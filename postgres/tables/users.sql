BEGIN TRANSACTION;

CREATE SEQUENCE IF NOT EXISTS users_id_seq
INCREMENT 1
START 1;

CREATE TABLE IF NOT EXISTS public.users
(
    id integer NOT NULL DEFAULT nextval('users_id_seq'::regclass),
    name character varying(100) COLLATE pg_catalog."default",
    email text COLLATE pg_catalog."default" NOT NULL,
    entries bigint DEFAULT 0,
    joined timestamp without time zone NOT NULL,
    CONSTRAINT users_pkey PRIMARY KEY (id),
    CONSTRAINT users_email_key UNIQUE (email)
);

COMMIT;