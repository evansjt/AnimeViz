WITH season (quarter,season) AS ((VALUES (1, 'Winter'),(2, 'Spring'),(3, 'Summer'),(4, 'Fall')))
SELECT DISTINCT a.aired_year AS "Year", a.quarter AS "q", a.season AS "Season", sum(a.members) as "Average Members"
FROM (SELECT DISTINCT type, aired_from, s.quarter, s.season, extract(year from aired_from) as aired_year, members
FROM anime, season s
WHERE extract(quarter from aired_from) = s.quarter AND type = 'TV' AND aired_from <= CURRENT_DATE AND date_trunc('year',aired_from) > (date_trunc('year',CURRENT_DATE) - INTERVAL '5 years')) a
GROUP BY a.season, a.quarter, a.aired_year
ORDER BY a.aired_year ASC, a.quarter ASC;