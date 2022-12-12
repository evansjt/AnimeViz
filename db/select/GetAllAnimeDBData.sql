WITH
agg_dem (mal_id, demographics) AS ((SELECT a.mal_id, string_agg(d.name, ',' ORDER BY d.name) AS demographics FROM anime a LEFT JOIN demographic d ON a.mal_id = d.mal_id GROUP BY a.mal_id)),
agg_gen (mal_id, genres) AS ((SELECT a.mal_id, string_agg(g.name, ',' ORDER BY g.name) AS genres FROM anime a LEFT JOIN genre g ON a.mal_id = g.mal_id GROUP BY a.mal_id)),
agg_lic (mal_id, licensors) AS ((SELECT a.mal_id, string_agg(l.name, ',' ORDER BY l.name) AS licensors FROM anime a LEFT JOIN licensor l ON a.mal_id = l.mal_id GROUP BY a.mal_id)),
agg_prod (mal_id, producers) AS ((SELECT a.mal_id, string_agg(p.name, ',' ORDER BY p.name) AS producers FROM anime a LEFT JOIN producer p ON a.mal_id = p.mal_id GROUP BY a.mal_id)),
agg_stud (mal_id, studios) AS ((SELECT a.mal_id, string_agg(s.name, ',' ORDER BY s.name) AS studios FROM anime a LEFT JOIN studio s ON a.mal_id = s.mal_id GROUP BY a.mal_id)),
agg_theme (mal_id, themes) AS ((SELECT a.mal_id, string_agg(t.name, ',' ORDER BY t.name) AS themes FROM anime a LEFT JOIN theme t ON a.mal_id = t.mal_id GROUP BY a.mal_id))
SELECT a.*, d.demographics, g.genres, l.licensors, p.producers, s.studios, t.themes
FROM anime a
JOIN agg_dem d ON a.mal_id = d.mal_id
JOIN agg_gen g ON a.mal_id = g.mal_id
JOIN agg_lic l ON a.mal_id = l.mal_id
JOIN agg_prod p ON a.mal_id = p.mal_id
JOIN agg_stud s ON a.mal_id = s.mal_id
JOIN agg_theme t ON a.mal_id = t.mal_id
ORDER BY a.mal_id;