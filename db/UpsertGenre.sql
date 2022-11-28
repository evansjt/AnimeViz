WITH excluded(gen_id,mal_id,name) AS (VALUES $1:raw)
DELETE FROM genre
WHERE mal_id = $2:value AND NOT EXISTS(
SELECT 1
FROM excluded e
WHERE (gen_id,mal_id,name) = (e.gen_id,e.mal_id,e.name));
INSERT INTO genre(gen_id,mal_id,name)
SELECT new.gen_id,new.mal_id,new.name
FROM (VALUES $1:raw) AS new (gen_id,mal_id,name)
LEFT JOIN genre a ON (a.gen_id,a.mal_id,a.name) = (new.gen_id,new.mal_id,new.name)
WHERE (a.gen_id,a.mal_id,a.name) IS NULL;