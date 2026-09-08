-- QUERY 3: Acquisition vs Memory Bandwidth Regime Comparison
SELECT
  dominant_bottleneck,
  AVG(imaging_rate_mm3_year) AS avg_imaging_rate,
  AVG(memory_bandwidth_tb_s) AS avg_memory_bandwidth
FROM `geometric-kiln-457011-h4.z_wbe_research.scenarios_100k`
WHERE dominant_bottleneck IN ('ACQUISITION', 'MEMORY_BANDWIDTH')
GROUP BY dominant_bottleneck;
