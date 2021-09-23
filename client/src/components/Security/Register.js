import { Formik, Field, Form, ErrorMessage } from "formik";
import { Link } from "react-router-dom";
import { useState } from "react";

function checkIfValidEmail(email) {
  return /^[\w\.]+@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
}

function Register() {
  const [isSuccess, setIsSuccess] = useState(null);
  const [responseMessage, setResponseMessage] = useState(null);

  return (
    <div className="grid_main">
      <h2>Register</h2>
      {isSuccess === null && (
        <>
          <div className="securityPagePopup">
            <span>
              Already have an account?</span><span>
              Log in{" "}
              <Link to="/login" className="purplelink">
                here
              </Link>
              .
            </span>
          </div>
          <Formik
            initialValues={{
              username: "",
              firstname: "",
              email: "",
              password: "",
              confirmpassword: ''
            }}
            validate={values => {
              const errors = {};
              if (values['username'].length < 6) {
                errors['username'] = "Username must be at least six characters";
              }
              if (values['firstname'].length < 3) {
                errors['firstname'] = "Your name must be at least three characters in length";
              }
              if (!checkIfValidEmail(values['email'])) {
                errors['email'] = "Invalid e-mail address.";
              }
              if (values['password'] !== values['confirmpassword']) {
                errors['confirmpassword'] = "Passwords don't match."
              }
              if (values['password'].length < 8) {
                errors['password'] = "Password must be at least 8 characters."
              }
              return errors;
            }}
            onSubmit={async values => {
              await fetch("/register", {
                method: "POST",
                body: JSON.stringify(values),
                headers: { "Content-type": "application/json; charset=UTF-8" }
              })
                .then(res => res.json())
                .then(data => {
                  setIsSuccess(data["success"]);
                  setResponseMessage(data["response"]);
                });
            }}
          >
            <Form
              className="registration_form"
            >

                <label htmlFor="firstname">Your name:</label>
                <br />
                <Field
                  type="text"
                  id="firstname"
                  name="firstname"
                  placeholder="Your name"
                />
                <ErrorMessage name="firstname" component="div" />
                <label htmlFor="username">Username</label>
                <Field
                  type="text"
                  id="username"
                  name="username"
                  placeholder="Username"
                />
                <ErrorMessage name="username" component="div" />
                <label htmlFor="email">Email address:</label>
                <br />
                <Field
                  type="email"
                  id="email"
                  name="email"
                  placeholder="E-Mail Address"
                />
                <ErrorMessage name="email" component="div" />
                <label htmlFor="password">Password:</label>
                <Field
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Password"
                />
                <ErrorMessage name="password" component="div" />
                <Field
                  type="password"
                  id="confirmpassword"
                  name="confirmpassword"
                  placeholder="Confirm Password"
                />
                <ErrorMessage name="confirmpassword" component="div" />

                <button type="submit">Submit</button>
            </Form>
          </Formik>
        </>
      )}
      {isSuccess && (
        <div className="registerResponseMessage">
          <p>Registration successful.</p>
          <p>
            Your account will need to be activated by the administrator before
            you can access it.
          </p>
          <p>
            Please wait for an e-mail confirming account activation before
            attempting to log in.
          </p>
          <p>The Administrator has already been notified.</p>
        </div>
      )}
      {!isSuccess && <div className="registerResponseMessage">{responseMessage}</div>}
    </div>
  );
}

export default Register;
