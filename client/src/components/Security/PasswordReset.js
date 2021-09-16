// PASSWORD RESET
// enter username
// enter code from email
// enter new password
// repeat password
// update password in db
// redirect to login page

import { Formik, Field, Form, ErrorMessage } from "formik";
import { useHistory, Link } from "react-router-dom";
import { useState } from "react";
import AlexOGLoader from "../Loaders/AlexOGLoader";

const PasswordReset = props => {
  let history = useHistory()
  const { uname, code } = props.match.params;
  const [loading, setLoading] = useState(false)

  return loading ? (<AlexOGLoader />) :(
    <div className="passwordResetContent">
      <h2>Password Reset</h2>

      <Formik
        initialValues={{
          username: uname,
          validationCode: code,
          passwordNewFirst: "",
          passwordNewSecond: ""
        }}
        validate={values => {
          const errors = {};
          if (
            values.passwordNewSecond !== "" &&
            values.passwordNewFirst !== values.passwordNewSecond
          ) {
            errors.passwordNewFirst = "Passwords don't match.";
          }
          if (values.passwordNewFirst.length < 8) {
            errors.passwordNewFirst = "Password is too short";
          }
          return errors;
        }}
        onSubmit={async values => {
          setLoading(true)
          await fetch("/passwordReset", {
            method: "POST",
            body: JSON.stringify(values),
            headers: {"Content-type": "application/json; charset=UTF-8"}
          }).then(res => res.json()).then(data => {
            if (data['success'] === true) {
              localStorage.setItem('passwordReset', 'Your password has been reset. Click OK to proceed to the login page.');
              history.push('/login')
            } else {
              setLoading(false)
              alert(data['response'])
            }
          });
          // alert(JSON.stringify(values, null, 2));
        }}
      >
        <Form className="passwordResetForm">
          <label htmlFor="username">Username</label>
          <Field
            type="text"
            id="username"
            name="username"
            placeholder="Username"
          />

          <label htmlFor="validationCode">Validation Code</label>
          <Field
            type="text"
            id="validationCode"
            name="validationCode"
            placeholder="Validation Code"
          />
          {props.match.params.code === undefined && (
            <div className="securityPagePopup">
              <span>Don't have a code?
                You can request one{" "}
                <Link
                  to="/forgottenPassword"
                  className="forgottenPasswordLink purplelink"
                >
                  here
                </Link>
                .
              </span>
            </div>
          )}
          <label htmlFor="passwordNewFirst">New Password:</label>
          <Field
            type="password"
            id="passwordNewFirst"
            name="passwordNewFirst"
            placeholder="new password"
          />

          <ErrorMessage name="passwordNewFirst" component="div" />
          <label htmlFor="passwordNewSecond">Retype New Password:</label>
          <Field
            type="password"
            id="passwordNewSecond"
            name="passwordNewSecond"
            placeholder="Retype New Password"
          />

          <button type="submit">Submit</button>
        </Form>
      </Formik>
    </div>
  );
};

export default PasswordReset;
