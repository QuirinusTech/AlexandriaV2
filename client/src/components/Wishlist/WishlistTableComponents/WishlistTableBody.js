import WishlistTableBodyTr from "./WishlistTableBodyTr"

const wishlistvar = [
  {
    et: "all",
    series: "MasterChef USA S09",
    sf: "9",
    genre: "cooking",
    st: "9",
    poster: "",
    Date: "2021/4/21-11:35",
    year: "2014-",
    status: "processing",
    type: "series",
    ef: "1",
    id: "TT1694423_S09",
  },
  {
    et: "61",
    year: "2019",
    Date: "2021/5/12-8:9",
    poster: "",
    id: "masterchef_au_s11",
    sf: "11",
    genre: "cooking",
    type: "series",
    status: "processing",
    series: "Masterchef Australia S11",
    st: "11",
    ef: "1",
  },
  {
    year: "2020",
    ef: "1",
    sf: "12",
    et: "61",
    id: "masterchef_au_s12",
    Date: "2021/5/12-8:10",
    st: "12",
    series: "Masterchef Australia S12",
    type: "series",
    genre: "reality",
    poster: "",
    status: "copied",
  },
  {
    ef: "",
    id: "tt0133985",
    sf: "",
    status: "copied",
    Date: "2021/3/03-09:03",
    type: "movie",
    year: "1998",
    poster:
      "https://m.media-amazon.com/images/M/MV5BMjE0Njc5NDU5Ml5BMl5BanBnXkFtZTcwOTc4OTkxMQ@@._V1_SX300.jpg",
    series: "A Murder of Crows",
    genre: "",
    et: "0",
    st: "",
  },
  {
    st: "1",
    type: "series",
    status: "copied",
    series: "Firefly",
    year: "2002–2003",
    id: "tt0303461",
    genre: "",
    et: "all",
    Date: "2021/1/21-18:47",
    ef: "1",
    poster:
      "https://m.media-amazon.com/images/M/MV5BOTcwNzkwMDItZmM1OC00MmQ2LTgxYjgtOTNiNDgxZDAxMjk0XkEyXkFqcGdeQXVyNDQ0MTYzMDA@._V1_SX300.jpg",
    sf: "1",
    priority: "false",
  }]

function WishlistTableBody({WishlistItemTemplate, statusFilters}) {
  return (
    <tbody id="wishlistTableBody">
      {wishlistvar.map(wishlistitem => {
        return (
          <WishlistTableBodyTr
          key={wishlistitem['id']}
          display={statusFilters[wishlistitem["status"]]}
          item={wishlistitem}
          WishlistItemTemplate={WishlistItemTemplate}
          />
        )
      })}
    </tbody>
  )
}

export default WishlistTableBody