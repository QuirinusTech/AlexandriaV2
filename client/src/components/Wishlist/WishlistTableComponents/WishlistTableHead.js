function WishListTableHead({WishlistItemTemplate}) {
  return (
    <thead>
      <tr class="dynamicContent processing">
        {WishlistItemTemplate.map(heading=> {
          heading=heading.toLowerCase()
          let classnamevar = "colhead_" + heading
          let idnamevar = "col_header_" + heading 
          return (
            <th id={idnamevar} className={classnamevar} style={{width: heading === "status" && "300px"}}>
              {heading}
            </th>
          )
        })}
      </tr>
    </thead>
  );
}

export default WishListTableHead;
