WITH excluded(dem_id,mal_id,name) AS (VALUES $1:raw)
DELETE FROM demographic
WHERE mal_id = $2:value AND NOT EXISTS(
SELECT 1
FROM excluded e
WHERE (dem_id,mal_id,name) = (e.dem_id,e.mal_id,e.name));
INSERT INTO demographic(dem_id,mal_id,name)
SELECT new.dem_id,new.mal_id,new.name
FROM (VALUES $1:raw) AS new (dem_id,mal_id,name)
LEFT JOIN demographic a ON (a.dem_id,a.mal_id,a.name) = (new.dem_id,new.mal_id,new.name)
WHERE (a.dem_id,a.mal_id,a.name) IS NULL;