import WorkflowCardsListSection from "./WorkflowCardsListSection"

const WorkflowCardsList = ({
  wfTicketList,
  cardClick,
  currentEntryId,
  adminActiveMode
}) => {

  const listByMode = wfTicketList.filter(ticket => ticket['adminmode'] ===   adminActiveMode)
  const arr1 = listByMode.map(ticket => ticket["category"])
  const catlist = Array.from(new Set(arr1))

  return (
    <div className="WorkflowCardsList">
      
      {catlist.map(category => {
        let listByCategory = listByMode.filter(entry => entry['category'] === category)
        return (
          <WorkflowCardsListSection
            list={listByCategory}
            currentEntryId={currentEntryId}
            category={category}
            cardClick={cardClick}
          />
        )
      })}
      
      {/* {adminActiveMode === "wfDownload" && 
      <>

        <WorkflowCardsListSection
        list={wfListNew}
        currentEntryId={currentEntryId}
        category="New"
        cardClick={cardClick}
       />
      <WorkflowCardsListSection
        list={wfListPostponed}
        currentEntryId={currentEntryId}
        category="Postponed"
        cardClick={cardClick}
       />
       
       </>}
      
      {adminActiveMode === "wfComplete" && 
      <WorkflowCardsListSection
        list={wfListDownloading}
        currentEntryId={currentEntryId}
        category="Downloading"
        cardClick={cardClick}
       />
}
{adminActiveMode === "wfCopy" && 
      <WorkflowCardsListSection
        list={wfListComplete}
        currentEntryId={currentEntryId}
        category="Complete"
        cardClick={cardClick}
       />
} */}
    </div>
  );
};

export default WorkflowCardsList;
