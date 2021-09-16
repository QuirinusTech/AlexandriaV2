import { useState } from "react";
import AlexOGLoader from "../Loaders/AlexOGLoader";
import { Link } from "react-router-dom";

function ForgottenPassword() {
  const [identifierType, setIdeentifierType] = useState("Username");
  const [identifierValue, setIdentifierValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  function reset() {
    setIdeentifierType("Username");
    setIdentifierValue("");
    setLoading(false);
    setSuccess(null);
  }

  async function submitPasswordReset() {
    setLoading(true);
    await fetch("/forgottenPassword", {
      method: "POST",
      body: JSON.stringify({
        identifierType: identifierType.toLowerCase(),
        identifierValue
      }),
      headers: {"Content-type": "application/json; charset=UTF-8"}
    }).then(res => {
      res.json();
      if (res["success"] === true) {
        setSuccess(true);
      } else {
        alert(res['response'])
        setSuccess(false);
      }
      setLoading(false);
    });
  }

  return (
    <div className="forgottenPasswordContent">
      {loading && <AlexOGLoader />}
      {success === true && (
        <div className="successMessage">
          <p>
            If you have an account with us, an e-mail with further instructions
            has been sent to your e-mail.
          </p>
          <br />
          <p>You can close this page now.</p>
        </div>
      )}
      {success === false && (
        <div className="successMessage">
          <p>We were unable to process your request.</p>
          <br />
          <p>
            Please contact <b>quirinustech@gmail.com</b> directly for further
            assistance.
          </p>
          <button onClick={reset}>OK</button>
        </div>
      )}
      {success === null && (
        <div className="forgottenPasswordForm">
          <h2>Forgotten Password</h2>
            <div className="securityPagePopup">
              <span>Already have a code?</span><span>
                Click {" "}
                <Link
                  to="/passwordReset/"
                  className="forgottenPasswordLink purplelink"
                >
                  here
                </Link>
                .
              </span>
            </div>
          <label>{identifierType}</label>
          <input
            type="text"
            placeholder={identifierType}
            value={identifierValue}
            onChange={e => setIdentifierValue(e.target.value)}
          />
          {identifierType === "Username" && (
            <button onClick={() => setIdeentifierType("Email")}>
              Forgot Username
            </button>
          )}
          {identifierType === "Email" && (
            <button onClick={() => setIdeentifierType("Username")}>
              Forgot Email
            </button>
          )}
          <button onClick={submitPasswordReset}>Request Password Reset</button>
        </div>
      )}
    </div>
  );
}

export default ForgottenPassword;
