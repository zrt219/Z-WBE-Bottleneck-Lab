-- QUERY 2: Memory Wall Conditions (scenarios where Memory Bandwidth is dominant)
SELECT *
FROM `geometric-kiln-457011-h4.z_wbe_research.scenarios_100k`
WHERE dominant_bottleneck = 'MEMORY_BANDWIDTH'
LIMIT 100;
