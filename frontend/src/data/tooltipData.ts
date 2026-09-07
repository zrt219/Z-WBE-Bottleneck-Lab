export interface TooltipInfo {
  title: string;
  unit?: string;
  category?: string;
  description: string;
  baseline?: string;
  impact: string;
}

export const ASSUMPTION_TOOLTIPS: Record<string, TooltipInfo> = {
  // --- ACQUISITION ---
  tissueVolumeMm3: {
    title: 'Tissue Volume',
    unit: 'mm³',
    category: 'Acquisition',
    description: 'Total anatomical biological tissue volume targeted for whole-brain or circuit connectomics.',
    baseline: 'C. elegans: ~0.0001 mm³; Drosophila whole-brain: 0.15 mm³; Mouse cortex cube: 10 mm³; Human brain: 1,300,000 mm³.',
    impact: 'Volumetric scaling is cubic. Increasing volume directly scales total voxels, raw petabytes/exabytes, and scanning years.'
  },
  voxelResXNm: {
    title: 'Voxel Resolution X',
    unit: 'nm',
    category: 'Acquisition',
    description: 'In-plane horizontal sampling pitch of the scanning electron beam.',
    baseline: '4–8 nm is required to resolve thin synaptic clefts, pre-synaptic T-bars, and vesicle clusters.',
    impact: 'Halving X resolution doubles the pixel count along this dimension, quadrupling 2D tile size.'
  },
  voxelResYNm: {
    title: 'Voxel Resolution Y',
    unit: 'nm',
    category: 'Acquisition',
    description: 'In-plane vertical sampling pitch of the scanning electron beam.',
    baseline: '4–8 nm standard in multibeam SEM connectomics.',
    impact: 'Coupled with X resolution, dictates total pixels per ultramicrotome physical slice.'
  },
  voxelResZNm: {
    title: 'Voxel Resolution Z',
    unit: 'nm',
    category: 'Acquisition',
    description: 'Physical section thickness (diamond knife ribbon pitch or FIB-SEM milling step).',
    baseline: '20–40 nm for serial-section TEM/SEM; 4–8 nm for isotropic focused ion beam (FIB-SEM).',
    impact: 'Thicker slices speed up cutting and imaging but increase ambiguous neurite continuity tracing errors.'
  },
  bitsPerVoxel: {
    title: 'Bits Per Voxel',
    unit: 'bits',
    category: 'Acquisition',
    description: 'Radiometric resolution of electron detector intensity digitization.',
    baseline: '8-bit grayscale (256 intensity levels) is the standard in electron microscopy.',
    impact: 'Direct linear multiplier on raw uncompressed data volume before storage ingest.'
  },
  compressionRatio: {
    title: 'Compression Ratio',
    unit: 'x',
    category: 'Acquisition',
    description: 'Lossless or near-lossless compression factor applied before streaming to long-term storage.',
    baseline: '1.5x–3.0x using LZ4, Zstandard, or specialized neuroglancer neuroglancer precomputed chunk compression.',
    impact: 'Reduces permanent storage capacity pressure and network transmission bandwidth.'
  },
  imagingRatePerMachineMm3Year: {
    title: 'Imaging Rate per Instrument',
    unit: 'mm³/year',
    category: 'Acquisition',
    description: 'Physical volumetric imaging rate achievable per multibeam electron microscope.',
    baseline: 'State-of-the-art multibeam SEM (e.g. 61–91 beams) images ~0.05–0.25 mm³/year per machine.',
    impact: 'The primary physical rate limiter. Determines how many years are required to digitize the biological specimen.'
  },
  machineCount: {
    title: 'Microscope Fleet Count',
    unit: 'units',
    category: 'Acquisition',
    description: 'Number of dedicated multibeam electron microscopes operating in parallel.',
    baseline: 'Major connectomics facilities (e.g. Janelia, Harvard, Max Planck) operate 5–20 high-throughput SEMs.',
    impact: 'Linear speedup on scan duration, but scales instrument capital expense and cleanroom facility footprint.'
  },
  utilization: {
    title: 'Operational Duty Cycle',
    unit: 'fraction (0–1)',
    category: 'Acquisition',
    description: 'Effective fraction of 24/7 uptime the microscope is actively exposing tissue to electron beam.',
    baseline: '0.70–0.85 typical duty cycle accounting for knife changes, stage moves, autofocus, and pumpdown.',
    impact: 'Lower duty cycle leaves multi-million-dollar microscopes idle and extends physical scan years.'
  },

  // --- RECONSTRUCTION ---
  rawSegmentationAccuracy: {
    title: 'Raw Segmentation Accuracy',
    unit: 'fraction (0–1)',
    category: 'Reconstruction',
    description: 'Baseline precision of automated 3D convolutional / flood-filling neural networks.',
    baseline: 'Modern deep neural networks achieve 0.95–0.99 boundary accuracy across dense neuropil.',
    impact: 'Small error rates compound exponentially across billions of synapses, generating massive manual proofreading overhead.'
  },
  proofreadingMultiplier: {
    title: 'Proofreading Speedup Factor',
    unit: 'x',
    category: 'Reconstruction',
    description: 'Productivity acceleration delivered by automated error detection, interactive AI merges, and VR proofreading.',
    baseline: '5x–25x speedup compared to unassisted manual slice-by-slice tracing.',
    impact: 'Directly slashes human expert proofreading person-hours and total labor payroll.'
  },
  automatedThroughputMm3Year: {
    title: 'Automated Inference Throughput',
    unit: 'mm³/year',
    category: 'Reconstruction',
    description: 'Volumetric throughput of the automated GPU segmentation and agglomeration inference pipeline.',
    baseline: 'A modern GPU cluster (e.g. 100–500 NVIDIA H100s) processes 1–10 mm³/year.',
    impact: 'Must keep pace with acquisition throughput to avoid building an unmanageable unprocessed raw image backlog.'
  },
  manualProofreadingHoursPerMm3: {
    title: 'Manual Proofreading Burden',
    unit: 'hrs / mm³',
    category: 'Reconstruction',
    description: 'Human expert proofreading hours required per mm³ to validate and correct split/merge errors.',
    baseline: 'Drosophila whole brain (0.15 mm³) required ~100,000 human proofreading hours.',
    impact: 'The single most catastrophic economic constraint for mammalian and human connectomes.'
  },

  // --- NEURAL MODEL ---
  neuronCount: {
    title: 'Neuron Count',
    unit: 'cells',
    category: 'Neural Model',
    description: 'Total biologically modeled individual neurons in the simulation graph.',
    baseline: 'C. elegans: 302; Drosophila: 130,000; Mouse cortex cube: 100,000; Human brain: ~86,000,000,000.',
    impact: 'Directly dictates cell state memory allocation and differential equation solver iterations.'
  },
  synapseCount: {
    title: 'Synapse Count',
    unit: 'synapses',
    category: 'Neural Model',
    description: 'Total synaptic connections and junctions between axons and dendritic spines.',
    baseline: 'Drosophila: ~50,000,000; Mouse: ~1,000,000,000; Human brain: ~100,000,000,000,000.',
    impact: 'Synapses outnumber neurons by ~1,000x to 10,000x and dominate memory bandwidth and routing traffic.'
  },
  averageFiringRateHz: {
    title: 'Average Action Potential Firing Rate',
    unit: 'Hz (spikes/sec)',
    category: 'Neural Model',
    description: 'Mean population spike frequency across all active neurons.',
    baseline: '1–5 Hz in sparse mammalian cerebral cortex; 10–20 Hz in sensory/motor nuclei.',
    impact: 'Directly drives the volume of post-synaptic integration events and cross-node network messages per second.'
  },
  bytesPerNeuron: {
    title: 'State Memory per Neuron',
    unit: 'bytes',
    category: 'Neural Model',
    description: 'Memory footprint allocated for membrane potential, ion channel conductances, and adaptation variables.',
    baseline: '256–1,024 bytes per compartment for biophysically realistic multi-conductance models.',
    impact: 'Scales neuron state memory footprint across server DRAM/HBM.'
  },
  bytesPerSynapse: {
    title: 'State Memory per Synapse',
    unit: 'bytes',
    category: 'Neural Model',
    description: 'Dynamic state memory allocated per biological synapse for weight, receptor kinetics, and plasticity.',
    baseline: '8–32 bytes per synapse (weight, short-term depression/facilitation, eligibility trace).',
    impact: 'Because synapses number in the trillions, synaptic state dominates the active simulation memory footprint.'
  },
  computeOpsPerNeuronUpdate: {
    title: 'Compute Ops per Neuron Step',
    unit: 'FLOP / step',
    category: 'Neural Model',
    description: 'Floating point operations needed to integrate membrane differential equations for one neuron.',
    baseline: '50–200 FLOPs for Leaky Integrate-and-Fire / Izhikevich; 1,000–5,000 FLOPs for multi-compartment Hodgkin-Huxley.',
    impact: 'Scales the baseline PFLOPS compute requirement for somatic integration.'
  },
  computeOpsPerSynapticEvent: {
    title: 'Compute Ops per Synaptic Event',
    unit: 'FLOP / spike',
    category: 'Neural Model',
    description: 'Floating point operations executed when an action potential arrives at a post-synaptic receptor.',
    baseline: '10–50 FLOPs per synaptic transmission event (exponential decay, AMPA/NMDA/GABA conductance).',
    impact: 'Multiplied by trillions of synaptic events every second, driving sustained simulation FLOPS.'
  },
  neuronUpdateRateHz: {
    title: 'Simulation Clock Frequency',
    unit: 'Hz (1 / dt)',
    category: 'Neural Model',
    description: 'Numerical integration step rate for solving biophysical differential equations.',
    baseline: '1,000 Hz (dt = 1.0 ms) for coarse point neurons; 10,000–40,000 Hz (dt = 0.025–0.1 ms) for multi-compartment models.',
    impact: 'Doubling the clock frequency doubles both the required PFLOPS compute and memory bus traffic.'
  },

  // --- HARDWARE ---
  computeThroughputPflops: {
    title: 'Available Compute Throughput',
    unit: 'PFLOPS (FP32/FP16)',
    category: 'Hardware',
    description: 'Aggregate sustained floating point compute performance of the simulation supercomputer.',
    baseline: 'Top supercomputers (e.g. Frontier, Aurora, Google TPU v5p pods) deliver 100–1,500 PFLOPS sustained.',
    impact: 'Must exceed simulation compute demand to maintain real-time 1:1 biological execution clock speed.'
  },
  memoryBandwidthTbS: {
    title: 'Memory Bandwidth Capacity',
    unit: 'TB/s',
    category: 'Hardware',
    description: 'Aggregate High-Bandwidth Memory (HBM3e/HBM4) transfer rate across all compute nodes.',
    baseline: '8x NVIDIA H100 SXM delivers ~26.8 TB/s aggregate HBM3 bandwidth.',
    impact: 'Whole-brain simulation is severely memory-bandwidth bound. If bandwidth saturates, execution stalls below real time.'
  },
  interconnectBandwidthTbS: {
    title: 'Interconnect Bisection Bandwidth',
    unit: 'TB/s',
    category: 'Hardware',
    description: 'Cross-rack networking throughput (Quantum-2 InfiniBand, RoCE, or NVLink Network fabric).',
    baseline: '400–800 Gbps per host NIC; tens to hundreds of TB/s aggregate cluster bisection fabric.',
    impact: 'Caps real-time action potential spike broadcasting between nodes holding connected partitions of the brain graph.'
  },
  storageCapacityPb: {
    title: 'Storage Cluster Capacity',
    unit: 'PB',
    category: 'Hardware',
    description: 'Capacity of the high-speed Tier-1 NVMe scratch filesystem and persistent object store.',
    baseline: '10–100 PB for modern national supercomputing centers; exabyte-scale needed for mammalian connectomes.',
    impact: 'Must hold raw micrographs, aligned volumes, segmentation masks, and checkpoints.'
  },
  powerBudgetMw: {
    title: 'Facility Power Ceiling',
    unit: 'MW',
    category: 'Hardware',
    description: 'Maximum allowable continuous electrical power draw for computing, storage, and liquid cooling.',
    baseline: '10–40 MW for modern hyperscale datacenter halls; 50–100 MW for exascale supercomputers.',
    impact: 'Thermal dissipation and substation grid delivery place hard physical limits on cluster size.'
  },

  // --- ECONOMICS ---
  imagingInstrumentCostPerYear: {
    title: 'Instrument Amortization / Year',
    unit: '$/instrument/yr',
    category: 'Economics',
    description: 'Annual equipment capital depreciation and service maintenance contract per electron microscope.',
    baseline: '$150,000–$300,000/year for multibeam electron microscopes costing $2M–$5M initial CAPEX.',
    impact: 'Multiplied by microscope fleet count, establishing the recurring imaging hardware cost.'
  },
  storageCostPerTbYear: {
    title: 'Storage Cost per TB / Year',
    unit: '$/TB/yr',
    category: 'Economics',
    description: 'Fully loaded annual cost for high-availability enterprise storage (hardware, drives, power, licenses).',
    baseline: '$15–$35/TB/year for high-performance enterprise parallel storage; $5–$12/TB/year for cold archive tiers.',
    impact: 'Directly multiplies multi-petabyte/exabyte dataset volume across the multi-year retention lifecycle.'
  },
  computeCostPerPflopYear: {
    title: 'Compute Cost per PFLOP / Year',
    unit: '$/PFLOP/yr',
    category: 'Economics',
    description: 'Annualized cost of provisioning dedicated PFLOPS capacity (accelerators, host servers, network).',
    baseline: '$80,000–$250,000/PFLOP/year across on-premise amortized supercomputers vs cloud reserved instances.',
    impact: 'Determines the total capital equipment and leasing cost for the reconstruction and simulation cluster.'
  },
  energyCostPerMwh: {
    title: 'Electricity Tariff',
    unit: '$/MWh',
    category: 'Economics',
    description: 'Contracted industrial electricity rate at the datacenter facility.',
    baseline: '$50–$90/MWh ($0.05–$0.09/kWh) in hydro/nuclear regions; $120–$200/MWh in urban centers.',
    impact: 'Drives the recurring OPEX utility power bill for continuous scanning and year-long simulation runs.'
  },
  humanProofreadingHourlyRate: {
    title: 'Proofreader Loaded Hourly Rate',
    unit: '$/hr',
    category: 'Economics',
    description: 'Fully loaded hourly compensation for skilled neuroanatomical annotators (wages, benefits, management).',
    baseline: '$30–$65/hr in institutional annotation centers.',
    impact: 'Multiplied by proofreading person-hours, often becoming the single largest line item in the entire project budget.'
  },
  targetTimelineYears: {
    title: 'Target Completion Timeline',
    unit: 'years',
    category: 'Economics',
    description: 'Target window to complete scanning, automated reconstruction, and manual proofreading.',
    baseline: '1.0–3.0 years for typical grant milestone delivery.',
    impact: 'Compressing the timeline demands larger microscope fleets and larger GPU clusters, driving up peak CAPEX.'
  },
  budgetCeilingUsd: {
    title: 'Project Budget Ceiling',
    unit: 'USD ($)',
    category: 'Economics',
    description: 'Total available financial funding ceiling across capital equipment, compute, labor, and facilities.',
    baseline: '$5M–$20M for insect connectomes; $50M–$200M for mouse cortex; billions for human scale.',
    impact: 'Provides the economic boundary against which total projected project expenses are benchmarked.'
  }
};

