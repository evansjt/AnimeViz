CREATE TABLE IF NOT EXISTS anime (
    mal_id integer PRIMARY KEY,
    url text NOT NULL,
    image_jpg text,
    image_webp text,
    title text NOT NULL,
    title_english text,
    title_japanese text,
    title_synonyms text,
    type text,
    source text,
    episodes integer,
    status text,
    aired_from date,
    aired_to date,
    rating text,
    score numeric,
    scored_by integer,
    rank integer,
    popularity integer,
    members integer,
    favorites integer,
    season text,
    year integer,
    broadcast_info timestamp with time zone
);
CREATE TABLE IF NOT EXISTS demographic (
	dem_id INTEGER NOT NULL,
	mal_id INTEGER NOT NULL,
	name TEXT NOT NULL,
	FOREIGN KEY(mal_id) REFERENCES anime(mal_id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS genre (
	gen_id INTEGER NOT NULL,
	mal_id INTEGER NOT NULL,
	name TEXT NOT NULL,
	FOREIGN KEY(mal_id) REFERENCES anime(mal_id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS licensor (
	lic_id INTEGER NOT NULL,
	mal_id INTEGER NOT NULL,
	name TEXT NOT NULL,
	FOREIGN KEY(mal_id) REFERENCES anime(mal_id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS producer (
	prod_id INTEGER NOT NULL,
	mal_id INTEGER NOT NULL,
	name TEXT NOT NULL,
	FOREIGN KEY(mal_id) REFERENCES anime(mal_id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS studio (
	stud_id INTEGER NOT NULL,
	mal_id INTEGER NOT NULL,
	name TEXT NOT NULL,
	FOREIGN KEY(mal_id) REFERENCES anime(mal_id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS theme (
	theme_id INTEGER NOT NULL,
	mal_id INTEGER NOT NULL,
	name TEXT NOT NULL,
	FOREIGN KEY(mal_id) REFERENCES anime(mal_id) ON DELETE CASCADE ON UPDATE CASCADE
);