SELECT RANK() OVER (ORDER BY lat."Time Aired" DESC), lat.*
FROM (SELECT title AS "Title", title_english, episodes AS "# Episodes", aired_from AS "Aired From", COALESCE(aired_to, CURRENT_DATE) AS "Aired To", aired_to - aired_from AS "Time Aired"
FROM anime
WHERE aired_from IS NOT NULL AND aired_to > aired_from AND type = 'TV' AND broadcast_day IS NOT NULL AND broadcast_time IS NOT NULL) lat
LIMIT 50;