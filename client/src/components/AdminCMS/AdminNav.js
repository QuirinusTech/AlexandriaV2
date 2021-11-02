import PNGLoader from "../Loaders/PNGLoader";
import AdminNavButton from "./AdminNavButton"

function AdminNav({
  setAdminActiveTask,
  setAdminActiveMode,
  adminActiveTask,
  adminActiveMode,
  loading
}) {

const adminNavBarVar = [
  {
    task: "WishlistCMS",
    title: "Wishlist",
    desc: "wishlist",
    modes: [
      { modeName: "wishlistList", description: "Wishlist CMS" },
      { modeName: "wishlistNew", description: "Add New" }
    ],
    id: "01"
  },
  {
    task: "MsgCentre",
    title: "Messages",
    desc: "msgCentre",
    modes: [
      { modeName: "msgNew", description: "New Message" },
      { modeName: "msgCMS", description: "Message CMS" },
      { modeName: "msgPreview", description: "User Preview" }
    ],
    id: "02"
  },
  {
    task: "Workflow",
    title: "Workflow",
    desc: 'workflow',
    modes: [
      { modeName: "wfDownload", description: "Download" },
      { modeName: "wfComplete", description: "Complete" },
      { modeName: "wfCopy", description: "Copy" }
    ],
    id: "03"
  },
  {
    task: "UserManager",
    title: "UMC",
    desc: "userManager",
    modes: [
      { modeName: "userCMS", description: "User Manager" },
      { modeName: "blacklist", description: "Blacklist" }
    ],
    id: "04"
  }
];



  return (
    <div className="adminNavBar">
      <div className="adminNavbarQuirinusLogo" onClick={()=> {setAdminActiveTask(null); setAdminActiveMode(null)}}>
        <p>Powered by</p>
        <h3>Quirinus Tech</h3>
      </div>
      {loading ? (
        <PNGLoader />
      ) : (
        adminNavBarVar.map(navBarSection => {
          return <AdminNavButton
            key={navBarSection['id']}
            adminActiveTask={adminActiveTask}
            setAdminActiveTask={setAdminActiveTask}
            adminActiveMode={adminActiveMode}
            setAdminActiveMode={setAdminActiveMode}
            navBarSection={navBarSection}
           />
        })
        // <>
        //   <div
        //     onClick={() => setAdminActiveTask("WishlistCMS")}
        //     className={
        //       adminActiveTask === "WishlistCMS"
        //         ? "adminNavButton adminNavButton--Wishlist adminNavButton--active"
        //         : "adminNavButton adminNavButton--Wishlist"
        //     }
        //     name="WishlistCMS"
        //   >
        //     {adminActiveTask !== "WishlistCMS" ? (<h2>Wishlist CMS</h2>) : (
        //       <>
        //       <motion.h2 initial={{y: "50px", duration: 0.1 }}
        //             animate={{ y: 0 }}>Wishlist CMS</motion.h2>
        //       <div>
        //       <AnimatePresence initial={true} exitBeforeEnter={true}>
        //         <motion.button
        //             key={'wishlistList'}
        //             initial={{opacity: 0, y: "50px", delay: 0.2, duration: 0.1 }}
        //             animate={{ opacity: 1, y: 0 }}
        //             exit={{ opacity: 0, y: "50px", duration: 0.1, delay: 0 }}
        //           onClick={() => setAdminActiveMode("wishlistList")}
        //           className={
        //             adminActiveMode === "wishlistList"
        //               ? "adminActiveModeButton adminActiveModeButton--active"
        //               : "adminActiveModeButton"
        //           }
        //         >
        //           Manage Wishlist
        //         </motion.button>
        //         <motion.button
        //           key={'wishlistNew'}
        //           initial={{opacity: 0, y: "100px", delay: 0.4, duration: 0.1 }}
        //           animate={{ opacity: 1, y: 0 }}
        //           exit={{ opacity: 0, y: "100px", duration: 0.1, delay: 0 }}
        //           onClick={() => setAdminActiveMode("wishlistNew")}
        //           className={
        //             adminActiveMode === "wishlistNew"
        //               ? "adminActiveModeButton adminActiveModeButton--active"
        //               : "adminActiveModeButton"
        //           }
        //         >
        //           Create New Entry
        //         </motion.button>
        //       </AnimatePresence>
        //       </div>
        //       </>
        //     )}
        //   </div>
        //   <div
        //     onClick={() => setAdminActiveTask("MsgCentre")}
        //     className={
        //       adminActiveTask === "MsgCentre"
        //         ? "adminNavButton adminNavButton--msgCentre adminNavButton--active"
        //         : "adminNavButton adminNavButton--msgCentre"
        //     }
        //   >
        //     <h2>Message Centre</h2>
                
        //     {adminActiveTask === "MsgCentre" && (
        //       <div>
        //       <AnimatePresence initial={true} exitBeforeEnter={true}>
        //           <motion.button
        //             key={'msgNew'}
        //             initial={{opacity: 0, y: "50px", delay: 0.2, duration: 0.1 }}
        //             animate={{ opacity: 1, y: 0 }}
        //             exit={{ opacity: 0, y: "50px", duration: 0.1, delay: 0 }}
        //             onClick={() => setAdminActiveMode("msgNew")}
        //             className={
        //               adminActiveMode === "msgNew"
        //                 ? "adminActiveModeButton adminActiveModeButton--active"
        //                 : "adminActiveModeButton"
        //             }
        //           >
        //             Create New Notification
        //           </motion.button>
        //         <motion.button
        //           key={'msgCMS'}
        //           initial={{opacity: 0, y: "100px", delay: 0.4, duration: 0.1 }}
        //           animate={{ opacity: 1, y: 0 }}
        //           exit={{ opacity: 0, y: "100px", duration: 0.1, delay: 0 }}
        //           onClick={() => setAdminActiveMode("msgCMS")}
        //           className={
        //             adminActiveMode === "msgCMS"
        //               ? "adminActiveModeButton adminActiveModeButton--active"
        //               : "adminActiveModeButton"
        //           }
        //         >
        //           Manage Existing Notifications
        //         </motion.button>
        //         <motion.button
        //           key={'msgPreview'}
        //           initial={{opacity: 0, y: "150px", delay: 0.6, duration: 0.1 }}
        //           animate={{ opacity: 1, y: 0 }}
        //           exit={{ opacity: 0, y: "150px", duration: 0.1, delay: 0 }}
        //           onClick={() => setAdminActiveMode("msgPreview")}
        //           className={
        //             adminActiveMode === "msgPreview"
        //               ? "adminActiveModeButton adminActiveModeButton--active"
        //               : "adminActiveModeButton"
        //           }
        //         >
        //           Message Preview
        //         </motion.button>
        //       </AnimatePresence>
        //       </div>
        //     )}
                
        //   </div>
        //   <div
        //     onClick={() => setAdminActiveTask("Workflow")}
        //     className={
        //       adminActiveTask === "Workflow"
        //         ? "adminNavButton adminNavButton--workflow adminNavButton--active"
        //         : "adminNavButton adminNavButton--workflow"
        //     }
        //   >
        //     <h2>Workflow</h2>
        //     {adminActiveTask === "Workflow" && (
        //       <div>
        //       <AnimatePresence initial={true} exitBeforeEnter={true}>
        //         <motion.button
        //           key={'wfDownload'}
        //           initial={{opacity: 0, y: "150px", delay: 0.6, duration: 0.1 }}
        //           animate={{ opacity: 1, y: 0 }}
        //           exit={{ opacity: 0, y: "150px", duration: 0.1, delay: 0 }}
        //           transition={{ duration: 0.5 }}
        //           onClick={() => setAdminActiveMode("wfDownload")}
        //           className={
        //             adminActiveMode === "wfDownload"
        //               ? "adminActiveModeButton adminActiveModeButton--active"
        //               : "adminActiveModeButton"
        //           }
        //         >
        //           Download
        //         </motion.button>
        //         <motion.button
        //           key={'wfComplete'}
        //           initial={{opacity: 0, y: "150px", delay: 0.6, duration: 0.1 }}
        //           animate={{ opacity: 1, y: 0 }}
        //           exit={{ opacity: 0, y: "150px", duration: 0.1, delay: 0 }}
        //           transition={{ duration: 0.5 }}
        //           onClick={() => setAdminActiveMode("wfComplete")}
        //           className={
        //             adminActiveMode === "wfComplete"
        //               ? "adminActiveModeButton adminActiveModeButton--active"
        //               : "adminActiveModeButton"
        //           }
        //         >
        //           Complete
        //         </motion.button>
        //         <motion.button
        //           key={'wfCopy'}
        //           initial={{opacity: 0, y: "150px", delay: 0.6, duration: 0.1 }}
        //           animate={{ opacity: 1, y: 0 }}
        //           exit={{ opacity: 0, y: "150px", duration: 0.1, delay: 0 }}
        //           transition={{ duration: 0.5 }}
        //           onClick={() => setAdminActiveMode("wfCopy")}
        //           className={
        //             adminActiveMode === "wfCopy"
        //               ? "adminActiveModeButton adminActiveModeButton--active"
        //               : "adminActiveModeButton"
        //           }
        //         >
        //           Copy
        //         </motion.button>
        //       </AnimatePresence>
        //       </div>
        //     )}
        //   </div>
        //   <div
        //     onClick={() => setAdminActiveTask("UserManager")}
        //     className={
        //       adminActiveTask === "UserManager"
        //         ? "adminNavButton adminNavButton---userManager adminNavButton--active"
        //         : "adminNavButton adminNavButton---userManager"
        //     }
        //   >
        //     <h2>User Manager</h2>
        //   </div>
        // </>
      )}
    </div>
  );
}

export default AdminNav;
