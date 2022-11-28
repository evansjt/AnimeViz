SELECT lc.lic1_id AS "src", lc.lic1_name AS "Source Licensor", lc.lic2_id AS "tgt", lc.lic2_name AS "Target Licensor", COUNT(*) AS weight
FROM (SELECT l1.lic_id AS lic1_id, l1.name AS lic1_name, l2.lic_id AS lic2_id, l2.name lic2_name
FROM licensor l1 INNER JOIN licensor l2 ON l1.mal_id = l2.mal_id AND l1.lic_id != l2.lic_id AND l1.lic_id < l2.lic_id) lc
GROUP BY lc.lic1_id, lc.lic1_name, lc.lic2_id, lc.lic2_name
ORDER BY weight DESC;