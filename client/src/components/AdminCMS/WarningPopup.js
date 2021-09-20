const modalContent = ({
  setDisplayWarning,
  messages
}) => {
  return (
    <div className="modalContent">
      <div>
        {messages.map(msg => {
          return <p>{msg}</p>
        })}
      </div>
      <button className="adminButton" onClick={()=>setDisplayWarning(false)}>Verstanden</button>
    </div>
  );
};

export default modalContent;
