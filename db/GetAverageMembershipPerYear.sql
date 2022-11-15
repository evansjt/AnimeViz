SELECT type as 'Media Type', strftime('%Y', date(aired_from)) as 'Year', round(avg(members),0) as 'Average Members'
FROM Anime
GROUP BY strftime('%Y', date(aired_from)), type
HAVING aired_from NOTNULL AND type NOTNULL AND members NOTNULL AND date(aired_from) <= date() AND type IS NOT 'Unknown'
ORDER BY type, strftime('%Y', date(aired_from));