WITH sorteddow (id, day) AS ((VALUES (0, 'Mondays'),(1, 'Tuesdays'),(2, 'Wednesdays'),(3, 'Thursdays'),(4, 'Fridays'),(5, 'Saturdays'),(6, 'Sundays'))),
rating (priority,rating) AS ((VALUES (0, 'Unrated'),(1, 'Rx - Hentai'),(2, 'R+ - Mild Nudity'),(3, 'R - 17+ (violence & profanity)'),(4, 'PG-13 - Teens 13 or older'),(5, 'PG - Children'),(5, 'G - All Ages')))
SELECT bct.rating AS "Rating", bct.broadcast_day AS "Broadcast Day", mode() WITHIN GROUP (ORDER BY bct.broadcast_time) AS "Mode Broadcast Time"
FROM (SELECT rating, broadcast_day, broadcast_time
FROM anime
WHERE rating IS NOT NULL AND broadcast_day IS NOT NULL AND broadcast_time IS NOT NULL) bct
LEFT JOIN sorteddow d ON bct.broadcast_day = d.day
LEFT JOIN rating r ON bct.rating = r.rating
GROUP BY r.priority, bct.rating,d.id, bct.broadcast_day
ORDER BY r.priority, d.id;