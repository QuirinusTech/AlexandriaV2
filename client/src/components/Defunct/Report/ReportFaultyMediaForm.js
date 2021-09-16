// import { useState } from "react/cjs/react.development";
// import CSSLoader from "../Loaders/CSSLoader"

// function ReportFaultyMediaForm() {
//   const [affectedTitle, setAffectedTitle] = useState({
//     isSeries: false,
//     isMovie: false,
//     title: "",
//     episodes: "N/A",
//   });

//   const [issueCategories, setIssueCategories] = useState({
//     category_audio: false,
//     category_video: false,
//     category_format: false,
//     category_other: false,
//   });

//   const [audioIssues, setAudioIssues] = useState({
//     audio_language: false,
//     audio_noAudio: false,
//     audio_Quality: false,
//   });

//   const [videoIssues, setVideoIssues] = useState({
//     video_stutter: false,
//     video_noVideo: false,
//     video_Quality: false,
//   });

//   const [otherIssues, setOtherIssues] = useState("");

//   const [loading, setLoading] = useState(false)

//   function tickboxHandler(e) {
//     console.log(e.target);
//     const { name, checked } = e.target;
//     if (name.slice(0, 9) === "category_") {
//       let tempobj = { ...issueCategories };
//       tempobj[name] = checked;
//       setIssueCategories(tempobj);
//     } else if (name.slice(0, 6) === "video_") {
//       let tempobj = { ...videoIssues };
//       tempobj[name] = checked;
//       setVideoIssues(tempobj);
//     } else if (name.slice(0, 6) === "audio_") {
//       let tempobj = { ...audioIssues };
//       tempobj[name] = checked;
//       setAudioIssues(tempobj);
//     }
//   }

//   async function handleSubmit(e) {
//     e.preventDefault()
//     setLoading(true)

//     const finalResults = {
//       affectedTitle,
//       issueCategories,
//       audioIssues,
//       videoIssues,
//       otherIssues
//     }
//     await fetch('/submitErrorReport', {
//       method: "POST",
//       body: JSON.stringify(finalResults)
//     })
//   }

//   const issueCategoriesArray = [
//     ["What kind of issue are you experiencing?"],
//     ["category_audio", "category_video", "category_format", "category_other"],
//     ["Audio", "Video / Quality", "Unsupported Format", "Other"],
//   ];
//   const audioIssuesArray = [
//     ["Audio"],
//     ["audio_language", "audio_noAudio", "audio_Quality"],
//     ["Different language", "No audio", "Poor audio quality"],
//   ];
//   const videoIssuesArray = [
//     ["Video"],
//     ["video_stutter", "video_noVideo", "video_Quality"],
//     [
//       "The video is choppy / stuttering",
//       "No picture / Blank screen",
//       "Poor quality",
//     ],
//   ];

//   function IssueCategoriesForm({ issueObj, tickboxHandler, title, catarray, catarrayStrings }) {
//     let mappedArr = catarray.map((category, index) => {
//       return (
//         <div className="issueform_span" key={category}>
//           <input
//             className="checkbox_left"
//             type="checkbox"
//             name={category}
//             checked={issueObj[category]}
//             onChange={tickboxHandler}
//           />
//           <p>{catarrayStrings[index]}</p>
//         </div>
//       );
//     });
//     return (
//       <div className="issue-form" id={title+"_issue_div"}>
//         <h4>{title}</h4>
//         {mappedArr}
//       </div>
//     );
//   }

  
//   return loading ? <CSSLoader /> : (
//     <div className="container flex-column">
//       <h2>Specify Faulty Files</h2>
//       <div class="issue-form" id="issue_series_div">
//         <h4>Title:</h4>
//         <input type="text" id="issue_series_specified" placeholder="Enter name here" value={affectedTitle['title']} onChange={e => {setAffectedTitle({...affectedTitle, title: e.target.value})}} />
//       </div>
//       <div class="issue-form" id="issue_episodes_div">
//           <h4>Affected Episodes:</h4>
//           <input name="issue_episodes" id="issue_episodes" placeholder="Series &amp; Episode(s)" type="text" value={affectedTitle['episodes']} onChange={e => {setAffectedTitle({...affectedTitle, episodes: e.target.value})}}/>
//       </div>

//       <IssueCategoriesForm
//         issueObj={issueCategories}
//         tickboxHandler={tickboxHandler}
//         title={issueCategoriesArray[0]}
//         catarray={issueCategoriesArray[1]}
//         catarrayStrings={issueCategoriesArray[2]}

//       />
//       {issueCategories["category_audio"] && (
//         <IssueCategoriesForm
//           issueObj={audioIssues}
//           tickboxHandler={tickboxHandler}
//           title={audioIssuesArray[0]}
//           catarray={audioIssuesArray[1]}
//           catarrayStrings={audioIssuesArray[2]}
//         />
//       )}
//       {issueCategories["category_video"] && (
//         <IssueCategoriesForm
//           issueObj={videoIssues}
//           tickboxHandler={tickboxHandler}
//           title={videoIssuesArray[0]}
//           catarray={videoIssuesArray[1]}
//           catarrayStrings={videoIssuesArray[2]}
//         />
//       )}
//       {issueCategories["category_other"] && (
//         <div id="other_issue_div" className="issue-form">
//           <div className="issue-form">
//             <h4>Other issues:</h4>
//             <textarea
//               className="impose_100percent_width"
//               id="other_issue_text"
//               value={otherIssues}
//               onChange={(e) => setOtherIssues(e.target.value)}
//               name="otherIssues"
//               placeholder="Please describe the issue."
//             />
//           </div>
//         </div>
//       )}

//       <div className="issue-form-nobackground">
//         <button id="reportsubmitbutton" className="" onClick={handleSubmit}>
//           Submit
//         </button>
//       </div>
//     </div>
//   );
// }

// export default ReportFaultyMediaForm;
