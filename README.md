## v1.5.0 — Photo postcards (draft and review workflow)

- Postcard Studio now accepts one photo from iPhone/iPad Photo Library or files. Images are resized to at most 1200 px and recompressed locally before saving with the postcard draft in browser localStorage.
- A live photo preview and accessible photo description accompany the postcard. Existing text-only drafts remain readable.
- “Préparer pour publication” uses the system Share Sheet where supported, or copies draft text as a fallback. This is for **human review only**. No public website or Supabase upload occurs automatically.
- Public publishing still requires an explicit approval and upload/commit of the approved photo and journal entry to the public repository. Photo files may be visible to anyone after that publication.
- Local browser storage is not synced or backed up, and Safari may clear it or refuse large drafts. Test photo import/share on iPhone before departure.
- The existing invitation-only family messages and public/private access separation are unchanged.

## v1.4.0 — Tableau de bord vivant

- Public, compact, bilingual at-a-glance dashboard above the daily adventure.
- Fort Lauderdale time (America/New_York), days until embarkation or return, date-based trip completion and upcoming port stop from the published itinerary.
- Weather forecast uses the public Open-Meteo API for the upcoming itinerary stop, only when its scheduled date falls within the forecast window. Forecast is labelled external and **not ship weather, GPS or live onboard observation**.
- If forecasts are too distant or the API fails, an honest unavailable / too early label is shown. Requires an internet connection.
- No member information or Supabase credentials are used in the public dashboard. Private messages remain separated.
- Safari/iPad visual check is pending; syntax and GitHub contents were checked.

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

## v0.6.4 — Along-itinerary destination distances

- Selecting any itinerary date or port displays the approximate **remaining distance along the full chronological offshore route**, not a direct great-circle distance.
- Uses the same manually shaped offshore segments that draw the route and locate the extrapolated ship.
- Includes the current segment remainder plus all intermediate itinerary legs before the selected future stop. Multiple calls at the same location (e.g. Fort Lauderdale) are distinguished by date/index.
- Before departure the panel clearly measures from the **planned embarkation waypoint**, not a verified ship location.
- Passed stops report zero **remaining** route distance, not zero distance sailed.
- Distances are estimates derived from handcrafted waypoints, not nautical charts or verified shipping lanes.

## v0.7.0 — Voyage Dashboard

- Compact at-a-glance dashboard above the map: next scheduled port and visit date, planned nautical miles to that stop, estimated nautical miles elapsed, and nautical miles remaining on the full illustrative itinerary.
- Route-distance progress bar using the same offshore route approximation as the map.
- Calendar-day estimate until the next scheduled visit, explicitly **not a confirmed arrival-hour ETA**.
- Before departure, measures planned distances from the embarkation waypoint. After completion, shows a completed voyage with zero remaining distance.
- Refreshes when the page loads and every five minutes while it remains open.
- Precise arrival/departure times have **not** been verified against official Princess information; adding such data is a future accuracy upgrade, not part of this release.
- No live AIS or official maritime routing data used. All distance figures are schematic.

## v0.8.0 — Time-Aware Port Stops & Preview

