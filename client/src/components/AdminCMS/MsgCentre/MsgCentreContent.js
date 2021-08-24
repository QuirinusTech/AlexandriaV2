import NewMessage from "./NewMessage";
import MessageCMS from "./MessageCMS";
import Preview from "./Preview";

async function getGlobals() {
  const data = await fetch("/globals/allPossibleStatuses", {
    method: "POST",
    headers: { "Content-type": "application/json; charset=UTF-8" },
  })
    .then((res) => res.json())
    .then((data) => data);
  return data;
}

function MsgCentreContent({
  msgCentreMode,
  adminListNotifications,
  setAdminListNotifications,
  adminListUsers,
  adminListWishlist,
}) {
  var allPossibleStatuses = getGlobals();

  const Content = ({ msgCentreMode }) => {
    return msgCentreMode === "Preview" ? 
      <Preview
        adminListNotifications={adminListNotifications}
        users={adminListUsers}
      />
    :
      <MessageCMS
        adminListNotifications={adminListNotifications}
        users={adminListUsers}
        allPossibleStatuses={allPossibleStatuses}
        wishlist={adminListWishlist}
        setAdminListNotifications={setAdminListNotifications}
      />
    }

  return (
    <div>
      <Content msgCentreMode={msgCentreMode} />
    </div>
  );
}

export default MsgCentreContent;
