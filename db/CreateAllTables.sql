CREATE TABLE "Anime" (
	"mal_id"	INTEGER NOT NULL UNIQUE,
	"title"	TEXT NOT NULL,
	"title_english"	TEXT,
	"title_japanese"	TEXT,
	"title_synonyms"	TEXT,
	"type"	TEXT,
	"source"	TEXT,
	"episodes"	INTEGER,
	"status"	TEXT,
	"aired_from"	INTEGER,
	"aired_to"	INTEGER,
	"rating"	TEXT,
	"score"	NUMERIC,
	"scored_by"	INTEGER,
	"rank"	INTEGER,
	"popularity"	INTEGER,
	"members"	INTEGER,
	"favorites"	INTEGER,
	"season"	TEXT,
	"year"	INTEGER,
	"broadcast_day"	INTEGER,
	"broadcast_time"	INTEGER,
	PRIMARY KEY("mal_id")
);
CREATE TABLE "Demographic" (
	"dem_id"	INTEGER NOT NULL,
	"mal_id"	INTEGER NOT NULL,
	"name"	TEXT NOT NULL,
	FOREIGN KEY("mal_id") REFERENCES "Anime"("mal_id") ON DELETE CASCADE
);
CREATE TABLE "Genre" (
	"gen_id"	INTEGER NOT NULL,
	"mal_id"	INTEGER NOT NULL,
	"name"	TEXT NOT NULL,
	FOREIGN KEY("mal_id") REFERENCES "Anime"("mal_id") ON DELETE CASCADE
);
CREATE TABLE "Licensor" (
	"lic_id"	INTEGER NOT NULL,
	"mal_id"	INTEGER NOT NULL,
	"name"	TEXT NOT NULL,
	FOREIGN KEY("mal_id") REFERENCES "Anime"("mal_id") ON DELETE CASCADE
);
CREATE TABLE "Producer" (
	"prod_id"	INTEGER NOT NULL,
	"mal_id"	INTEGER NOT NULL,
	"name"	TEXT NOT NULL,
	FOREIGN KEY("mal_id") REFERENCES "Anime"("mal_id") ON DELETE CASCADE
);
CREATE TABLE "Studio" (
	"stud_id"	INTEGER NOT NULL,
	"mal_id"	INTEGER NOT NULL,
	"name"	TEXT NOT NULL,
	FOREIGN KEY("mal_id") REFERENCES "Anime"("mal_id") ON DELETE CASCADE
);
CREATE TABLE "Theme" (
	"theme_id"	INTEGER NOT NULL,
	"mal_id"	INTEGER NOT NULL,
	"name"	TEXT NOT NULL,
	FOREIGN KEY("mal_id") REFERENCES "Anime"("mal_id") ON DELETE CASCADE
);