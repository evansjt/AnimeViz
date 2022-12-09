WITH sortedDemographic (id,dem) AS ((VALUES (0,'Non-Demographic'),(1,'Kids'),(2,'Seinen'),(3,'Shounen'),(4,'Shoujo'),(5,'Josei')))
SELECT "demographic", "genre", "# Titles in Genre", "# Titles Genre Demographic", ("# Titles Genre Demographic"/"# Titles in Genre"::float) percentage
FROM (SELECT DISTINCT ON ("genre", "demographic", dem_sort) "demographic", "genre", COUNT(*) OVER (PARTITION BY "genre") AS "# Titles in Genre", COUNT(*) OVER (PARTITION BY "genre","demographic") AS "# Titles Genre Demographic"
FROM (SELECT sd.id AS dem_sort, COALESCE(d.name, 'Non-Demographic') AS "demographic", g.name AS "genre"
FROM anime a
LEFT JOIN genre g ON a.mal_id = g.mal_id
LEFT JOIN demographic d ON a.mal_id = d.mal_id
LEFT JOIN sortedDemographic sd ON COALESCE(d.name, 'Non-Demographic') = sd.dem
WHERE g.name IN ('Boys Love', 'Girls Love')) dist
ORDER BY dem_sort, "genre" ASC) perc;