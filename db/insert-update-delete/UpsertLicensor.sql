WITH excluded(lic_id,mal_id,name) AS (VALUES $1:raw)
DELETE FROM licensor
WHERE mal_id = $2:value AND NOT EXISTS(
SELECT 1
FROM excluded e
WHERE (lic_id,mal_id,name) = (e.lic_id,e.mal_id,e.name));
INSERT INTO licensor(lic_id,mal_id,name)
SELECT new.lic_id,new.mal_id,new.name
FROM (VALUES $1:raw) AS new (lic_id,mal_id,name)
LEFT JOIN licensor a ON (a.lic_id,a.mal_id,a.name) = (new.lic_id,new.mal_id,new.name)
WHERE (a.lic_id,a.mal_id,a.name) IS NULL;