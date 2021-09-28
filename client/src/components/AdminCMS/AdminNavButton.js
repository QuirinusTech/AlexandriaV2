import React from 'react'
import { motion, AnimatePresence } from "framer-motion"


const AdminNavButton = ({
  adminActiveTask,
  setAdminActiveTask,
  adminActiveMode,
  setAdminActiveMode,
  navBarSection
}) => {
  return (
    <motion.div
      animate={adminActiveTask === navBarSection.task ? {height: navBarSection.modes.length * 5 + 10 + "%"} : {height: "unset"}}
      onClick={() => setAdminActiveTask(navBarSection.task)}
      className={
        adminActiveTask === navBarSection.task
          ? `adminNavButton adminNavButton--${navBarSection.desc} adminNavButton--active`
          : "adminNavButton adminNavButton--" + navBarSection.desc
      }
      name={navBarSection.task}
    >
      {adminActiveTask !== navBarSection.task ? (
        <h2>{navBarSection.title}</h2>
      ) : (
        <AnimatePresence initial={true}>
          <motion.h2 className={navBarSection.modes.length > 0 ? "shiftme" : 'doNotShift'} initial={{ x: 0, y: 0, duration: 0.1 }} animate={{ x: "-25px", y: "10px" }} exit={{ x: 0, y: "-" + navBarSection.modes.length * 100 + 100 + "%", duration: 0.1 }} key={navBarSection.title}>
            {navBarSection.title}
          </motion.h2>
          <div key={navBarSection.task+"_navBarSection_div"}>

            {navBarSection.modes.length > 0 && <AnimatePresence initial={true}>
              {navBarSection.modes.map((mode, index) => {
                return (
                  <motion.button
                    key={mode.modeName+"_navBarSection_btn"}
                    initial={{
                      opacity: 0,
                      x: "-" + ((index + 1) * 50).toString() + "px",
                      delay: adminActiveMode === mode.modeName ? (index + 1) * 0.2 : (index + 1) * 0.4,
                      duration:  0.1
                    }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: "-50px", duration: 0.1, delay: 0 }}
                    onClick={() => setAdminActiveMode(mode.modeName)}
                    className={
                      adminActiveMode === mode.modeName
                        ? "adminActiveModeButton  adminActiveModeButton--active adminButton--hover"
                        : "adminActiveModeButton"
                    }
                  >
                    {mode.description}
                  </motion.button>
                )
              })}
            </AnimatePresence>}

          </div>
        </AnimatePresence>
      )}
    </motion.div>
  );
};


export default AdminNavButton