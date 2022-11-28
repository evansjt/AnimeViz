SELECT DISTINCT a."Media Type", a."Year", round(avg(a.members),0) as "Average Members"
FROM (SELECT DISTINCT type as "Media Type", aired_from, extract(year from aired_from) as "Year", members
FROM anime
WHERE type IS NOT NULL AND type != 'Unknown' AND aired_from <= CURRENT_DATE) a
GROUP BY "Media Type", "Year"
ORDER BY "Year" ASC;