
import { useState} from 'react'
import TableBodySetup from './TableBodySetup';

// const getWishlistData = [{
//   addedBy: "aegisthus",
//   dateAdded: "Tue Jun 22 2021",
//   ef: 1,
//   episodes: {
//     1: {
//       1: "new",
//       2: "new",
//       3: "new",
//       4: "new",
//       5: "new",
//       6: "new",
//       7: "new",
//       8: "new",
//       9: "new",
//       10: "new",
//       11: "new",
//       12: "new",
//     },
//     2: {
//       1: "new",
//       2: "new",
//       3: "new",
//       4: "new",
//       5: "new",
//       6: "new",
//       7: "new",
//       8: "new",
//       9: "new",
//       10: "new",
//       11: "new",
//       12: "new",
//     },
//   },
//   et: "all",
//   id: "16d01c97-d200-4463-b7b4-9c649c4c3a5a",
//   imdbData: {
//     Actors: "Tyler Posey, Holland Roden, Dylan O'Brien, Linden Ashby",
//     Awards: "23 wins & 39 nominations.",
//     Country: "USA",
//     Director: "N/A",
//     Genre: "Action, Drama, Fantasy, Romance, Thriller",
//     Language: "English",
//     Metascore: "N/A",
//     Plot: "An average high school student and his best friend get caught up in some trouble causing him to receive a werewolf bite. As a result they find themselves in the middle of all sorts of dramas in Beacon Hills.",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BMThlNTk3YzMtOTZjMi00M2NiLTg1NTgtYThiYzE2MDFmMDUwXkEyXkFqcGdeQXVyNzA5NjUyNjM@._V1_SX300.jpg",
//     Rated: "TV-14",
//     Ratings: 0,
//     Source: "Internet Movie Database",
//     Value: "7.6/10",
//     Released: "05 Jun 2011",
//     Response: "True",
//     Runtime: "41 min",
//     Title: "Teen Wolf",
//     Type: "series",
//     Writer: "Jeff Davis",
//     Year: "2011–2017",
//     imdbID: "tt1567432",
//     imdbRating: "7.6",
//     imdbVotes: "130,163",
//     totalSeasons: "6",
//   },
//   imdbID: "tt1567432",
//   isOngoing: false,
//   isPriority: true,
//   mediaType: "series",
//   name: "Teen Wolf",
//   progress: {
//     new: 20,
//     downloading: 60,
//     complete: 10,
//     failed: 10
//   },
//   sf: 1,
//   st: 2,
//   status: "new",
// }];


function WishlistTableBody({wishlistData, WishlistItemTemplate, setWishlistData, statusFilters}) {

  
  return (
    <tbody id="wishlistTableBody">
      <TableBodySetup
        wishlistData={wishlistData}
        statusFilters={statusFilters}
        WishlistItemTemplate={WishlistItemTemplate}
        setWishlistData={setWishlistData}
      />
    </tbody>
  );
    
  }

export default WishlistTableBody