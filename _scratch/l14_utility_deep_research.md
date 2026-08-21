# L14 utility deep research scratch

OPEN: Lane CLOSED 2026-08-13. Close `_inbox/2026-08-13_L14_utility_deep_research_close.json`. No store writes. No rails. No atoms slot.

GROUND-TRUTH (2026-08-13 planner-verified L14-G):
- Bastrop Water_Mains 3640; Wastewater_Main 4955 (UNCHANGED vs L10). Electrical_WFL1/2 Primary_Overhead 1682 polyline, center 1333. EXPANDED vs L10 territory-only.
- Lockhart Pape-Dawson Austin_External/75 Water Mains 3464 (center 320); /76 WW 1285. Caldwell CAD host live (L10 HOST-BROKEN REFUTED).
- City of Blanco Pape-Dawson/60 water 434; /50 ww 341. PIR 2023-05-10 "do not publish externally" still queryable. Johnson City still NOT-FOUND.
- Bluebonnet BEC_SERVICE_TERRITORY count=7 (territory). PEC gis-request-form AUTH-WALLED for Blanco/Llano/Burnet.

PREDICTION CLOSE: 24/30 CONFIRMED (threshold 15). Wave 1 21 + Hays ww + Johnson water + Johnson ww. Unflipped: Bell/McLennan/Dallas/Tarrant/Hays/Johnson electric (Oncor/PEC letter, not GIS login).

GROUND-TRUTH Wave 2 F+H (planner-verified 2026-08-13):
- Weatherford Public_Utilities: Water Line Main 11025 (center 451); WW gravity 4397; Electric Line Primary 12293 polyline OH_URD 1=8271 / 2=4022 (center 348). Municipal electric DISTRIBUTION GRAPH.
- Decatur DECATURTX_V_GISDATA PW_W_PIPE 2493 (center 256); PW_WW_PIPE 1394.
- GEUS Service Area count=1 polyline (territory, not graph). Granbury WW FS 499 AUTH-WALLED. Granbury ElectricDist 42 POLYGONS (not a graph).
- Kyle WaterLines 14560 (center 319); WWLines 5646 (center 110). Hays ww FLIP.
- Burleson LCRR Water Service 15543 POINTS. gis.burlesontx.com Public_Works 499. maps.cleburne.net TraditionalPublish 499. Johnson water+ww FLIP (AUTH-WALLED / LCRR). Johnson electric Oncor PDF = NOT a flip.
- Rockwall CityworksMap_Utility Water Lines 20689 / Sewer Lines 7246. Extra vs denominator.
- Forney OpenData 499 AUTH-WALLED.

GROUND-TRUTH Wave 1 (planner-verified): Austin Water Line 315705; Waco Water_Line 92647; GUS Underground 40118; Allen water 34637; Grand Prairie water 25758; Killeen sewer Main 12319; Denton WPressurizedMain 7640; FM INTERNAL water 15099; McKinney CoServ primary 20332; PUCT sewer CCN zip 1455 polygons 28/28; TWDB PWS 4621; SAWS SLI 660167 points; CPS GIS SSO AUTH-WALLED; DME ServiceTerritory 1.

LESSON: Catalogue-search-alone (Socrata 0, utility-hint folder walk, unnamed "Main" layer) is the L10 failure mode. AUTH-WALLED GIS login is a flip; an Oncor pole-license PDF is SERVICE-LETTER-REQUIRED, not AUTH-WALLED.

DEAD-END: Do not count HIFLD/PUCT CCN/TWDB PWS as flipping a NOT-FOUND mains cell. Do not treat NBU Electric Assets 15255 points as a distribution graph. Do not treat Kentucky La Grange as Texas. Do not use Decatur VIEWONLY (geometry stripped to 0).
