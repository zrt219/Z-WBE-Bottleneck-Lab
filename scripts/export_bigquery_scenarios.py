"""
Z-WBE Bottleneck Lab: Export 100,000 Deterministic Scenarios for BigQuery Sandbox.
Ensures 100% mathematical and distributional fidelity to scripts/generate_gpu_sweep.py
and public/data/gpu-sweep-summary.json.
"""

import os
import sys
import numpy as np
import pandas as pd

def generate_100k_scenarios(n_samples=100000, seed=42):
    print(f"[Export] Generating {n_samples:,} deterministic scenarios (seed={seed})...")
    np.random.seed(seed)

    # Biophysical tissue geometry & voxels
    tissue_volume = np.random.uniform(0.1, 50.0, n_samples)  # mm³
    dx, dy, dz = 4.0, 4.0, 30.0  # nm
    voxel_vol_nm3 = dx * dy * dz
    voxel_count = (tissue_volume * 1e18) / voxel_vol_nm3
    raw_data_bytes = voxel_count * 8 / 8  # 1 byte per voxel

    # Acquisition parameterization
    imaging_rate_machine = 10 ** np.random.uniform(-1, 1.5, n_samples)  # mm³/yr
    machine_count = np.random.randint(1, 50, n_samples)
    utilization = np.random.uniform(0.7, 0.95, n_samples)
    effective_rate = imaging_rate_machine * machine_count * utilization
    acq_time_years = tissue_volume / effective_rate

    # Reconstruction & Proofreading
    segmentation_acc = np.random.uniform(0.90, 0.999, n_samples)
    proofreading_mult = 10 ** np.random.uniform(0.3, 2.0, n_samples)
    auto_throughput = 10 ** np.random.uniform(0.5, 3.0, n_samples)  # mm³/yr
    proofreading_hrs = (tissue_volume * 5000 * ((1 - segmentation_acc) / 0.02)) / proofreading_mult
    recon_years = np.maximum(tissue_volume / auto_throughput, proofreading_hrs / (50 * 2000))

    # Neural model demand (10^6 neurons/mm³, 1000 synapses/neuron)
    neuron_count = tissue_volume * 1e6
    synapse_count = neuron_count * 1000
    compute_pflops_demand = (neuron_count * 1000 * 250 + synapse_count * 4.0 * 50) / 1e15
    memory_tb_s_demand = (neuron_count * 1000 * 1024 + synapse_count * 4.0 * 16) / 1e12
    interconnect_tb_s_demand = (synapse_count * 4.0 * 0.25 * 8) / 1e12
    power_mw_demand = (compute_pflops_demand * 0.020 + (memory_tb_s_demand + interconnect_tb_s_demand) * 0.005) * 1.2

    # Hardware capacity envelopes
    compute_hw = 10 ** np.random.uniform(-1, 2.5, n_samples)  # PFLOPS
    memory_hw = 10 ** np.random.uniform(0.5, 3.5, n_samples)  # TB/s
    interconnect_hw = 10 ** np.random.uniform(0, 3.0, n_samples)  # TB/s
    storage_hw = 10 ** np.random.uniform(0.5, 3.5, n_samples)  # PB
    power_hw = 10 ** np.random.uniform(-1, 2.0, n_samples)  # MW
    budget_ceiling = 10 ** np.random.uniform(5.5, 8.5, n_samples)  # USD

    # Total economic cost
    imaging_cost = machine_count * 400000 * np.minimum(acq_time_years, 1.0)
    storage_cost = (raw_data_bytes / 2.5 / 1e12) * 15 * 1.0
    compute_cost = compute_pflops_demand * 80000 * 1.0
    energy_cost = power_mw_demand * 8760 * 120 * 1.0
    proofreading_cost = proofreading_hrs * 45
    total_cost = imaging_cost + storage_cost + compute_cost + energy_cost + proofreading_cost

    # 8-dimensional normalized engineering pressures (%)
    acq_pressure = (acq_time_years / 1.0) * 100
    recon_pressure = (recon_years / 1.0) * 100
    storage_pressure = ((raw_data_bytes / 2.5 / 1e15) / storage_hw) * 100
    compute_pressure = (compute_pflops_demand / compute_hw) * 100
    memory_pressure = (memory_tb_s_demand / memory_hw) * 100
    interconnect_pressure = (interconnect_tb_s_demand / interconnect_hw) * 100
    power_pressure = (power_mw_demand / power_hw) * 100
    cost_pressure = (total_cost / budget_ceiling) * 100

    pressure_matrix = np.column_stack([
        acq_pressure, recon_pressure, storage_pressure, compute_pressure,
        memory_pressure, interconnect_pressure, power_pressure, cost_pressure
    ])

    col_to_dim = {
        0: 'ACQUISITION',
        1: 'RECONSTRUCTION',
        2: 'STORAGE',
        3: 'COMPUTE',
        4: 'MEMORY_BANDWIDTH',
        5: 'INTERCONNECT',
        6: 'POWER',
        7: 'ECONOMIC_COST'
    }

    dominant_indices = pressure_matrix.argmax(axis=1)
    dominant_bottlenecks = [col_to_dim[i] for i in dominant_indices]

    df = pd.DataFrame({
        'scenario_id': np.arange(1, n_samples + 1, dtype=np.int64),
        'tissue_volume_mm3': np.round(tissue_volume, 4),
        'voxel_count': np.round(voxel_count, 0).astype(np.int64),
        'raw_data_bytes': np.round(raw_data_bytes, 0).astype(np.int64),
        'imaging_rate_mm3_year': np.round(imaging_rate_machine, 6),
        'machine_count': machine_count.astype(np.int32),
        'machine_utilization': np.round(utilization, 4),
        'effective_imaging_rate_mm3_year': np.round(effective_rate, 6),
        'acquisition_time_years': np.round(acq_time_years, 6),
        'segmentation_accuracy': np.round(segmentation_acc, 6),
        'proofreading_mult': np.round(proofreading_mult, 4),
        'auto_throughput_mm3_year': np.round(auto_throughput, 4),
        'proofreading_hours': np.round(proofreading_hrs, 2),
        'reconstruction_years': np.round(recon_years, 6),
        'neuron_count': np.round(neuron_count, 0).astype(np.int64),
        'synapse_count': np.round(synapse_count, 0).astype(np.int64),
        'compute_demand_pflops': np.round(compute_pflops_demand, 6),
        'memory_demand_tb_s': np.round(memory_tb_s_demand, 6),
        'interconnect_demand_tb_s': np.round(interconnect_tb_s_demand, 6),
        'power_demand_mw': np.round(power_mw_demand, 6),
        'compute_throughput_pflops': np.round(compute_hw, 6),
        'memory_bandwidth_tb_s': np.round(memory_hw, 6),
        'interconnect_bandwidth_tb_s': np.round(interconnect_hw, 6),
        'storage_capacity_pb': np.round(storage_hw, 6),
        'power_capacity_mw': np.round(power_hw, 6),
        'budget_ceiling_usd': np.round(budget_ceiling, 2),
        'imaging_cost_usd': np.round(imaging_cost, 2),
        'storage_cost_usd': np.round(storage_cost, 2),
        'compute_cost_usd': np.round(compute_cost, 2),
        'energy_cost_usd': np.round(energy_cost, 2),
        'proofreading_cost_usd': np.round(proofreading_cost, 2),
        'total_cost_usd': np.round(total_cost, 2),
        'acq_pressure': np.round(acq_pressure, 4),
        'recon_pressure': np.round(recon_pressure, 4),
        'storage_pressure': np.round(storage_pressure, 4),
        'compute_pressure': np.round(compute_pressure, 4),
        'memory_pressure': np.round(memory_pressure, 4),
        'interconnect_pressure': np.round(interconnect_pressure, 4),
        'power_pressure': np.round(power_pressure, 4),
        'cost_pressure': np.round(cost_pressure, 4),
        'dominant_bottleneck': dominant_bottlenecks
    })

    return df

