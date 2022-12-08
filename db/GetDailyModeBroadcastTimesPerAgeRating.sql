WITH rating (priority,rating) AS ((VALUES (6, 'Unrated'),(5, 'Rx - Hentai'),(4, 'R+ - Mild Nudity'),(3, 'R - 17+ (violence & profanity)'),(2, 'PG-13 - Teens 13 or older'),(1, 'PG - Children'),(0, 'G - All Ages')))

SELECT rating, dayofweek, mode() WITHIN GROUP (ORDER BY btime) AS "Mode Broadcast Time"
FROM (SELECT priority, rating, extract(dow from binfo) downum, TRIM(to_char(binfo,'Day')) dayofweek, binfo::time btime
FROM (SELECT priority, r.rating, broadcast_info AT TIME ZONE $1 binfo
FROM anime a
LEFT JOIN rating r ON a.rating = r.rating
WHERE a.rating IS NOT NULL AND broadcast_info IS NOT NULL) timezoned) dateandtime
GROUP BY dateandtime.priority, dateandtime.rating, dateandtime.downum, dateandtime.dayofweek
ORDER BY priority, downum;