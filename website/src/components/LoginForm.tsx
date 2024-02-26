import { useFormik } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";

const LoginForm = () => {
  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },

    validationSchema: Yup.object({
      username: Yup.string().required("fill the username"),
      password: Yup.string().required("fill the password"),
    }),

    onSubmit: async (values, { setFieldError }) => {
      const response = await fetch(`http://localhost:5000/api/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          username: values.username,
          password: values.password,
        }),
      });

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
        className="py-2 mb-4 font-bold text-white bg-orange-400 rounded-full px-7"
      >
        login
      </button>

      <p>
        don't have an account?{" "}
        <Link className="text-blue-600" to="/register">
          register
        </Link>
      </p>
    </form>
  );
};

export default LoginForm;
