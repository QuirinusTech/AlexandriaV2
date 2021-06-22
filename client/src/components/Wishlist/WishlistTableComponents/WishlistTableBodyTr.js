function WishlistTableBodyTr({ item, WishlistItemTemplate, display }) {


    let pBaNewVals = [0, item['progress']['new'] || 0]
    let pBaDlVals =[pBaNewVals[1], item['progress']['downloading'] || 0]
    let pBaCompVals = [pBaDlVals[0]+pBaDlVals[1], item['progress']['complete'] || 0]
    let pBaCopyVals = [pBaCompVals[0]+pBaCompVals[1], item['progress']['copied'] || 0]
    let pBaFailVals = [pBaCopyVals[0]+pBaCopyVals[1], item['progress']['failed'] || 0]
    let pBaPostPVals = [pBaFailVals[0]+pBaFailVals[1], item['progress']['postponed'] || 0]

  const ProgressBar = () => {
    return (
      <div className="progressBar">
        {pBaNewVals[1] > 0 && <div style={{left: pBaNewVals[0].toString()+"%", width: pBaNewVals[1].toString()+"%"}} className="progressBarNew progressBarSegment"><p>New</p></div>}
        {pBaDlVals[1] > 0 && <div style={{left: pBaDlVals[0].toString()+"%", width: pBaDlVals[1].toString()+"%"}} className="progressBarDl progressBarSegment"><p>Downloading</p></div> }
        {pBaCompVals[1] > 0 && <div style={{left: pBaCompVals[0].toString()+"%", width: pBaCompVals[1].toString()+"%"}} className="progressBarComp progressBarSegment"><p>Complete</p></div>}
        {pBaCopyVals[1] > 0 && <div style={{left: pBaCopyVals[0].toString()+"%", width: pBaCopyVals[1].toString()+"%"}} className="progressBarCopy progressBarSegment"><p>Copied</p></div> }
        {pBaFailVals[1] > 0 && <div style={{left: pBaFailVals[0].toString()+"%", width: pBaFailVals[1].toString()+"%"}} className="progressBarFail progressBarSegment"><p>Failed</p></div>}
        {pBaPostPVals[1] > 0 && <div style={{left: pBaPostPVals[0].toString()+"%", width: pBaPostPVals[1].toString()+"%"}} className="progressBarPostP progressBarSegment"><p>Postponed</p></div>}
      </div>
    )
  }


  return (
      <tr key={item["id"]} style={{"display": !display && "none"}} id={item["id"]} class="dynamicContent processing">
        {WishlistItemTemplate.map(heading=> {
          heading=heading.toLowerCase()
          let classnamevar = "colhead_" + heading
          return (
            <td key={heading} className={classnamevar} style={{maxWidth: "400px"}}>
              {heading === "status" ? (
                <details style={{maxWidth: "400px"}}>
                  <summary style={{maxWidth: "400px"}}>
                    <ProgressBar />
                  </summary>
                  <table style={{maxWidth: "400px"}}>
                    <tbody>
                      <tr>
                        <td>New</td>
                        <td>{item["progress"]["new"] || 0}%</td>
                      </tr>
                      <tr>
                        <td>Downloading</td>
                        <td>{item["progress"]["downloading"] || 0}%</td>
                      </tr>
                      <tr>
                        <td>Complete</td>
                        <td>{item["progress"]["complete"] || 0}%</td>
                      </tr>
                      <tr>
                        <td>Copied</td>
                        <td>{item["progress"]["copied"] || 0}%</td>
                      </tr>
                      <tr>
                        <td>Failed</td>
                        <td>{item["progress"]["failed"] || 0}%</td>
                      </tr>
                      <tr>
                        <td>Postponed</td>
                        <td>{item["progress"]["postponed"] || 0}%</td>
                      </tr>
                    </tbody>
                  </table>
                </details>
              ) : (
                <details>
                  <summary>{item[heading]}</summary>
                  <p>{item[heading]}</p>
                  <img
                    src={item["imdbData"]["Poster"]}
                    alt={item["imdbData"]["Title"]}
                  />
                </details>
              )}
            </td>
          );
        })}
      </tr>
  );
}

export default WishlistTableBodyTr;
