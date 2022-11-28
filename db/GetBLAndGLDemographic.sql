WITH sortedDemographic (id,dem) AS ((VALUES (0,'Non-Demographic'),(1,'Kids'),(2,'Seinen'),(3,'Shounen'),(4,'Shoujo'),(5,'Josei')))
SELECT DISTINCT ON ("genre", "demographic", dem_sort) "genre", "demographic", COUNT(*) OVER (PARTITION BY "genre") AS "# Titles in Genre", COUNT(*) OVER (PARTITION BY "genre","demographic") AS "# Titles Genre Demographic"
FROM (SELECT g.name AS "genre", sd.id AS dem_sort, COALESCE(d.name, 'Non-Demographic') AS "demographic"
FROM anime a
LEFT JOIN genre g ON a.mal_id = g.mal_id
LEFT JOIN demographic d ON a.mal_id = d.mal_id
LEFT JOIN sortedDemographic sd ON COALESCE(d.name, 'Non-Demographic') = sd.dem
WHERE g.name IN ('Boys Love', 'Girls Love')) dist
ORDER BY "genre", dem_sort ASC;