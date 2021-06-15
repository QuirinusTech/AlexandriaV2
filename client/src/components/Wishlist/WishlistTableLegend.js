function WishlistTableLegend() {
  return (
    <div id="infotablediv">
      <table id="info_table" className="info_table">
        <tbody>
          <tr>
            <td className="info_table_td_left">SF</td>
            <td>Season From</td>
          </tr>
          <tr>
            <td className="info_table_td_left">EF</td>
            <td>Episode From</td>
          </tr>
          <tr>
            <td className="info_table_td_left">ST</td>
            <td>Season To</td>
          </tr>
          <tr>
            <td className="info_table_td_left">SF</td>
            <td>Season From</td>
          </tr>
          <tr>
            <td colSpan="2">
              <p>
                e.g. From S01E01 to S02E10 would be represented with the
                following values:
              </p>
              <p>SF: 1, EF: 1, ST: 2, ET: 10</p>
            </td>
          </tr>
          <tr>
            <td colSpan="2">STATUSES</td>
          </tr>
          <tr>
            <td className="info_table_td_left">Received</td>
            <td>
              Your request has been received by the administrator, but no action
              has been taken on the request yet.
            </td>
          </tr>
          <tr>
            <td className="info_table_td_left">Processing</td>
            <td>The media is currently being downloaded.</td>
          </tr>
          <tr>
            <td className="info_table_td_left">Complete</td>
            <td>
              The media has finished downloading and is ready to be copied over.
            </td>
          </tr>
          <tr>
            <td className="info_table_td_left">Copied</td>
            <td>The media has been copied over to your external hard drive.</td>
          </tr>
          <tr>
            <td className="info_table_td_left">Archive</td>
            <td>
              The listing is still on record as previously downloaded, but has
              been deleted.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default WishlistTableLegend