SELECT *
FROM (SELECT DENSE_RANK() OVER (ORDER BY lat."Time Aired" DESC) AS rank, lat.*
FROM (SELECT COALESCE(title_english,title) AS "Title", url, status, episodes AS "# Episodes", aired_from AS "Aired From", COALESCE(aired_to, CURRENT_DATE) AS "Aired To", COALESCE(aired_to, CURRENT_DATE) - aired_from AS "Time Aired"
FROM anime
WHERE aired_from IS NOT NULL AND (aired_to IS NOT NULL OR status = 'Currently Airing') AND type = 'TV' AND broadcast_info IS NOT NULL) lat) ranked
WHERE rank <= 50;