WITH excluded(stud_id,mal_id,name) AS (VALUES $1:raw)
DELETE FROM studio
WHERE mal_id = $2:value AND NOT EXISTS(
SELECT 1
FROM excluded e
WHERE (stud_id,mal_id,name) = (e.stud_id,e.mal_id,e.name));
INSERT INTO studio(stud_id,mal_id,name)
SELECT new.stud_id,new.mal_id,new.name
FROM (VALUES $1:raw) AS new (stud_id,mal_id,name)
LEFT JOIN studio a ON (a.stud_id,a.mal_id,a.name) = (new.stud_id,new.mal_id,new.name)
WHERE (a.stud_id,a.mal_id,a.name) IS NULL;