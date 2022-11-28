SELECT pd.prod1_id AS "src", pd.prod1_name AS "Source Producer", pd.prod2_id AS "tgt", pd.prod2_name AS "Target Producer", COUNT(*) AS weight
FROM (SELECT p1.prod_id AS prod1_id, p1.name AS prod1_name, p2.prod_id AS prod2_id, p2.name prod2_name
FROM producer p1 INNER JOIN producer p2 ON p1.mal_id = p2.mal_id AND p1.prod_id != p2.prod_id AND p1.prod_id < p2.prod_id) pd
GROUP BY pd.prod1_id, pd.prod1_name, pd.prod2_id, pd.prod2_name
ORDER BY weight DESC;