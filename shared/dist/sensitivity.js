"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runSensitivityAnalysis = runSensitivityAnalysis;
const equations_1 = require("./equations");
const bottlenecks_1 = require("./bottlenecks");
const PERTURBED_VARIABLES = [
    {
        key: 'imagingRatePerMachineMm3Year',
        category: 'acquisition',
        label: 'Imaging Rate Per Instrument',
        unit: 'mm³/yr',
        higherIsBetter: true,
        get: (s) => s.acquisition.imagingRatePerMachineMm3Year,
        set: (s, val) => ({
            ...s,
            acquisition: { ...s.acquisition, imagingRatePerMachineMm3Year: val }
        })
    },
    {
        key: 'machineCount',
        category: 'acquisition',
        label: 'Number of Imaging Instruments',
        unit: 'units',
        higherIsBetter: true,
        get: (s) => s.acquisition.machineCount,
        set: (s, val) => ({
            ...s,
            acquisition: { ...s.acquisition, machineCount: Math.max(1, Math.round(val)) }
        })
    },
    {
        key: 'proofreadingMultiplier',
        category: 'reconstruction',
        label: 'Proofreading Speedup Multiplier',
        unit: 'x speedup',
        higherIsBetter: true,
        get: (s) => s.reconstruction.proofreadingMultiplier,
        set: (s, val) => ({
            ...s,
            reconstruction: { ...s.reconstruction, proofreadingMultiplier: val }
        })
    },
    {
        key: 'computeThroughputPflops',
        category: 'hardware',
        label: 'Compute Throughput',
        unit: 'PFLOPS',
        higherIsBetter: true,
        get: (s) => s.hardware.computeThroughputPflops,
        set: (s, val) => ({
            ...s,
            hardware: { ...s.hardware, computeThroughputPflops: val }
        })
    },
    {
        key: 'memoryBandwidthTbS',
        category: 'hardware',
        label: 'Memory Bandwidth',
        unit: 'TB/s',
        higherIsBetter: true,
        get: (s) => s.hardware.memoryBandwidthTbS,
        set: (s, val) => ({
            ...s,
            hardware: { ...s.hardware, memoryBandwidthTbS: val }
        })
    },
    {
        key: 'interconnectBandwidthTbS',
        category: 'hardware',
        label: 'Interconnect Bandwidth',
        unit: 'TB/s',
        higherIsBetter: true,
        get: (s) => s.hardware.interconnectBandwidthTbS,
        set: (s, val) => ({
            ...s,
            hardware: { ...s.hardware, interconnectBandwidthTbS: val }
        })
    },
    {
        key: 'storageCapacityPb',
        category: 'hardware',
        label: 'Storage Capacity',
        unit: 'PB',
        higherIsBetter: true,
        get: (s) => s.hardware.storageCapacityPb,
        set: (s, val) => ({
            ...s,
            hardware: { ...s.hardware, storageCapacityPb: val }
        })
    },
    {
        key: 'powerBudgetMw',
        category: 'hardware',
        label: 'Power Budget',
        unit: 'MW',
        higherIsBetter: true,
        get: (s) => s.hardware.powerBudgetMw,
        set: (s, val) => ({
            ...s,
            hardware: { ...s.hardware, powerBudgetMw: val }
        })
    },
    {
        key: 'budgetCeilingUsd',
        category: 'economics',
        label: 'Economic Budget Ceiling',
        unit: '$',
        higherIsBetter: true,
        get: (s) => s.economics.budgetCeilingUsd,
        set: (s, val) => ({
            ...s,
            economics: { ...s.economics, budgetCeilingUsd: val }
        })
    }
];
const MULTIPLIERS = [0.5, 1.0, 2.0, 10.0, 100.0];
function runSensitivityAnalysis(baseAssumptions) {
    const baseMetrics = (0, equations_1.calculateAllMetrics)(baseAssumptions);
    const baseBottleneck = (0, bottlenecks_1.calculateBottlenecks)(baseAssumptions, baseMetrics);
    const baseDominantScore = baseBottleneck.dominantScore;
    const variableResults = [];
    const bottleneckTransitions = [];
    for (const spec of PERTURBED_VARIABLES) {
        const baseVal = spec.get(baseAssumptions);
        const perturbations = {
            '0.5x': { multiplier: 0.5, bottleneckScore: 0, dominantBottleneck: 'ACQUISITION', totalCostUsd: 0, acquisitionTimeYears: 0 },
            '1x': { multiplier: 1.0, bottleneckScore: baseDominantScore, dominantBottleneck: baseBottleneck.dominantBottleneck, totalCostUsd: baseMetrics.totalEstimatedCostUsd, acquisitionTimeYears: baseMetrics.acquisitionTimeYears },
            '2x': { multiplier: 2.0, bottleneckScore: 0, dominantBottleneck: 'ACQUISITION', totalCostUsd: 0, acquisitionTimeYears: 0 },
            '10x': { multiplier: 10.0, bottleneckScore: 0, dominantBottleneck: 'ACQUISITION', totalCostUsd: 0, acquisitionTimeYears: 0 },
            '100x': { multiplier: 100.0, bottleneckScore: 0, dominantBottleneck: 'ACQUISITION', totalCostUsd: 0, acquisitionTimeYears: 0 }
        };
        for (const m of MULTIPLIERS) {
            if (m === 1.0)
                continue;
            const perturbedVal = baseVal * m;
            const modifiedAssumptions = spec.set(baseAssumptions, perturbedVal);
            const metrics = (0, equations_1.calculateAllMetrics)(modifiedAssumptions);
            const bottleneck = (0, bottlenecks_1.calculateBottlenecks)(modifiedAssumptions, metrics);
            const key = `${m}x`;
            perturbations[key] = {
                multiplier: m,
                bottleneckScore: bottleneck.dominantScore,
                dominantBottleneck: bottleneck.dominantBottleneck,
                totalCostUsd: metrics.totalEstimatedCostUsd,
                acquisitionTimeYears: metrics.acquisitionTimeYears
            };
            // Check if this improvement caused a bottleneck transition
            if (m > 1.0 && bottleneck.dominantBottleneck !== baseBottleneck.dominantBottleneck) {
                const existing = bottleneckTransitions.find((t) => t.variableKey === spec.key && t.toBottleneck === bottleneck.dominantBottleneck);
                if (!existing) {
                    bottleneckTransitions.push({
                        variableKey: spec.key,
                        variableLabel: spec.label,
                        fromBottleneck: baseBottleneck.dominantBottleneck,
                        toBottleneck: bottleneck.dominantBottleneck,
                        triggerMultiplier: `${m}x`,
                        description: `Scaling ${spec.label} by ${m}x shifts dominant bottleneck from ${baseBottleneck.dominantBottleneck} to ${bottleneck.dominantBottleneck}.`
                    });
                }
            }
        }
        // Leverage score: Determine which variable produces the largest improvement in overall feasibility
        const scoreAt100x = perturbations['100x'].bottleneckScore;
        const scoreAt10x = perturbations['10x'].bottleneckScore;
        const scoreAt2x = perturbations['2x'].bottleneckScore;
        const scoreAtHalf = perturbations['0.5x'].bottleneckScore;
        const relief100x = Math.max(0, baseDominantScore - scoreAt100x);
        const relief10x = Math.max(0, baseDominantScore - scoreAt10x);
        const relief2x = Math.max(0, baseDominantScore - scoreAt2x);
        const elasticity = Math.max(0, scoreAtHalf - baseDominantScore);
        const combinedLeverage = relief100x > 0 || relief10x > 0
            ? relief100x * 5.0 + relief10x * 10.0 + relief2x * 5.0 + elasticity * 0.01
            : elasticity * 0.1;
        variableResults.push({
            variableKey: spec.key,
            variableCategory: spec.category,
            variableLabel: spec.label,
            unit: spec.unit,
            baselineValue: baseVal,
            perturbations,
            leverageScore: Number(combinedLeverage.toFixed(2)),
            isHighestLeverage: false
        });
    }
    // Sort by leverage score descending
    variableResults.sort((a, b) => b.leverageScore - a.leverageScore);
    if (variableResults.length > 0) {
        variableResults[0].isHighestLeverage = true;
    }
    const highest = variableResults[0];
    const lowLeverageImprovements = variableResults.filter((v) => v.leverageScore < 5.0);
    const takeaway = highest.leverageScore > 5
        ? `${highest.variableLabel.toUpperCase()} HAS HIGHEST LEVERAGE IN THIS SCENARIO: Scaling this assumption relieves critical system pressure from ${baseBottleneck.dominantBottleneck} (Score: ${baseDominantScore.toFixed(1)} -> ${highest.perturbations['10x'].bottleneckScore.toFixed(1)} at 10x, ${highest.perturbations['100x'].bottleneckScore.toFixed(1)} at 100x).`
        : `System is evenly bounded. Modifying ${highest.variableLabel} provides the most immediate sensitivity response among current assumptions.`;
    return {
        variables: variableResults,
        highestLeverageAssumption: highest,
        bottleneckTransitions,
        lowLeverageImprovements,
        takeaway
    };
}
//# sourceMappingURL=sensitivity.js.map