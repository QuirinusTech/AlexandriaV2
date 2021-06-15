import ReportBugForm from "./Report/ReportBugForm"
import ReportFaultyMediaForm from "./Report/ReportFaultyMediaForm"

function Report() {
  return (
    <div>
      <h2>Report</h2>
      <ReportBugForm />
      <ReportFaultyMediaForm />
    </div>
  )
}

export default Report