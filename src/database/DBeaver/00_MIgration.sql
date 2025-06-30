
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'role') THEN
        CREATE TYPE role AS ENUM ('USER', 'ADMIN');
    END IF;
END
$$;


CREATE TABLE player (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT  NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role role NOT NULL DEFAULT 'USER',
    tokens FLOAT NOT NULL DEFAULT 0.0,
    score BIGINT NOT NULL DEFAULT 0
);



DROP TABLE IF EXISTS game CASCADE;


DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'gametype') THEN
        CREATE TYPE gametype AS ENUM ('PVP', 'PVE');
    END IF;
END
$$;


DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'gamestate') THEN
        CREATE TYPE gamestate AS ENUM ('ONGOING','FINISHED','ABANDONED');
    END IF;
END
$$;

CREATE TABLE game (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type gametype NOT NULL,
    state gamestate NOT NULL DEFAULT 'ONGOING',
    current_turn_user UUID NOT NULL,
    creator_id UUID NOT NULL REFERENCES player(id),
    opponent_id UUID,
    leaver_id UUID,
    grid_creator JSONB NOT NULL,
    grid_opponent JSONB,

    moves JSONB DEFAULT '[]'::jsonb,
    winner_id UUID REFERENCES player(id)
);


DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'result') THEN
        CREATE TYPE result AS ENUM ('HIT', 'WATER','SUNK');
    END IF;
END
$$;

CREATE TABLE "Moves" (
  "id" SERIAL PRIMARY KEY,
  "gameId" UUID NOT NULL,
  "playerId" UUID NOT NULL,
  "x" INTEGER,
  "y" INTEGER,
  "result" result NOT NULL ,
  "turnNumber" INTEGER,

  CONSTRAINT "fk_game"
    FOREIGN KEY ("gameId")
    REFERENCES "game" ("id")
    ON DELETE CASCADE,

  CONSTRAINT "fk_player"
    FOREIGN KEY ("playerId")
    REFERENCES "player" ("id")
    ON DELETE CASCADE
);
