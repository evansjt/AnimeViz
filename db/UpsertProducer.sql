WITH excluded(prod_id,mal_id,name) AS (VALUES $1:raw)
DELETE FROM producer
WHERE mal_id = $2:value AND NOT EXISTS(
SELECT 1
FROM excluded e
WHERE (prod_id,mal_id,name) = (e.prod_id,e.mal_id,e.name));
INSERT INTO producer(prod_id,mal_id,name)
SELECT new.prod_id,new.mal_id,new.name
FROM (VALUES $1:raw) AS new (prod_id,mal_id,name)
LEFT JOIN producer a ON (a.prod_id,a.mal_id,a.name) = (new.prod_id,new.mal_id,new.name)
WHERE (a.prod_id,a.mal_id,a.name) IS NULL;