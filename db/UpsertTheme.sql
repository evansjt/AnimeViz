WITH excluded(theme_id,mal_id,name) AS (VALUES $1:raw)
DELETE FROM theme
WHERE mal_id = $2:value AND NOT EXISTS(
SELECT 1
FROM excluded e
WHERE (theme_id,mal_id,name) = (e.theme_id,e.mal_id,e.name));
INSERT INTO theme(theme_id,mal_id,name)
SELECT new.theme_id,new.mal_id,new.name
FROM (VALUES $1:raw) AS new (theme_id,mal_id,name)
LEFT JOIN theme a ON (a.theme_id,a.mal_id,a.name) = (new.theme_id,new.mal_id,new.name)
WHERE (a.theme_id,a.mal_id,a.name) IS NULL;