- Adds `port-schedule.js`: arrival/departure hours for each actual stop, transcribed from a [third-party Star Princess timetable](https://www.cruisetimetables.com/cruisesonstarprincess-24oct2026.html).
- **Not yet verified with Princess.** For modeling purposes the listed hours are treated as America/New_York reference-clock times, including Eastern Standard Time after the Nov 1 DST transition. This is an assumption: local port time and Princess onboard time may differ.
- Ship remains at the port coordinate between the scheduled arrival and departure, then advances along the illustrated offshore route to the next stop. Sea-day points remain geometric intermediate anchors, not stops.
- Dashboard shows approximate time until the next arrival or departure, labeled provisional. It must **never** be used as the ship's authoritative all-aboard time.
- Simulation preview supports selecting a future date/time (interpreted Eastern time), with a button to return to the real current date/time. It alters **only the preview**, never the published itinerary or visitor data.
- No AIS or GPS positions. The movements remain modeled.
- Tested: GitHub source persistence and inline JavaScript syntax. Interactive simulator still needs mobile-browser verification.

## v0.8.1 — Simulation reliability fixes and tests

- Fixed at-sea ship status text referencing a missing `to` itinerary index.
- Corrected active-port detection to use the docked stop index, not a previous sea-day anchor.
- Prevented out-of-range final-leg indexing in the **To next port** route mode after voyage completion.
- Tested 9 deterministic simulation cases (predeparture, Roatán arrival/port/departure, Belize dock, Oct 31 / Nov 1 daylight-saving boundary, Grand Turk dock and final completion): **all passed**.
- Source syntax and GitHub persistence verified. Browser-level Leaflet rendering and real-world timetable/time-zone assumptions remain unverified.
- Provisional port times must never substitute for Princess's onboard all-aboard instructions.

## v0.9.0 — Family Cruise Companion

- **Today's Adventure** card placed above the map, presenting a relaxed schedule-based daily summary, optional activity suggestion and the next scheduled port.
- Day view follows either real current Eastern-calendar date or the simulation-preview date. The destination-specific guide button selects and scrolls to the corresponding itinerary day.
- Simple mobile-friendly quick navigation to Today, Map, Itinerary and Ports, with accessible-sized touch targets.
- Port-day panel explicitly reminds users to check the authoritative Princess app/onboard all-aboard time, never to rely on provisional model hours.
- No reservations, activity bookings, private family journal entries or private LifeOS records were exposed.
- Static JavaScript syntax verified and committed to GitHub; visual Safari testing still recommended.

## v0.9.2 — Mobile collapsible sections

- Collapsible native HTML disclosure panels reduce long vertical blocks on phones: external vessel tracking, map accuracy notes, postcard archive, full day-by-day itinerary, and destination guides.
- Today's Adventure, progress metrics, ship map, latest postcard and essential safety context remain visible.
- The full itinerary is collapsed by default on mobile, expanded by default on desktop; subsequent user toggles take priority.
- Quick navigation automatically opens the requested itinerary or destination panel before scrolling there.
- Improved keyboard/touch affordances with native summary buttons. Existing journal publication consent remains unchanged.
- GitHub code and JavaScript syntax checked; real iPhone Safari visual verification pending.

## v1.0.0 — Departure Edition PWA

- Web app manifest with standalone display, ship icon, and Home Screen launch URL in the GitHub Pages project scope.
- Service worker caches the public app shell and itinerary data on the first online visit, and uses network-first updates when online. Offline revisit works for previously cached pages and itinerary text.
- Important limitations: online map tiles, externally hosted Leaflet assets (if not previously available in browser cache), remote photographs, verified ship tracking, and external links need internet. An offline indicator makes this clear. No private or authenticated data is cached by this worker.
- Mobile bottom navigation: Today, Map, Itinerary, Journal. The itinerary expands automatically when using its tab. Uses native safe-area padding on modern iPhones.
- iPhone installation: open the website in **Safari**, Share → **Add to Home Screen**, then open it from the icon. Verify offline availability only after visiting once with a working connection.
- Do not mistake provisional schedule-driven ship movement for live GPS. Official Princess app and onboard notices remain authoritative, particularly for all-aboard times.
- The app-shell/source JavaScript syntax and GitHub persistence have been verified; iPhone installation and offline usability still need device-level testing before declaring departure readiness.

## v1.1.0 — Family Postcards & private drafting

- Public travel journal displays only entries manually added to `journal-data.js` after explicit approval. **No family postcard is published by this release.**
- New `postcard-studio.html` provides an optional private draft workspace. Drafts are stored in that browser's `localStorage` only (not synced or uploaded); clearing browsing data can delete them, and someone else using the same device/profile could view them.
- Draft, preview, edit, delete, and **Copy for approval** actions. The copied text explicitly marks the postcard as unapproved. Copying does **not** post or commit content. Submit the draft for review and approve any publication explicitly.
- Images are not uploaded by the drafting tool. Any eventual published photo must be selected and approved before adding it to the public `photos/` directory.
- New link to the Postcard Studio from the journal, and more precise empty-state text in the public journal.
- Avoid real-time locations, sensitive booking details, personal identifiers, or other information unsuitable for the public internet.
- JavaScript parsing and GitHub persistence verified; iPhone functional testing pending.

## v1.2.0 — Interactive Travel Memories

- Public journal browser now groups **approved** postcards by itinerary day/port, with a destination filter, chronological memory controls, and a photo gallery sourced only from approved local `photos/` paths.
- Timeline entries can select their corresponding day on the map without moving the independent ship-position marker.
- `postcard-studio.html` now assigns a local draft to an exact itinerary day/date. Drafts remain in the originating device's browser local storage; copying a draft does not publish it.
- Published entries with a valid `dayIndex` are linked to that itinerary index; date remains the fallback for older entries.
- No new public postcards, photos, or private family details were added. The `journal-data.js` publication list remains empty.
- Code-level JavaScript syntax verified. Safari behavior and visual layout remain to be checked on device.

## v1.3.0 — Private Family Messages (requires activation)

- A standalone `messages.html` page is linked from the website and iPhone bottom navigation.
- Front end supports invited-member email/password authentication, invitation password setup, family-only message history (100 latest), and posting/refreshing messages when online.
- Uses a **dedicated Supabase project** with mandatory database row-level security (RLS). Schema and restrictive policies are in `supabase-messages.sql`. Family membership is a manually approved UUID allowlist; a visitor knowing the URL cannot join or read messages merely by knowing that URL.
- `messages-config.js` is currently now set to the project's public URL and publishable key. The protected database is deployed, but **family authentication onboarding is still pending**; no approved member accounts or messages have been added. The static GitHub Pages host cannot itself enforce private authentication.
- Supabase's publishable/anon client key is allowed in public front-end config **only after RLS is enabled and tested**. NEVER commit a `service_role` key, admin token, private email directory or passwords.
- Setup (project owner): create dedicated Supabase project; run `supabase-messages.sql` in its SQL editor; disable public sign-ups and anonymous auth in Auth settings; configure allowed redirect URL `https://hyrad.github.io/journey-tracker/messages.html`; invite family members individually using Auth invitation email; manually approve each user UUID in `family_members` using a private SQL editor; set the public project URL and publishable key in `messages-config.js`. Confirm unapproved accounts receive no rows and inserts are denied before inviting family.
- To revoke access, remove that person's `family_members` row and disable/delete their Supabase Auth user as appropriate. Database rows remain until managed by owner.
- Privacy: content is private to approved logged-in family accounts but not end-to-end encrypted; Supabase project administrators can access messages. No automatic chat notifications, offline queue, or photo attachments in this version. Don't send booking numbers, sensitive documents, or real-time location details.
- The dedicated Supabase Canada Central project was created at the quoted $0/month project cost; database RLS is deployed and Supabase security advisors returned no current findings. Anonymous table read permission is denied. Invited-account authorization and iPhone functional tests are still pending.

## v1.3.1 — French-default interface and language switch

- The app loads in **French** by default with a fixed **EN** button to switch to English; switch back with **FR**. The browser saves the preference locally across the main site, Messages, and Postcard Studio.
- Interface labels, major dashboard headings, common dynamic progress messages and navigation have a French translation layer. Family-authored content is not automatically translated.
- iPhone PWA cache version incremented to fetch the updated translation script and related pages. Refresh the installed app online after deployment.
- This first translation pass does not claim exhaustive localization of every lengthy destination guide or uncommon status message. The original English remains accessible. Mobile Safari visual review is pending.

## v1.3.2 — Traduction française approfondie

- Français par défaut, bascule FR/EN mémorisée dans l'appareil, sur le site principal, la messagerie et l'atelier de cartes postales.
- Traduction étendue de l'accueil, des cartes récapitulatives, des boutons de navigation, des modes du trajet, des avertissements, de la messagerie et des brouillons.
- Les noms propres et les messages rédigés par les proches restent inchangés.
- Mise à jour du cache PWA pour récupérer les nouvelles ressources après une visite en ligne.
- Vérification de la syntaxe JavaScript et de la persistance GitHub. Une revue visuelle et linguistique sur Safari demeure nécessaire, notamment pour les guides longs et les phrases dynamiques moins courantes.

## Future milestones

- v0.1.0: family cruise itinerary, interactive map, planned trip progress, port overviews
- v0.2.0: improved progress, interactive itinerary, expandable port guides
- v0.3.0: destination discovery, photography, and countdown
- Next: JSON trip schema and multi-trip support
- v0.4.0: opt-in family journal, latest update, and galleries
- v0.5.0: tracking foundation and correct-vessel external source
- Future: authorized AIS ingestion if pricing, coverage and redistribution rights permit

## Port civil time — pending production approval

`port-time-zones.js` adds a compact bilingual block to the seven existing destination cards. It uses `Intl.DateTimeFormat`, actual visit dates and IANA zones, with `America/Toronto` for Montréal. A clearly labelled example compares noon in Montréal with local civil time on that visit date; it is not a live clock or a ship-time prediction. November 1 comparisons use noon, after the DST transition.

Zones: Roatán `America/Tegucigalpa`; Belize `America/Belize`; Cozumel `America/Cancun`; Celebration Key and Bimini `America/Nassau`; Amber Cove `America/Santo_Domingo`; Grand Turk `America/Grand_Turk`.

Source checked October 22, 2026: [IANA northamerica](https://data.iana.org/time-zones/tzdb-2026e/northamerica) and [IANA compatibility links](https://data.iana.org/time-zones/tzdb-2026e/backward) (Nassau). The visitor's browser supplies its installed timezone database. Unsupported timezone data shows an unavailable label rather than an invented offset.

No official schedules, modeled ship movement, map labels or all-aboard deadlines are changed. The exact requested Princess safety reminder appears in each language. The new blocks own their translations; the generic translation walker skips them. The service-worker cache includes the module and is versioned for update.

Validation: `node --test tests/port-time-zones.test.cjs`. Browser checks: serve this directory on port 8080 and run `node tests/port-time-zones.browser.cjs` with Playwright and Chromium/WebKit installed. No build step or package manifest exists in this static project.
