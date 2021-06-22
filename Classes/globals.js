const allPossibleStatuses = [
  "new", //aqua
  "downloading", //yellow
  "complete", //green
  "copied", //
  "failed", //red
  "postponed", //orange
];

const mediatypes = ["movie", "series"];

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