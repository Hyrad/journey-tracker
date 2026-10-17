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

## Future milestones

- v0.1.0: family cruise itinerary, interactive map, planned trip progress, port overviews
- v0.2.0: JSON trip schema and multi-trip support
- v0.3.0: destination gallery, improved mobile sharing and accessibility
- Future: sourced, timestamped actual vessel locations where reliably available