export const PIPELINE_STAGE_TOOLTIPS: Record<string, TooltipInfo> = {
  preservation: {
    title: 'Stage 1: Tissue Preservation',
    category: 'WBE Pipeline',
    description: 'Chemical fixation (glutaraldehyde/osmium tetroxide), resin infiltration, and plastic embedding to stabilize synaptic ultrastructure at the nanometer scale.',
    baseline: 'Must prevent autolytic degradation and preserve membrane lipid bilayers within minutes of tissue harvest.',
    impact: 'Poor preservation creates irreversible false disconnects that no downstream computer vision model can recover.'
  },
  acquisition: {
    title: 'Stage 2: Nanoscale Acquisition',
    category: 'WBE Pipeline',
    description: 'Physical sectioning and multibeam scanning electron microscopy (SEM) to image every voxel of neural tissue at 4–8 nm resolution.',
    baseline: 'Zeiss MultiSEM systems with 61–91 parallel beams; generates petabytes to exabytes of raw micrographs.',
    impact: 'Determines physical project timeline (months vs centuries) and raw data volume storage demands.'
  },
  reconstruction: {
    title: 'Stage 3: Automated Reconstruction',
    category: 'WBE Pipeline',
    description: '3D tile registration, convolutional boundary segmentation, flood-filling networks, and human expert proofreading to extract the connectome graph.',
    baseline: 'Requires exascale GPU inference clusters; human proofreading represents the dominant economic expenditure.',
    impact: 'Extracts the directed connectivity matrix and morphology of every neuron and synapse from raw pixel arrays.'
  },
  functionalization: {
    title: 'Stage 4: Functional Annotation',
    category: 'WBE Pipeline',
    description: 'Assigning biophysical parameters (conductances, neurotransmitter identities, receptor kinetics, resting potentials) to anatomical structures.',
    baseline: 'Couples electron microscopy morphology with transcriptomic (spatial RNA-seq) and electrophysiological atlases.',
    impact: 'Converts a static structural wireframe into an active, parameterized dynamical systems model.'
  },
  execution: {
    title: 'Stage 5: In Silico Simulation',
    category: 'WBE Pipeline',
    description: 'Real-time numerical integration of the parameterized neural network on distributed supercomputing hardware.',
    baseline: 'Requires solving millions of differential equations per millisecond while streaming synaptic state across HBM and interconnect.',
    impact: 'Exposes memory bandwidth and inter-node spike communication bottlenecks at biological real-time clock rates.'
  },
  validation: {
    title: 'Stage 6: Behavioral Validation',
    category: 'WBE Pipeline',
    description: 'Testing the simulated connectome against ground-truth biological behaviors, stimulus responses, and electrophysiological recordings.',
    baseline: 'Closed-loop virtual sensory environments and comparative neural manifold similarity metrics.',
    impact: 'Provides scientific verification of functional equivalence versus ungrounded mathematical divergence.'
  }
};

