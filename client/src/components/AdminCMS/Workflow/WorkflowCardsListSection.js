import { motion, AnimatePresence } from "framer-motion"

const WorkflowCardsListSection = ({list, currentEntryId, category, cardClick}) => {
  
  return (<details className="WorkflowCardsList--Section darkDetails" open>
          <summary className="adminButton">{category} ({list.length})</summary>
          <AnimatePresence>

          {list.length > 0 &&
            list.map((wfTicket, index) => {
              let classNameString = "WorkflowCardsListCard"
              if (wfTicket["id"] === currentEntryId) {classNameString+=" activeTicket"}
              if (wfTicket["resolved"]) {classNameString+=" Resolved"}
              return (
                <motion.div
                  transition={{duration: 0.1, delay: index*0.2}}
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
                    {wfTicket["affectedEntry"]}
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
        </details>)
};

      export default WorkflowCardsListSection