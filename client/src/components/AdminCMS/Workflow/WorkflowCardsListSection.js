import { motion, AnimatePresence } from "framer-motion"

const WorkflowCardsListSection = ({list, currentEntryId, category, cardClick}) => {
  
  return (<div className="workflowCardsList--section">
          <h4>{category} ({list.length})</h4>
          <AnimatePresence>

          {list.length > 0 &&
            list.map((wfTicket, index) => {
              let classNameString = "workflowCardsListCard"
              if (wfTicket["id"] === currentEntryId) {classNameString+=" activeTicket"}
              if (wfTicket["resolved"]) {classNameString+=" resolved"}
              return (
                <motion.div
                  transition={{duration: 0.05, delay: index*0.1}}
                  initial={{ opacity: 0, y: "1vw" }}
                  animate={{opacity: 1, y: 0 }}
                  exit={{opacity: 0,  y: "-105px" }}
                  className={
                    classNameString
                  }
                  key={wfTicket["id"]}
                  onClick={() => cardClick(wfTicket["id"])}
                >
                  <p
                    className="wfCardText"
                    name={`wfCard--${category}`}
                    value={wfTicket["id"]}
                  >
                    {wfTicket["affectedEntry"]} ({wfTicket["owner"]})
                  </p>
                  <div className="cardTags">
                    {!wfTicket['resolved'] && wfTicket['isPriority'] && <span>❗</span>}
                    {!wfTicket['resolved'] && (wfTicket['mediaType'] === "movie" ? <span>🎦</span> :<span>🔁</span>)}
                    <span>
                    {wfTicket['resolved'] ? ('✔️') : ('⚠️')}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          {list.length === 0 && <div className="emptyCardList">None</div>}
          </AnimatePresence>
        </div>)
};

      export default WorkflowCardsListSection