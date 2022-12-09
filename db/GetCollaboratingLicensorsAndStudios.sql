SELECT ls.lic_name AS "licensor", ls.stud_name AS "studio", COUNT(*) AS weight
FROM (SELECT l.lic_id AS lic_id, l.name AS lic_name, s.stud_id AS stud_id, s.name AS stud_name
FROM licensor l
INNER JOIN studio s ON l.mal_id = s.mal_id) ls
GROUP BY ls.lic_id, ls.lic_name, ls.stud_id, ls.stud_name
HAVING ls.lic_name != ls.stud_name
ORDER BY weight DESC;