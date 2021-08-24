// in order of priority for media entry
const allPossibleStatuses = [
  "error", //red
  "failed", // cyan
  "postponed", //orange
  "new", //aqua
  "downloading", //yellow
  "complete", //green
  "copied", // grey
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

module.exports = globals