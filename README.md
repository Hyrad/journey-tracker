# Journey Tracker

Reusable family-friendly trip itinerary and map website.

## First journey

Star Princess Caribbean cruise — October 24–November 7, 2026.

## Files

- `index.html` — responsive website, itinerary controls, and Leaflet/OpenStreetMap map.
- `trip-data.js` — trip-specific itinerary and destination facts, easy to replace for another trip.
- `journal-data.js` — explicitly approved public journal entries; starts as an empty array.
- `position-data.js` — nullable, verified AIS vessel-position snapshot; currently empty.
- `photos/` — optional approved photo files referenced by journal entries.

## Privacy and accuracy

No private LifeOS data, cabin information, booking numbers, or individual traveler positions are published. The ship icon follows a *schematic planned route*, not real GPS/AIS. Sea-day points are estimates, and all port details can change. Verify actual port times through Princess.

## Publishing

Upload both `index.html` and `trip-data.js` to the root of the public GitHub repository, along with this README. Then use **Settings → Pages → Deploy from a branch → main → /(root)**. The expected URL is `https://hyrad.github.io/journey-tracker/` after publication.

## v0.2 review changes

- Scheduled trip status: upcoming, in progress, and completed.
- Day-by-day progress bar and next scheduled stop.
- Clickable itinerary days and port map pins.
- Expandable port inspiration guides.
- Accessible mobile selection controls and clearer separation between selected-day location and real-world tracking.

**Release process:** Approved changes currently go directly to `main`, which powers the family-facing GitHub Pages site.

## v0.3.0 — Destination Discovery

- Destination-specific Wikimedia Commons photos for seven ports, with links to the photo source and license information.
- Expandable destination guides with culture, local food, and relaxed-day tips.
- Countdown to sailing and scheduled days remaining during the voyage.
- Visible version number in the header.
- Photos load from Wikimedia Commons; if a photo is unavailable, its card retains an illustrated fallback.

## v0.4.0 — Family Travel Journal

The site now shows a journal section with a latest-update panel, chronological entries, and optional photo galleries. **There are currently zero personal entries.** An entry is added only with the traveler's explicit approval for public publication.

Workflow:
1. Draft the message and select photos privately.
2. Confirm which text and photos are approved for the public website, remove sensitive location/booking information and consider photo metadata.
3. Upload approved photo files to `photos/` (use simple `.jpg`, `.png` or `.webp` filenames).
4. Add an object to `window.JOURNEY_JOURNAL` in `journal-data.js`, e.g. `{date:"2026-10-27",title:"An island afternoon",message:"A short note.",photos:[{src:"photos/island.jpg",alt:"Beach view",caption:"An island view"}]}`.
5. Commit to `main`; GitHub Pages redeploys.

**Privacy:** GitHub Pages is public. No personal message, photograph or precise land location is published automatically. Photos require explicit approval, and uploaded images should have sensitive EXIF metadata removed.

## v0.5.0 — Ship Tracking Foundation

- Correct vessel identity: Star Princess cruise ship, IMO `9863120`, MMSI `310869000` (not similarly named cargo ships).
- Public ship-specific VesselFinder link as a convenient external check.
- New separate AIS-status panel. **No verified AIS position currently ingested**, so the interface clearly says so.
- Optional `window.JOURNEY_AIS_POSITION` data contract with IMO/MMSI, lat/lon, original UTC report time and named provider; reject mismatched or invalid input.
- Positions over six hours old are marked stale; scheduled route remains visibly separate.
- GitHub Pages does not fetch AIS itself. Any automated ingestion would need a licensed/authorized provider, suitable rate and coverage, properly stored credentials, and a permitted redistribution model.
- No paid provider subscription or API keys have been configured. Do not present this release as a live-AIS service.

## AISStream GitHub Actions feasibility test

A **manual-only**, read-only workflow is available at **Actions → AISStream coverage probe (manual only) → Run workflow**.

