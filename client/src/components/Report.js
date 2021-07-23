import { useState } from "react"
import ReportBugForm from "./Report/ReportBugForm"
import ReportFaultyMediaForm from "./Report/ReportFaultyMediaForm"

function Report() {
  const [reportType, setReportType] = useState(null)

  return (
    <div>
      <h2>Report</h2>

      <div className="reportInit">
        <p>Does your report pertain to faulty media or the website?</p>
        <div>
          <button onClick={() => setReportType('faultyMedia')}>Faulty Media</button>
          <button onClick={() => setReportType('bug')}>Website Bug</button>
        </div>
      </div>
      {reportType === "bug" ?
      <ReportBugForm />
      :
      <ReportFaultyMediaForm />
      }
    </div>
  )
}

export default Report