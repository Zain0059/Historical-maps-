# Historical boundary data attribution

`src/data/romanBoundaries.json` is an extracted database from **Ancient World Mapping Center, University of North Carolina at Chapel Hill**, [AWMC/geodata](https://github.com/AWMC/geodata). It is distributed under the [Open Database License 1.0](https://opendatacommons.org/licenses/odbl/1-0/); a copy is included in this directory. Selection retains source coordinates and attributes. See `historical-geography-provenance.json` for exact source paths and blob hashes. AWMC credits Barrington Atlas and modifications to OpenStreetMap in its upstream notice.

`src/data/modernHistoricalBoundaries.json` is an adaptation of **Schvitz, Rüegger, Girardin, Cederman, Weidmann and Gleditsch, CShapes 2.0**, [ETH Zurich](https://icr.ethz.ch/data/cshapes/), via the [fullpuri display derivative](https://github.com/harahettarou/fullpuri/tree/HEAD/assets/historical-map/cshapes). Distributed under **[Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International](https://creativecommons.org/licenses/by-nc-sa/4.0/)**. Noncommercial use only; adaptations must retain this license. No endorsement is implied.

Citation: Schvitz et al. (2022), “Mapping The International System, 1886–2017: The CShapes 2.0 Dataset,” Journal of Conflict Resolution 66(1):144–161, https://doi.org/10.1177/00220027211013563.

The upstream display derivative simplifies geometry by 0.025 degrees and reduces coordinate precision. This project selects Egypt/Sudan records, retains coordinates, reduces attributes, and derives a separate Sinai ring by joining the distinct coast and canal paths between matching vertices. The small alternative path near Lake Manzala is excluded rather than treated as a political change. Original start/end values are metadata, not blanket approval for every date in that interval. In particular the 1979 full-Egypt record is not used to imply completion of withdrawal.

These notices apply to the two independent data collections named above. Natural Earth data remains public domain. No license change to unrelated application code is asserted.