Before running, create an AISStream API key via [aisstream.io](https://www.aisstream.io/) and store it securely in GitHub **Settings → Secrets and variables → Actions → New repository secret** as `AISSTREAM_API_KEY`. Do **not** paste the key into a chat, source file or workflow input. GitHub Actions must be enabled for this repository.

The workflow installs a Python WebSocket client, listens for up to 45 seconds for MMSI `310869000` inside a broad Caribbean rectangle, and reports only confirmation and matching-message counts. It publishes **no coordinates**, and does not change `position-data.js`. A zero count during a short test is inconclusive, particularly for a vessel offshore. The test runs **only when manually launched**, not on a schedule.

**Licensing gate:** AISStream public documentation describes the feed and backend-key requirements, but explicit permission to republish raw vessel positions publicly has not been established. Do not enable public AIS updates or persistence until written terms/permission and sufficient offshore coverage are confirmed. See https://www.aisstream.io/documentation/ and https://github.com/aisstream/issues/issues/290 .

## v0.5.1 — MyShipTracking external view

- Loads the **official published** MyShipTracking map widget using their documented `widgetApi.js` embed script.
- Links directly to [Star Princess (IMO 9863120 / MMSI 310869000)](https://www.myshiptracking.com/vessels/star-princess-mmsi-310869000-imo-9863120).
- Distinguishes this provider map (may show other vessels) from the scheduled illustrative route and from the optional independently ingested AIS marker.
- MyShipTracking may be outside AIS receiver coverage, particularly offshore. It does not guarantee real-time coordinates.
- This integration intentionally does not scrape, store or republish raw AIS positions.
- **Validation remaining:** Open the live GitHub Pages site on an iPad/desktop browser to confirm their widget actually renders under third-party browser and network restrictions. Their published embed documentation does not establish a ship-specific auto-focus option.

## v0.5.4 — Automatically calculated route estimate

The green marker estimates ship progress by linear interpolation between consecutive daily itinerary waypoints, anchored to noon America/New_York on each day. It refreshes every five minutes while the page is open and starts after the scheduled first waypoint. Select **View estimated position** to center on the computed marker. The existing ship emoji remains an itinerary-date selection marker; the two markers mean different things.

**Important:** This is a schematic, not a navigational model. Sea-day coordinates and waypoint timing are illustrative; no actual port arrival/departure times, routes, currents or GPS data are used. Actual vessel position may differ substantially. External tracking links remain available.

## v0.5.5 — Travel View and Route Visibility

- **Travel view:** A button switches to a close-follow map view at zoom level 8, with an animated ship illustration at the calculated (not GPS) location. Toggling off restores the user's previous map center and zoom.
- **Route view:** Independent toggle between the full schematic itinerary and the currently interpolated leg. This keeps other route segments hidden when focusing on the next passage.
- Both modes continue to use the existing scheduled-waypoint interpolation, and are clearly labeled estimates.
- Prior to sailing, no estimated ship position is shown. Users can still browse a selected itinerary day.
- Reduced-motion devices disable the ship's bobbing animation.
- Verification: JavaScript syntax and GitHub persistence checked. Browser behavior should be tested on iPad before relying on touch interactions.

## v0.5.6 — Fixed Ship / Destination Inspection

- The ship icon is driven exclusively by the current interpolated scheduled position, not day selection.
- Clicking a port or day selects a separate orange destination marker; it never moves the ship icon.
- The destination information panel shows the **scheduled visit date** and the approximate great-circle distance from the current scheduled ship estimate in nautical miles and kilometres.
- The distance is straight-line only: it is **not** actual navigational/sailing distance, speed, a confirmed ETA, or real GPS.
- Before departure, no current interpolated ship position is shown, so no current distance is claimed.
- JavaScript syntax and GitHub commit were verified; interactive browser testing remains recommended.

## v0.5.7 — Ship-follow camera

- Travel view follows the **calculated** ship icon and recenters it automatically after zooming, without overriding the zoom level.
- Dragging the map pauses follow mode to allow free manual exploration.
- The Travel view button changes to **Recenter & follow ship**. Tapping it resumes following at the current zoom.
- When already following, tapping the same button exits Travel view and restores the original saved map view.
- The independent route visibility toggle remains in place.
- Before departure, no estimated ship location is fabricated.
- Browser-level touch behavior should be verified on iPad; JavaScript syntax and repository persistence are checked.

## v0.6.0 — Continuous curved itinerary

- Full voyage now uses a smooth spline through the known daily itinerary positions.
- The **Route: To next port** mode runs from the most recent scheduled actual stop, through intermediate sea-day points, to the next scheduled port rather than stopping mid-ocean.
- Selecting a different port does not move the calculated ship or change the active passage.
- These are **illustrative** maritime curves, not actual navigation paths; sea-day points can be approximate and any land-crossing visual artifacts should be adjusted with additional verified sea waypoints in future versions.
- GitHub source and JavaScript syntax checked; visual map behavior to be tested on iPad.

## v0.6.1 — Traveled and Remaining Route

- **Solid teal line:** schematic portion of the itinerary already elapsed, ending at the calculated ship marker.
- **Dotted blue line:** estimated remaining path in the itinerary.
- Applies to both **Entire voyage** and **To next port** route modes.
- Splits the smooth curve by chronological itinerary segment and elapsed fraction (not nearest geographical point, which can be wrong on looping cruises).
- Before embarkation, only the planned dotted route appears. After disembarkation, the scheduled voyage is shown as solid.
- Distances and route shapes remain illustrative, not nautical navigation or GPS. Interactive browser visual confirmation is still recommended.

## v0.6.2 — Offshore route shaping and camera defaults

- **Keep centered on ship** is enabled by default. Dragging the map turns centering off; the button restores it.
- **Travel view** starts at zoom level 10, closer to the ship than before.
- Illustrative voyage legs now use curated offshore control points around Florida, the Florida Straits, the Yucatán/Belize coast, Cuba and the Bahamas instead of simple straight lines between daily destinations.
- The calculated ship marker follows the same segmented offshore corridor, so the solid past route and dotted future route meet at its estimated position.
- These are deliberately schematic offshore corridors, not actual AIS tracks, chart-verified maritime channels, or reliable schedules. Precise coast avoidance and true arrival/departure timing require further geographic/itinerary verification.
- JavaScript syntax checked; still requires visual inspection of the entire route at multiple zoom levels before describing it as reliably land-avoiding.

## Future milestones

- v0.1.0: family cruise itinerary, interactive map, planned trip progress, port overviews
- v0.2.0: improved progress, interactive itinerary, expandable port guides
- v0.3.0: destination discovery, photography, and countdown
- Next: JSON trip schema and multi-trip support
- v0.4.0: opt-in family journal, latest update, and galleries
- v0.5.0: tracking foundation and correct-vessel external source
- Future: authorized AIS ingestion if pricing, coverage and redistribution rights permit
