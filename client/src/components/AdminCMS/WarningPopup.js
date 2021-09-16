const WarningPopup = ({
  setDisplayWarning,
  messages
}) => {
  return (
    <div className="WarningPopup">
      <div>
        {messages.map(msg => {
          return <p>{msg}</p>
        })}
      </div>
      <button className="adminButton--Neutral" onClick={()=>setDisplayWarning(false)}>Verstanden</button>
    </div>
  );
};

export default WarningPopup;
