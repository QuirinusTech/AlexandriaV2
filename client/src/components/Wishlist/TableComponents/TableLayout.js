import TableRows from "./TableRows";

const TableLayout = ({ statusFilters, wishlistData, setWishlistData, searchBoxValue }) => {
  return (
    <div id="wishlisttablediv">
      <table id="wishlisttable">
        <tbody id="wishlistTableBody">
          <TableRows
            searchBoxValue={searchBoxValue}
            wishlistData={wishlistData}
            statusFilters={statusFilters}
            setWishlistData={setWishlistData}
          />
        </tbody>
      </table>
    </div>
  );
};

export default TableLayout;
