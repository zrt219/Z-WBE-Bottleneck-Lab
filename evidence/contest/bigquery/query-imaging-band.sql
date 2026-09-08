/* QUERY 4: Bottleneck Transitions Across Imaging Speed Bands */
SELECT
  CASE
    WHEN imaging_rate_mm3_year < 1 THEN '<1'
    WHEN imaging_rate_mm3_year < 3 THEN '1-3'
    WHEN imaging_rate_mm3_year < 10 THEN '3-10'
    ELSE '10+'
  END AS imaging_band,
  dominant_bottleneck,
  COUNT(*) AS scenarios
FROM `geometric-kiln-457011-h4.z_wbe_research.scenarios_100k`
GROUP BY imaging_band, dominant_bottleneck
ORDER BY imaging_band, scenarios DESC;