def verify_and_save(df, output_csv_path):
    print(f"[Verify] Verifying dataset integrity...")
    assert len(df) == 100000, f"Expected 100000 rows, got {len(df)}"
    assert not df.isnull().values.any(), "Found null values in dataframe!"
    assert not np.isinf(df.select_dtypes(include=[np.number]).values).any(), "Found infinite values!"

    counts = df['dominant_bottleneck'].value_counts().to_dict()
    expected_counts = {
        'ACQUISITION': 27335,
        'RECONSTRUCTION': 18833,
        'STORAGE': 10719,
        'COMPUTE': 2,
        'MEMORY_BANDWIDTH': 14092,
        'INTERCONNECT': 16,
        'POWER': 1750,
        'ECONOMIC_COST': 27253
    }

    print("[Verify] Bottleneck Frequency Check:")
    for b_name, exp_val in expected_counts.items():
        actual_val = counts.get(b_name, 0)
        assert actual_val == exp_val, f"Mismatch for {b_name}: expected {exp_val}, got {actual_val}"
        print(f"  [OK] {b_name:<18}: {actual_val:6d} == {exp_val}")

    os.makedirs(os.path.dirname(output_csv_path), exist_ok=True)
    print(f"[Export] Writing to {output_csv_path} ...")
    df.to_csv(output_csv_path, index=False)
    
    file_size_mb = os.path.getsize(output_csv_path) / (1024 * 1024)
    print(f"[Export] Successfully wrote {output_csv_path} ({file_size_mb:.2f} MB)")

if __name__ == '__main__':
    repo_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    out_path = os.path.join(repo_root, 'evidence', 'contest', 'bigquery', 'z_wbe_100k_scenarios.csv')
    df = generate_100k_scenarios(100000, seed=42)
    verify_and_save(df, out_path)
