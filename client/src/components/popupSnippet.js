// const Popup = () => {
  
//   const [popupContent, setPopupContent] = useState(['',''])
//   const [popupClass, setPopupClass] = useState('popup--right')

//   useEffect(() => {
//     const update = async () => {
//       setTimeout(() => setPopupClass('popup--right'), 5000)      
//     }
//     if (popupContent[0].length > 0) {
//       setPopupClass('popup--right slideLeft')
//       update()
//     }
//   }, [popupContent]);


//     return (
//     <>
//     {/* Test buttons */}
//     <div className='bulkActionButtonsContainer'>
//       <button className='adminButton--neutral adminButton--small' onClick={()=> setPopupContent(['heading', new Date().toGMTString(), 'testy testy'])}>Test</button>
//       <button className='adminButton--danger adminButton--small' onClick={()=> setPopupContent(['Warning', new Date().toGMTString(), 'hello'])}>Test warning</button>
//       <button className='adminButton--submit adminButton--small' onClick={()=> setPopupContent(['Success', 'The requested changes were committed to the database.'])}>Test Success</button>
//       <button className='adminButton--cancel adminButton--small' onClick={()=> setPopupClass('popup--right slideLeft')}>Force button open</button>
//     </div>

//     {/* Actual insert */}
    // <div className={popupClass}>
    //   <button className='popup--right--X adminButton--cancel adminButton adminButton-small' onClick={()=>setPopupClass('popup--right')}>OK</button>
    //   <div>
    //   {popupContent[0] !== '' && <h4 className={popupContent[0].toUpperCase() === 'WARNING' ? 'warning' : 'highlightH4'}>{popupContent[0]}</h4>}
    //     <p>{popupContent[1]}</p>
    //     <p className={popupContent[0].toUpperCase() === 'WARNING' ? 'boldRedText' : ''}>{popupContent[2]}</p>
    //   </div>
    // </div>
    
//     </>)
// }


// setPopupContent(['Warning', data['Error'], 'Failed'])
// setPopupContent(['Success', 'Requested changes were successful'])