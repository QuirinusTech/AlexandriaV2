import WorkflowCardsListSection from "./WorkflowCardsListSection"

const WorkflowCardsList = ({
  wfTicketList,
  cardClick,
  currentEntryId,
  adminActiveMode
}) => {

  const listByMode = wfTicketList.filter(ticket => ticket['adminmode'] === adminActiveMode)
  const arr1 = listByMode.map(ticket => ticket["category"])
  const catlist = Array.from(new Set(arr1)).sort()


  return (
    <div className="workflowCardsList">
      
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
    </div>
  );
};

export default WorkflowCardsList;
