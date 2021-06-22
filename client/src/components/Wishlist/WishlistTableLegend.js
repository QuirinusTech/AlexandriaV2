function WishlistTableLegend() {
  return (
    <div id="infotablediv">
      <table id="info_table" className="info_table">
        <tbody>
          <tr>
            <td colSpan="2">STATUSES</td>
          </tr>
          <tr>
            <td className="info_table_td_left">New</td>
            <td>
              Your request has been added to the wishlist, but no action
              has been taken yet.
            </td>
          </tr>
          <tr>
            <td className="info_table_td_left">Downloading</td>
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
            <td className="info_table_td_left">Failed</td>
            <td>
              Something went wrong while downloading this media or we were unable to complete the download.
            </td>
          </tr>
          <tr>
            <td className="info_table_td_left">Postponed</td>
            <td>
              This media isn't available yet. Once it's available, we'll get it for you.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default WishlistTableLegend