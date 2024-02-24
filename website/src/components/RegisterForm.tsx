import { useFormik } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";

const RegisterForm = () => {
  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
      email: "",
    },

    validationSchema: Yup.object({
      username: Yup.string()
        .max(15, "must be 15  characters or less")
        .required("fill the username"),
      email: Yup.string().email("email is invalid").required("fill the email"),
      password: Yup.string()
        .required("fill the password")
        .min(8, "must be at least 8 characters or more"),
    }),

    onSubmit: async (values, { setFieldError }) => {
      const response = await fetch(
        `http://localhost:5000/api/v1/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            username: values.username,
            email: values.email,
            password: values.password,
          }),
        }
      );

      const res = await response.json();

      if (res.message) {
        setFieldError("password", res.message);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="mb-2">
        <label htmlFor="username">username</label>

        <input
          id="username"
          name="username"
          type="text"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.username}
          placeholder="oryxking360"
          className="block w-full px-4 py-3 leading-tight text-gray-700 border rounded appearance-none border- focus:outline-none focus:bg-white"
        />

        {formik.touched.username && formik.errors.username ? (
          <div className="mt-1 text-red-500">{formik.errors.username}</div>
        ) : null}
      </div>

      <div className="mb-2">
        <label htmlFor="email">email</label>

        <input
          id="email"
          name="email"
          type="text"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.email}
          placeholder="oryxking@gmail.com"
          className="block w-full px-4 py-3 leading-tight text-gray-700 border rounded appearance-none border- focus:outline-none focus:bg-white"
        />

        {formik.touched.email && formik.errors.email ? (
          <div className="mt-1 text-red-500">{formik.errors.email}</div>
        ) : null}
      </div>

      <div className="mb-4">
        <label htmlFor="password">password</label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="●●●●●●●●●●●"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.password}
          className="block w-full px-4 py-3 leading-tight text-gray-700 border rounded appearance-none border- focus:outline-none focus:bg-white"
        />

        {formik.touched.password && formik.errors.password ? (
          <p className="mt-1 text-red-500">{formik.errors.password}</p>
        ) : null}
      </div>

      <button
        type="submit"
        className="px-8 py-2 mb-3 font-bold text-white bg-blue-500 border-b-4 border-blue-700 rounded-full hover:bg-blue-700"
      >
        register
      </button>

      <p>
        have an account?{" "}
        <Link className="text-blue-600" to="/login">
          register
        </Link>
      </p>
    </form>
  );
};

export default RegisterForm;
