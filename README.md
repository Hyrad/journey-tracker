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

## Future milestones

- v0.1.0: family cruise itinerary, interactive map, planned trip progress, port overviews
- v0.2.0: improved progress, interactive itinerary, expandable port guides
- v0.3.0: destination discovery, photography, and countdown
- Next: JSON trip schema and multi-trip support
- v0.4.0: opt-in family journal, latest update, and galleries
- v0.5.0: tracking foundation and correct-vessel external source
- Future: authorized AIS ingestion if pricing, coverage and redistribution rights permit
