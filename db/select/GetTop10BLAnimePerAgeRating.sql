WITH rating (priority,rating) AS ((VALUES (0, 'Unrated'),(1, 'Rx - Hentai'),(2, 'R+ - Mild Nudity'),(3, 'R - 17+ (violence & profanity)'),(4, 'PG-13 - Teens 13 or older'),(5, 'PG - Children'),(5, 'G - All Ages'))),
numOfBLTitles (rating,count,name) AS (
SELECT COALESCE(a.rating, 'Unrated') AS rating, COUNT(*) AS count, g.name
FROM anime a
LEFT JOIN genre g ON a.mal_id = g.mal_id
GROUP BY rating, g.name
HAVING g.name = 'Boys Love'
)
SELECT count AS "# BL Anime titles", rating AS "Rating", rank_within_rating AS "Rank", title AS "Title", url, image_jpg, image_webp
FROM (SELECT r.priority, bl.rating, bl.count, a.mal_id, COALESCE(a.title_english,a.title) AS title, a.url, a.image_jpg, a.image_webp, RANK() OVER (PARTITION BY bl.rating ORDER BY NullIf(a.popularity,0) ASC, a.mal_id ASC) rank_within_rating
FROM anime a
LEFT JOIN genre g ON a.mal_id = g.mal_id
LEFT JOIN numOfBLTitles bl ON COALESCE(a.rating, 'Unrated') = bl.rating AND g.name = bl.name
LEFT JOIN rating r ON COALESCE(a.rating, 'Unrated') = r.rating
WHERE g.name = 'Boys Love'
ORDER BY r.priority DESC, NullIf(a.popularity,0) ASC, a.mal_id ASC) ranked
WHERE ranked.rank_within_rating <= 10;