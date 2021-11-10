const About = () => {

  return <>
  <div className="about_div">
    <div id="about" className="about_row">
      <h2>About Alexandria</h2>
      <h3 id="libraryinfoh3">The actual library</h3>
      <p>
          The Great Library of Alexandria in Alexandria, Egypt, was one of the largest and most significant libraries of the ancient world.
      </p>
      <p>You can find out more about it here: 
      </p>
      <p>
      <a target="_blank" rel="noreferrer" className="purplelink" href="https://en.wikipedia.org/wiki/Library_of_Alexandria">
              The Library of Alexandria (Wikipedia)
          </a>
      </p>
          
      <br />
      <h3>This site</h3>
      <p>In 2020, an aspiring crepologist by the name of Matthew Gird decided to get his shit together and get a real job.</p>
      <p>In his search for meaning to learn something pursuing a meaning in life, he started learning web development.</p>
      <p>As a small-scale starter project, he sought to create Alexandria: a media center where users could request media.</p>
      <p>This site was the creator's first foray into the realm of back-end development in Python using the Flask framework.</p>
      <br />
      <p>Later he would find out that it was both more fun and significantly more painful to do this in React instead, so, in early April 2021 he started to do just that and rewrote the server in NodeJS.</p>
      <p>It would be months before Alexandria V2 would finally launch later that year in October.</p>
      <br />
      <p>Alexandria V2 has been an ongoing cycle of iteration, improvement, fiddling, review, critique and refactoring: It represents the culmination of years of learning, countless hours of work and over 50'000 lines of code.</p>
      <br />
      
      <br />
      <blockquote><b style={{color:"var(--accentBlueDeep)"}}>Let this site be testament to the inevitable triumph of determination and hard work over chaos.</b></blockquote>
      
      <br />
    </div>

    <div className="about_row">
      <h3>Aknowlegments</h3>
      <p>Styling, moral support and occasional ass-kicking by Allison Gird.</p>
      <blockquote>I owe most of this to Allison and her belief that I could be more than I am.</blockquote>
      <p>Feedback, testing, swatches (except the orange ones) and Couch-Potatoing by Tje Anne.</p>
      <blockquote>
          "Proof of that Couch-Potatoing can be beneficial." -Tje
      </blockquote>
      <p>Code review, mentoring and cheerleading by Shaun Matthysen.</p>
      <p>I would also like to extends my thanks to:</p>
      <ul>
          <li><a target="_blank" rel="noreferrer" className="purplelink" href="https://www.freeiconspng.com">FreeIconsPng</a> for a number of PNG images used on this site.</li>
          <li><a target="_blank" rel="noreferrer" className="purplelink" href="https://www.w3schools.com/default.asp">w3schools.com</a> on which I've come to rely heavily in addition to the official JS docs.</li>
          <li><a target="_blank" rel="noreferrer" className="purplelink" href="https://www.edx.org/course/cs50s-introduction-to-computer-science">David J. Malan and CS50</a> I can never thank the people at Edx enough for the leg-up they gave me.</li>
          <li><a target="_blank" rel="noreferrer" className="purplelink" href="https://www.youtube.com/c/TraversyMedia/about">Traversy Media</a> for getting us started years ago.</li>
          <li><a target="_blank" rel="noreferrer" className="purplelink" href="https://firebase.google.com/">Firebase</a> and <a className="purplelink" href="https://www.heroku.com/">Heroku</a> for providing free Database and Server Hosting.</li>
          <li>The <a target="_blank" rel="noreferrer" className="purplelink" href="http://www.omdbapi.com/">OMDB API</a> for providing free access to their easy-to-use API.</li>
      </ul>
      <br />
      <p>If you have not been credited for something on this site, please get in touch with me here: <a className="purplelink" href="mailto:quirinustech@gmail.com">quirinustech@gmail.com</a></p>
      <p>All IMDB information and images are provided by the <a target="_blank" rel="noreferrer" className="purplelink" href="omdbapi.com">OMDB API</a></p>
      <p>This site is neither endorsed nor certified by IMDB.com and/or its affiliates.</p>
      <br />
      <blockquote><img alt='quirinusLogo' className="quirinuslogo" src="/img/QuirinusTech.png" />Quirinus Technologies {`©`} 2021</blockquote>
    </div>
  </div>
</>
}

export default About