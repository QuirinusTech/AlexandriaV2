const allPossibleStatuses = [
  "new",
  "downloading",
  "complete",
  "copied",
  "failed",
  "postponed",
];

const mediatypes = ["movie", "series", "seriesOngoing"];

const WishlistItemTemplate = [
  "imdbId",
  "status",
  "name",
  "episodes",
  "genre",
  "year",
  "poster",
  "dateAdded",
];

const globals = {
  allPossibleStatuses,
  mediatypes,
  WishlistItemTemplate
};