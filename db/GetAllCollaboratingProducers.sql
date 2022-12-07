WITH numcollabs (prod_id, collabnum, max_rank) AS ((
SELECT prod_id, collabnum, MAX(rank) OVER (ORDER BY rank DESC) max_rank, rank
FROM (SELECT prod_id, collabnum, RANK() OVER (ORDER BY collabnum DESC) AS rank
FROM (
SELECT DISTINCT prod1_id AS prod_id, COUNT(*) OVER (PARTITION BY prod1_id) AS collabnum
FROM (
SELECT DISTINCT p1.prod_id AS prod1_id, p2.prod_id AS prod2_id
FROM producer p1, producer p2
WHERE p1.mal_id = p2.mal_id AND p1.prod_id != p2.prod_id) collabs) collabcount) unranked))

SELECT p1id AS "src", p1name AS "Source Producer", p1collabs AS "src_collabs", p2id AS "tgt", p2name AS "Target Producer", p2collabs AS "tgt_collabs", COUNT(*) AS weight, max_rank
FROM (SELECT p1.prod_id AS p1id, p1.name AS p1name, n1.collabnum AS p1collabs, p2.prod_id AS p2id, p2.name AS p2name, n2.collabnum AS p2collabs, n1.max_rank
FROM producer p1
INNER JOIN producer p2 ON p1.mal_id = p2.mal_id AND p1.prod_id != p2.prod_id AND p1.prod_id < p2.prod_id
INNER JOIN numcollabs n1 ON p1.prod_id = n1.prod_id
INNER JOIN numcollabs n2 ON p2.prod_id = n2.prod_id) pd
GROUP BY p1id, p1name, p1collabs, p2id, p2name, p2collabs, max_rank
ORDER BY weight DESC;