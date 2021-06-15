function WishlistTableBodyTr({ item, WishlistItemTemplate, display }) {
  return (
      <tr key={item["id"]} style={{"display": !display && "none"}} id={item["id"]} class="dynamicContent processing">
        {WishlistItemTemplate.map(heading=> {
          heading=heading.toLowerCase()
          let classnamevar = "colhead_" + heading
          return (
            <td key={heading} className={classnamevar}>
              {item[heading]}
            </td>
          )
        })}
      </tr>
  );
}

export default WishlistTableBodyTr;
