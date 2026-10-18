// Optional last independently reported AIS position; populated only from an authorized source.
// This intentionally starts empty: never fabricate location or use planned route as actual AIS.
// Contract: {imo:9863120,mmsi:310869000,latitude:0,longitude:0,reportedAt:"ISO-8601 UTC",source:"Provider",sourceUrl:"https://..."}
// Validate vessel identity, timestamp freshness, and provider redistribution terms before publishing.
window.JOURNEY_AIS_POSITION = null;
