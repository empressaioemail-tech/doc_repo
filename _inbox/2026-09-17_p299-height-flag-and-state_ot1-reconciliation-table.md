# P-299 OT-1 - max_height_ft reconciliation (116 district rows changed)

| table | district | was | now | change | basis |
| --- | --- | --- | --- | --- | --- |
| austin-tx.json | SF-1 Single-Family Residence Large Lot | 35 (flagged) | 35 | flag removed, value kept | P-146 REAL_VALUE_FLAGGED (instrument) |
| austin-tx.json | SF-2 Single-Family Residence Standard Lot | 35 (flagged) | 35 | flag removed, value kept | P-146 REAL_VALUE_FLAGGED (instrument) |
| austin-tx.json | SF-3 Family Residence | 35 (flagged) | 35 | flag removed, value kept | P-146 REAL_VALUE_FLAGGED (instrument) |
| austin-tx.json | MF-1 Multifamily Residence Limited Density | 40 (flagged) | 40 | flag removed, value kept | P-146 REAL_VALUE_FLAGGED (instrument) |
| austin-tx.json | MF-2 Multifamily Residence Low Density | 40 (flagged) | 40 | flag removed, value kept | P-146 REAL_VALUE_FLAGGED (instrument) |
| austin-tx.json | MF-3 Multifamily Residence Medium Density | 40 (flagged) | 40 | flag removed, value kept | P-146 REAL_VALUE_FLAGGED (instrument) |
| austin-tx.json | MF-4 Multifamily Residence Moderate-High Density | 60 (flagged) | 60 | flag removed, value kept | P-146 REAL_VALUE_FLAGGED (instrument) |
| austin-tx.json | MF-5 Multifamily Residence High Density | 60 (flagged) | 60 | flag removed, value kept | P-146 REAL_VALUE_FLAGGED (instrument) |
| austin-tx.json | MF-6 Multifamily Residence Highest Density | 90 (flagged) | 90 | flag removed, value kept | P-146 REAL_VALUE_FLAGGED (instrument) |
| bastrop-city-tx.json | P-1 Nature | 100 (flagged) | 999 (flagged) | sentinel normalized | instrument: quote states no feet limit (SENTINEL_UNIFORM) |
| bastrop-city-tx.json | P-2 Rural | 100 (flagged) | 999 (flagged) | sentinel normalized | instrument: quote states no feet limit (SENTINEL_UNIFORM) |
| bastrop-city-tx.json | P-3 Neighborhood | 100 (flagged) | 999 (flagged) | sentinel normalized | instrument: quote states no feet limit (SENTINEL_UNIFORM) |
| bastrop-city-tx.json | P-4 Neighborhood Mix | 100 (flagged) | 999 (flagged) | sentinel normalized | instrument: quote states no feet limit (SENTINEL_UNIFORM) |
| bastrop-city-tx.json | P-5 Core | 100 (flagged) | 999 (flagged) | sentinel normalized | instrument: quote states no feet limit (SENTINEL_UNIFORM) |
| bastrop-city-tx.json | P-EC Employment Center | 100 (flagged) | 999 (flagged) | sentinel normalized | instrument: quote states no feet limit (SENTINEL_UNIFORM) |
| belton-tx.json | A Agricultural District | 100 (flagged) | 999 (flagged) | sentinel normalized | instrument: quote states no feet limit (SENTINEL_UNIFORM) |
| belton-tx.json | RE Residential Estate District | 100 (flagged) | 999 (flagged) | sentinel normalized | instrument: quote states no feet limit (SENTINEL_UNIFORM) |
| belton-tx.json | SF-1 Single Family Residential District-1 | 100 (flagged) | 999 (flagged) | sentinel normalized | instrument: quote states no feet limit (SENTINEL_UNIFORM) |
| belton-tx.json | SF-2 Single Family Residential District-2 | 100 (flagged) | 999 (flagged) | sentinel normalized | instrument: quote states no feet limit (SENTINEL_UNIFORM) |
| belton-tx.json | SF-3 Single Family Residential District-3 | 100 (flagged) | 999 (flagged) | sentinel normalized | instrument: quote states no feet limit (SENTINEL_UNIFORM) |
| belton-tx.json | PH Patio Home District | 100 (flagged) | 999 (flagged) | sentinel normalized | instrument: quote states no feet limit (SENTINEL_UNIFORM) |
| belton-tx.json | 2F Two Family Residential District (Duplex) | 100 (flagged) | 999 (flagged) | sentinel normalized | instrument: quote states no feet limit (SENTINEL_UNIFORM) |
| belton-tx.json | MF Multiple Family District | 100 (flagged) | 999 (flagged) | sentinel normalized | instrument: quote states no feet limit (SENTINEL_UNIFORM) |
| belton-tx.json | MH Mobile Home District | 100 (flagged) | 999 (flagged) | sentinel normalized | instrument: quote states no feet limit (SENTINEL_UNIFORM) |
| belton-tx.json | O-1 Office District-1 | 100 (flagged) | 999 (flagged) | sentinel normalized | instrument: quote states no feet limit (SENTINEL_UNIFORM) |
| belton-tx.json | O-2 Office District 2 | 100 (flagged) | 999 (flagged) | sentinel normalized | instrument: quote states no feet limit (SENTINEL_UNIFORM) |
| belton-tx.json | UC-1 University Campus-1 | 100 (flagged) | 999 (flagged) | sentinel normalized | instrument: quote states no feet limit (SENTINEL_UNIFORM) |
| belton-tx.json | UC-2 University Campus-2 | 100 (flagged) | 999 (flagged) | sentinel normalized | instrument: quote states no feet limit (SENTINEL_UNIFORM) |
| belton-tx.json | CH Commercial Highway District | 100 (flagged) | 999 (flagged) | sentinel normalized | instrument: quote states no feet limit (SENTINEL_UNIFORM) |
| belton-tx.json | C-1 Commercial District-1 | 100 (flagged) | 999 (flagged) | sentinel normalized | instrument: quote states no feet limit (SENTINEL_UNIFORM) |
| belton-tx.json | C-2 Commercial District-2 | 100 (flagged) | 999 (flagged) | sentinel normalized | instrument: quote states no feet limit (SENTINEL_UNIFORM) |
| belton-tx.json | IP Industrial Park District | 100 (flagged) | 999 (flagged) | sentinel normalized | instrument: quote states no feet limit (SENTINEL_UNIFORM) |
| belton-tx.json | RD Redevelopment District | 100 (flagged) | 999 (flagged) | sentinel normalized | instrument: quote states no feet limit (SENTINEL_UNIFORM) |
| cedar-park-tx.json | GB General Business | 100 (flagged) | 999 (flagged) | sentinel normalized | instrument: no feet limit stated; ADJUDICATED (suspect-in-mixed-group) |
| cedar-park-tx.json | HC Highway Commercial | 60 (flagged) | 60 | flag removed, value kept | P-146 REAL_VALUE_FLAGGED (instrument) |
| cedar-park-tx.json | LI Light Industrial | 60 (flagged) | 60 | flag removed, value kept | P-146 REAL_VALUE_FLAGGED (instrument) |
| cedar-park-tx.json | HI Heavy Industrial | 60 (flagged) | 60 | flag removed, value kept | P-146 REAL_VALUE_FLAGGED (instrument) |
| cedar-park-tx.json | H Hotel | 100 (flagged) | 999 (flagged) | sentinel normalized | instrument: no feet limit stated; ADJUDICATED (suspect-in-mixed-group) |
| cedar-park-tx.json | PS Public Service | 100 (flagged) | 999 (flagged) | sentinel normalized | instrument: no feet limit stated; ADJUDICATED (suspect-in-mixed-group) |
| cedar-park-tx.json | OG Open Greenbelt | 100 (flagged) | 999 (flagged) | sentinel normalized | instrument: no feet limit stated; ADJUDICATED (suspect-in-mixed-group) |
| cedar-park-tx.json | OR Outdoor Recreation | 100 (flagged) | 999 (flagged) | sentinel normalized | instrument: no feet limit stated; ADJUDICATED (suspect-in-mixed-group) |
| cedar-park-tx.json | MU Mixed Use | 100 (flagged) | 999 (flagged) | sentinel normalized | instrument: no feet limit stated; ADJUDICATED (suspect-in-mixed-group) |
| hutto-tx.json | MH Manufactured Housing | 100 (flagged) | 999 (flagged) | sentinel normalized | instrument: quote states no feet limit (SENTINEL_UNIFORM) |
| killeen-tx.json | SR-2 Suburban Residential Single-Family | 100 (flagged) | 999 (flagged) | sentinel normalized | instrument: quote states no feet limit (SENTINEL_UNIFORM) |
| leander-tx.json | SFR Single-Family Residential | 100 (flagged) | 999 (flagged) | sentinel normalized | instrument: quote states no feet limit (SENTINEL_UNIFORM) |
| leander-tx.json | SFE Single-Family Estate | 100 (flagged) | 999 (flagged) | sentinel normalized | instrument: quote states no feet limit (SENTINEL_UNIFORM) |
| leander-tx.json | SFS Single-Family Suburban | 100 (flagged) | 999 (flagged) | sentinel normalized | instrument: quote states no feet limit (SENTINEL_UNIFORM) |
| leander-tx.json | SFU Single-Family Urban | 100 (flagged) | 999 (flagged) | sentinel normalized | instrument: quote states no feet limit (SENTINEL_UNIFORM) |
| leander-tx.json | SFU/MH Single-Family Urban Manufactured Housing | 100 (flagged) | 999 (flagged) | sentinel normalized | instrument: quote states no feet limit (SENTINEL_UNIFORM) |
| leander-tx.json | TF Two-Family | 100 (flagged) | 999 (flagged) | sentinel normalized | instrument: quote states no feet limit (SENTINEL_UNIFORM) |
| leander-tx.json | SFC Single-Family Compact | 100 (flagged) | 999 (flagged) | sentinel normalized | instrument: quote states no feet limit (SENTINEL_UNIFORM) |
| leander-tx.json | SFL Single-Family Limited | 100 (flagged) | 999 (flagged) | sentinel normalized | instrument: quote states no feet limit (SENTINEL_UNIFORM) |
| leander-tx.json | CH Cottage Home | 100 (flagged) | 999 (flagged) | sentinel normalized | instrument: quote states no feet limit (SENTINEL_UNIFORM) |
| leander-tx.json | TH Townhome | 100 (flagged) | 999 (flagged) | sentinel normalized | instrument: quote states no feet limit (SENTINEL_UNIFORM) |
| leander-tx.json | NR Neighborhood Retail | 100 (flagged) | 999 (flagged) | sentinel normalized | instrument: quote states no feet limit (SENTINEL_UNIFORM) |
| leander-tx.json | MF Multifamily | 100 (flagged) | 999 (flagged) | sentinel normalized | instrument: quote states no feet limit (SENTINEL_UNIFORM) |
| leander-tx.json | LO Limited Office | 100 (flagged) | 999 (flagged) | sentinel normalized | instrument: quote states no feet limit (SENTINEL_UNIFORM) |
| leander-tx.json | LC Limited Commercial | 100 (flagged) | 999 (flagged) | sentinel normalized | instrument: quote states no feet limit (SENTINEL_UNIFORM) |
| leander-tx.json | GC General Commercial | 100 (flagged) | 999 (flagged) | sentinel normalized | instrument: quote states no feet limit (SENTINEL_UNIFORM) |
| leander-tx.json | HC Heavy Commercial | 100 (flagged) | 999 (flagged) | sentinel normalized | instrument: quote states no feet limit (SENTINEL_UNIFORM) |
| leander-tx.json | HI Heavy Industrial | 100 (flagged) | 999 (flagged) | sentinel normalized | instrument: quote states no feet limit (SENTINEL_UNIFORM) |
| liberty-hill-tx.json | AG Agricultural | 35 (flagged) | 35 | flag removed, value kept | P-146 REAL_VALUE_FLAGGED (instrument) |
| liberty-hill-tx.json | SF1 Low Density Residential | 35 (flagged) | 35 | flag removed, value kept | P-146 REAL_VALUE_FLAGGED (instrument) |
| liberty-hill-tx.json | SF2 Medium Density Residential | 35 (flagged) | 35 | flag removed, value kept | P-146 REAL_VALUE_FLAGGED (instrument) |
| liberty-hill-tx.json | SF3 High Density Residential | 35 (flagged) | 35 | flag removed, value kept | P-146 REAL_VALUE_FLAGGED (instrument) |
| liberty-hill-tx.json | TF Duplex Residential | 35 (flagged) | 35 | flag removed, value kept | P-146 REAL_VALUE_FLAGGED (instrument) |
| liberty-hill-tx.json | MF1 Multifamily | 35 (flagged) | 35 | flag removed, value kept | P-146 REAL_VALUE_FLAGGED (instrument) |
| liberty-hill-tx.json | MF2 Multifamily | 45 (flagged) | 45 | flag removed, value kept | P-146 REAL_VALUE_FLAGGED (instrument) |
| liberty-hill-tx.json | MH1 Manufactured Housing | 35 (flagged) | 35 | flag removed, value kept | P-146 REAL_VALUE_FLAGGED (instrument) |
| liberty-hill-tx.json | C1 Neighborhood Commercial/Retail | 25 (flagged) | 25 | flag removed, value kept | P-146 REAL_VALUE_FLAGGED (instrument) |
| liberty-hill-tx.json | C2 Downtown Commercial/Retail | 45 (flagged) | 45 | flag removed, value kept | P-146 REAL_VALUE_FLAGGED (instrument) |
| liberty-hill-tx.json | C3 General Commercial/Retail | 45 (flagged) | 45 | flag removed, value kept | P-146 REAL_VALUE_FLAGGED (instrument) |
| liberty-hill-tx.json | I1 Light Industrial | 45 (flagged) | 45 | flag removed, value kept | P-146 REAL_VALUE_FLAGGED (instrument) |
| liberty-hill-tx.json | I2 General Industrial | 45 (flagged) | 45 | flag removed, value kept | P-146 REAL_VALUE_FLAGGED (instrument) |
| liberty-hill-tx.json | P Public/Institutional/Civic | 100 (flagged) | 999 (flagged) | sentinel normalized | instrument: no feet limit stated; ADJUDICATED (suspect-in-mixed-group) |
| lockhart-tx.json | CLB Light Business | 60 (flagged) | 60 | flag removed, value kept | P-146 REAL_VALUE_FLAGGED (instrument) |
| lockhart-tx.json | CMB Medium Business | 60 (flagged) | 60 | flag removed, value kept | P-146 REAL_VALUE_FLAGGED (instrument) |
| lockhart-tx.json | CHB Heavy Business | 60 (flagged) | 60 | flag removed, value kept | P-146 REAL_VALUE_FLAGGED (instrument) |
| lockhart-tx.json | IL Light Industrial | 50 (flagged) | 50 | flag removed, value kept | P-146 REAL_VALUE_FLAGGED (instrument) |
| lockhart-tx.json | RLD Residential Low Density (SF-1 baseline) | 100 (flagged) | 999 (flagged) | sentinel normalized | instrument: no feet limit stated; ADJUDICATED (suspect-in-mixed-group) |
| lockhart-tx.json | RMD Residential Medium Density (conservative allowed-type envelope) | 100 (flagged) | 999 (flagged) | sentinel normalized | instrument: no feet limit stated; ADJUDICATED (suspect-in-mixed-group) |
| lockhart-tx.json | RHD Residential High Density (conservative allowed-type envelope) | 100 (flagged) | 999 (flagged) | sentinel normalized | instrument: no feet limit stated; ADJUDICATED (suspect-in-mixed-group) |
| pflugerville-tx.json | SF-MU Single Family Mixed Use | 35 (flagged) | 35 | flag removed, value kept | quote states the value |
| pflugerville-tx.json | 2-F Two Family Residential | 35 (flagged) | 35 | flag removed, value kept | quote states the value |
| pflugerville-tx.json | GB1 General Business 1 | 50 (flagged) | 50 | flag removed, value kept | quote states the value |
| pflugerville-tx.json | GB2 General Business 2 | 50 (flagged) | 50 | flag removed, value kept | quote states the value |
| pflugerville-tx.json | LI Light Industrial | 50 (flagged) | 50 | flag removed, value kept | quote states the value |
| pflugerville-tx.json | MH Manufactured Housing | 35 (flagged) | 35 | flag removed, value kept | P-146 REAL_VALUE_FLAGGED (instrument) |
| pflugerville-tx.json | A Agricultural | 35 (flagged) | 35 | flag removed, value kept | quote states the value |
| san-antonio-tx.json | RE San Antonio base district | 100 (flagged) | 999 (flagged) | sentinel normalized | instrument: no feet limit stated; ADJUDICATED (suspect-in-mixed-group) |
| san-antonio-tx.json | R-20 San Antonio base district | 100 (flagged) | 999 (flagged) | sentinel normalized | instrument: no feet limit stated; ADJUDICATED (suspect-in-mixed-group) |
| san-antonio-tx.json | R-6 San Antonio base district | 100 (flagged) | 999 (flagged) | sentinel normalized | instrument: no feet limit stated; ADJUDICATED (suspect-in-mixed-group) |
| san-antonio-tx.json | R-5 San Antonio base district | 100 (flagged) | 999 (flagged) | sentinel normalized | instrument: no feet limit stated; ADJUDICATED (suspect-in-mixed-group) |
| san-antonio-tx.json | R-4 San Antonio base district | 100 (flagged) | 999 (flagged) | sentinel normalized | instrument: no feet limit stated; ADJUDICATED (suspect-in-mixed-group) |
| san-antonio-tx.json | R-3 San Antonio base district | 100 (flagged) | 999 (flagged) | sentinel normalized | instrument: no feet limit stated; ADJUDICATED (suspect-in-mixed-group) |
| san-antonio-tx.json | RM-6 San Antonio base district | 100 (flagged) | 999 (flagged) | sentinel normalized | instrument: no feet limit stated; ADJUDICATED (suspect-in-mixed-group) |
| san-antonio-tx.json | RM-5 San Antonio base district | 100 (flagged) | 999 (flagged) | sentinel normalized | instrument: no feet limit stated; ADJUDICATED (suspect-in-mixed-group) |
| san-antonio-tx.json | RM-4 San Antonio base district | 100 (flagged) | 999 (flagged) | sentinel normalized | instrument: no feet limit stated; ADJUDICATED (suspect-in-mixed-group) |
| san-antonio-tx.json | MF-18 San Antonio base district | 100 (flagged) | 999 (flagged) | sentinel normalized | instrument: no feet limit stated; ADJUDICATED (suspect-in-mixed-group) |
| san-antonio-tx.json | MF-25 San Antonio base district | 100 (flagged) | 999 (flagged) | sentinel normalized | instrument: no feet limit stated; ADJUDICATED (suspect-in-mixed-group) |
| san-antonio-tx.json | MF-33 San Antonio base district | 100 (flagged) | 999 (flagged) | sentinel normalized | instrument: no feet limit stated; ADJUDICATED (suspect-in-mixed-group) |
| san-antonio-tx.json | MF-40 San Antonio base district | 100 (flagged) | 999 (flagged) | sentinel normalized | instrument: no feet limit stated; ADJUDICATED (suspect-in-mixed-group) |
| san-antonio-tx.json | MF-50 San Antonio base district | 100 (flagged) | 999 (flagged) | sentinel normalized | instrument: no feet limit stated; ADJUDICATED (suspect-in-mixed-group) |
| san-antonio-tx.json | MF-65 San Antonio base district | 100 (flagged) | 999 (flagged) | sentinel normalized | instrument: no feet limit stated; ADJUDICATED (suspect-in-mixed-group) |
| san-antonio-tx.json | C-1 San Antonio commercial district | 25 (flagged) | 25 | flag removed, value kept | P-146 REAL_VALUE_FLAGGED (instrument) |
| san-antonio-tx.json | C-2 San Antonio commercial district | 25 (flagged) | 25 | flag removed, value kept | P-146 REAL_VALUE_FLAGGED (instrument) |
| san-antonio-tx.json | C-3 San Antonio commercial district | 35 (flagged) | 35 | flag removed, value kept | P-146 REAL_VALUE_FLAGGED (instrument) |
| san-antonio-tx.json | O-2 San Antonio office district | 80 (flagged) | 80 | flag removed, value kept | P-146 REAL_VALUE_FLAGGED (instrument) |
| san-antonio-tx.json | I-1 San Antonio light industrial district | 100 (flagged) | 999 (flagged) | sentinel normalized | instrument: no feet limit stated; ADJUDICATED (suspect-in-mixed-group) |
| san-antonio-tx.json | I-2 San Antonio heavy industrial district | 100 (flagged) | 999 (flagged) | sentinel normalized | instrument: no feet limit stated; ADJUDICATED (suspect-in-mixed-group) |
| taylor-tx.json | P2 Rural | 100 (flagged) | 999 (flagged) | sentinel normalized | instrument: quote states no feet limit (SENTINEL_UNIFORM) |
| taylor-tx.json | P2.5 Large Lot | 100 (flagged) | 999 (flagged) | sentinel normalized | instrument: quote states no feet limit (SENTINEL_UNIFORM) |
| taylor-tx.json | P3 Neighborhood | 100 (flagged) | 999 (flagged) | sentinel normalized | instrument: quote states no feet limit (SENTINEL_UNIFORM) |
| taylor-tx.json | P3M Manufactured Housing | 100 (flagged) | 999 (flagged) | sentinel normalized | instrument: quote states no feet limit (SENTINEL_UNIFORM) |
| taylor-tx.json | P4 Mix | 100 (flagged) | 999 (flagged) | sentinel normalized | instrument: quote states no feet limit (SENTINEL_UNIFORM) |
| taylor-tx.json | P5 Urban Center | 100 (flagged) | 999 (flagged) | sentinel normalized | instrument: quote states no feet limit (SENTINEL_UNIFORM) |

Changed rows: 116
  flag removed, value kept: 40
  sentinel normalized:      76
  flag added:               0

## Basis of the flag removals (per row, because they do not share one)
  quote states the value:            6
  P-146 instrument REAL_VALUE_FLAGGED: 34
  adjudicated (suspect-in-mixed-group, 999 carried): 27

## Quote-consistency findings (999 + flag, quote still names the old 100 sentinel, no clause)
(none)
