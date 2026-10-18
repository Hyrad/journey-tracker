# Journey Tracker

Reusable family-friendly trip itinerary and map website.

## First journey

Star Princess Caribbean cruise — October 24–November 7, 2026.

## Files

- `index.html` — responsive website, itinerary controls, and Leaflet/OpenStreetMap map.
- `trip-data.js` — trip-specific itinerary and destination facts, easy to replace for another trip.

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

**Release process:** This update is on a review branch. Review before merging into `main`, which powers the family-facing GitHub Pages site.

## Future milestones

- v0.1.0: family cruise itinerary, interactive map, planned trip progress, port overviews
- v0.2.0 candidate: improved progress, interactive itinerary, expandable port guides
- Next: JSON trip schema and multi-trip support
- v0.3.0: destination gallery, improved mobile sharing and accessibility
- Future: sourced, timestamped actual vessel locations where reliably available