export const BOTTLENECK_DIMENSION_TOOLTIPS: Record<string, TooltipInfo> = {
  ACQUISITION: {
    title: 'Acquisition Pressure',
    category: 'Bottleneck Engine',
    description: 'Ratio of estimated physical imaging time to target timeline threshold.',
    impact: 'High pressure indicates the microscope physical scan time is the gating factor holding back the entire project.'
  },
  RECONSTRUCTION: {
    title: 'Reconstruction Pressure',
    category: 'Bottleneck Engine',
    description: 'Pressure driven by the compute hours and human proofreading hours needed to convert micrographs into valid graphs.',
    impact: 'Human proofreading labor frequently caps scalability even when automated GPU segmentation is ultra-fast.'
  },
  STORAGE: {
    title: 'Storage & Ingest Pressure',
    category: 'Bottleneck Engine',
    description: 'Raw and compressed dataset volume relative to high-tier NVMe / persistent storage cluster limits.',
    impact: 'Exabyte-scale datasets overwhelm enterprise storage fabrics and network file transfer throughput.'
  },
  COMPUTE: {
    title: 'Compute (PFLOPS) Pressure',
    category: 'Bottleneck Engine',
    description: 'Floating point operations per second required to numerically integrate neural differential equations in real time.',
    impact: 'Complex multi-compartment Hodgkin-Huxley models demand extreme compute clusters to avoid slowing down below real time.'
  },
  MEMORY_BANDWIDTH: {
    title: 'Memory Bandwidth Pressure',
    category: 'Bottleneck Engine',
    description: 'Sustained bytes-per-second memory bus traffic demanded by reading and updating synaptic state weights on every spike.',
    impact: 'Modern AI chips are frequently bandwidth-starved for sparse brain graph updates. The #1 hidden bottleneck after imaging is solved.'
  },
  INTERCONNECT: {
    title: 'Cluster Interconnect Pressure',
    category: 'Bottleneck Engine',
    description: 'All-to-all and nearest-neighbor spike routing network traffic across distributed compute nodes.',
    impact: 'High synaptic arborization that crosses physical node boundaries causes network congestion and synchronization stalls.'
  },
  POWER: {
    title: 'Thermal & Power Pressure',
    category: 'Bottleneck Engine',
    description: 'Megawatts of continuous electrical power draw and cooling heat rejection needed for 24/7 cluster operation.',
    impact: 'Datacenter electrical grid delivery and liquid cooling thermal limits constrain physical cluster footprint.'
  },
  ECONOMIC_COST: {
    title: 'Economic & Budget Pressure',
    category: 'Bottleneck Engine',
    description: 'Total capital equipment (CAPEX) and recurring operational expenses (OPEX) over the project lifecycle.',
    impact: 'When total financial cost exceeds realistic research grants or institutional budgets, economic pressure dominates.'
  }
};
