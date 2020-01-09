
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS pk_user_id CASCADE;

DROP TABLE IF EXISTS public.users;
DROP SEQUENCE IF EXISTS public.users_id_seq;
CREATE TABLE users (
    id serial NOT NULL,
    name varchar(50) UNIQUE,
    high_score integer
);


INSERT INTO users VALUES(0, 'admin', 0);
INSERT INTO users VALUES(1, 'The Doom Slayer', 666)