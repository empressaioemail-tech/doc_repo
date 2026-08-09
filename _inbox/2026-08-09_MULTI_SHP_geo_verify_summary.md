# Multi-shapefile geographic verification

Generated: 2026-08-09T16:08:30.226222+00:00

## Method

This check is geographic-only and count-independent: parcel row counts are reported but were never used to flag coverage. Every loaded county FIPS store envelope was compared with the TIGERweb `State_County/MapServer/1` Census envelope in EPSG:4326.

Short means any store edge inset by more than 0.05 degrees from Census, or longitude/latitude span under 85% of the Census span. Bell 48027 is retained as a known false positive because its appraisal-district jurisdiction extends north of the Census county line.

## Result

Loaded distinct county FIPS: **196**. Short counties: **9**. Known false positives: **1**.

## Flagged counties

### 48027 (known_false_positive)

Store: W -97.921856, E -97.063259, S 30.737125, N 31.406333

Census: W -97.913847, E -97.070057, S 30.752363, N 31.320202

Reason: Bell CAD jurisdiction extends north of the Census county line; SOURCE=BELL APPRAISAL DISTRICT. Per task instruction, retained as known false positive and not re-litigated.

### 48061 (short)

Store: W -97.863556, E -97.145582, S 25.837215, N 26.412069

Census: W -97.862325, E -97.089340, S 25.837048, N 26.412715

Reason: east_edge_inset_over_0.05_degrees

### 48201 (short)

Store: W -95.436413, E -94.907611, S 29.508591, N 30.167049

Census: W -95.960733, E -94.908492, S 29.497297, N 30.170606

Reason: west_edge_inset_over_0.05_degrees, longitude_span_coverage_under_0.85

### 48245 (short)

Store: W -94.445431, E -93.837653, S 29.559776, N 30.188754

Census: W -94.445106, E -93.814351, S 29.506328, N 30.189106

Reason: south_edge_inset_over_0.05_degrees

### 48261 (short)

Store: W -97.986161, E -97.422499, S 26.597922, N 27.283322

Census: W -97.985892, E -97.225374, S 26.597884, N 27.284001

Reason: east_edge_inset_over_0.05_degrees, longitude_span_coverage_under_0.85

### 48273 (short)

Store: W -98.059809, E -97.222950, S 27.208998, N 27.635939

Census: W -98.059800, E -97.165097, S 27.209271, N 27.635982

Reason: east_edge_inset_over_0.05_degrees

### 48321 (short)

Store: W -96.377249, E -95.504186, S 28.394361, N 29.229437

Census: W -96.395198, E -95.495650, S 28.279736, N 29.229702

Reason: south_edge_inset_over_0.05_degrees

### 48355 (short)

Store: W -97.941339, E -97.046791, S 27.558500, N 27.995350

Census: W -97.942146, E -96.984281, S 27.558358, N 27.995659

Reason: east_edge_inset_over_0.05_degrees

### 48361 (short)

Store: W -94.117864, E -93.689452, S 29.966643, N 30.244244

Census: W -94.118004, E -93.688205, S 29.865053, N 30.244318

Reason: south_edge_inset_over_0.05_degrees, latitude_span_coverage_under_0.85

### 48489 (short)

Store: W -98.004318, E -97.218392, S 26.299400, N 26.611785

Census: W -98.004189, E -97.167255, S 26.299269, N 26.611769

Reason: east_edge_inset_over_0.05_degrees

## Harris 48201

Current westmost longitude: **-95.43641284699999**. Parcels with `west_lng < -95.44`: **0**. Distinct `tile_key` stacks touching the plus or minus 0.005 degree wall band: **3**; parcels touching that band: **53**.
