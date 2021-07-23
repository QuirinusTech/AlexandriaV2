import WishlistTableBodyTrSeries from "./WishlistTableBodyTrSeries"
import WishlistTableBodyTrMovie from "./WishlistTableBodyTrMovie"

function TableBodySetup({wishlistData, statusFilters, WishlistItemTemplate, setWishlistData}) {
  const recentlyViewed = localStorage.getItem('recentlyViewed') || null
  return wishlistData.map(wishlistitem => {
    let recentlyViewedBool = false
    // console.log(recentlyViewed[0], wishlistitem['imdbID'])
    if (recentlyViewed[0] === wishlistitem['imdbID']) {
      recentlyViewedBool = true
    }
    if (wishlistitem['mediaType'] === "series") {
      return (
        <WishlistTableBodyTrSeries
        wishlistData={wishlistData}
          setWishlistData={setWishlistData}
          recentlyViewedBool={recentlyViewedBool}
          wishlistitem={wishlistitem}
          key={wishlistitem['id']}
          display={statusFilters[wishlistitem["status"]]}
          item={wishlistitem}
          WishlistItemTemplate={WishlistItemTemplate}
        />
      )
    } else {
      return (
        <WishlistTableBodyTrMovie
          recentlyViewedBool={recentlyViewedBool}
          wishlistitem={wishlistitem}
          key={wishlistitem['id']}
          display={statusFilters[wishlistitem["status"]]}
          item={wishlistitem}
          WishlistItemTemplate={WishlistItemTemplate}
        />)
    }
  })
}

export default TableBodySetup