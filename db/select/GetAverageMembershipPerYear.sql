SELECT *
FROM (SELECT a.mal_id, a.title, a.url, a."Media Type", a."Year", a.members, ROUND(AVG(a.members) OVER (PARTITION BY "Media Type", "Year" ORDER BY "Media Type","Year" ASC), 0) AS "Average Members", MAX(a.members) OVER (PARTITION BY "Media Type", "Year") AS "Most Members", COUNT(a.members) OVER (PARTITION BY "Media Type", "Year") AS "Title Count"
FROM(SELECT mal_id, coalesce(title_english, title) as title, url, type as "Media Type", extract(year from aired_from)  as "Year", members
FROM anime
WHERE type IS NOT NULL AND type != 'Unknown' AND aired_from <= CURRENT_DATE) a) agg
WHERE members = "Most Members"
ORDER BY "Media Type", "Year";