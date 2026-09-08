-- QUERY 1: Bottleneck Distribution across 100,000 WBE Scenarios
SELECT
  dominant_bottleneck,
  COUNT(*) AS scenarios,
  ROUND(100 * COUNT(*) / SUM(COUNT(*)) OVER(), 2) AS pct
FROM `geometric-kiln-457011-h4.z_wbe_research.scenarios_100k`
GROUP BY dominant_bottleneck
ORDER BY scenarios DESC;
