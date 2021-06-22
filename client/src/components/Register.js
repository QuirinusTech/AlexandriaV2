import {useForm} from "react-hook-form"

function Register() {
  const {register, handleSubmit, formState: {errors}} = useForm();

  const onSubmit = async data => {
    console.log(data)
    const response = await fetch('/register', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {"Content-type": "application/json; charset=UTF-8"}
    })
    console.log(response)
  }

  return (
    <div className="grid_main">
      <h2>Register</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="registration_form">

      <div className="registration_form_field_div">
        <label>Your name:</label>
        <br />
        <input
          id="firstname"
          type="text"
          name="firstname"
          {...register('firstname', {required: true})}
          required
        />
        {errors.firstname && (<span>{errors.firstname}</span>)}
      </div>

      <div className="registration_form_field_div">
        <label>Username:</label>
        <br />
        <input
          id="username"
          type="text"
          name="username"
          {...register('username', {required: true})}
          required
        />
        {errors.username && (<span>{errors.username}</span>)}
      </div>

      <div className="registration_form_field_div">
        <label>Email address:</label>
        <br />
        <input
          id="email"
          type="email"
          name="email"
          {...register('email', {required: true})}
          required
        />
        {errors.email && (<span>{errors.email}</span>)}
      </div>

      <div className="registration_form_field_div">
        <label>Password:</label>
        <br />
        <input
          id="password"
          type="password"
          name="password"
          {...register('password', {required: true})}
          required
        />
        {errors.password && (<span>{errors.password}</span>)}
      </div>
      <div className="registration_form_field_div">
        <input type="submit" />
      </div>
      </form>
    </div>
  )
}

export default Register