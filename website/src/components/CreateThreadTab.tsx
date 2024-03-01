import { useFormik } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";

const CreateThreadTab = () => {
  const formik = useFormik({
    initialValues: {
      title: "",
      content: "",
      tags: [],
    },

    validationSchema: Yup.object({
      title: Yup.string().required("title cant be empty"),
      content: Yup.string().required("content has to be filled"),
      tags: Yup.array().of(Yup.string()).max(3, "cant have more than 3 tags"),
    }),

    onSubmit: async (values, { setFieldError }) => {
      const response = await fetch(`http://localhost:5000/api/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title: values.title,
          content: values.content,
        }),
      });

      const res = await response.json();

      if (res.message) {
        setFieldError("content", res.message);
      }
    },
  });

  const handleKeyPress = (e: any) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  const handleTagsKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const tagVal = (e.target as HTMLInputElement).value as any;

      formik.setFieldValue("tags", [...formik.values.tags, tagVal]);

      // assign
      (e.target as HTMLInputElement).value = "";
    }
  };

  const handleRemoveTag = (indexToRemove: number) => {
    const updatedTags = formik.values.tags.filter(
      (_, index) => index !== indexToRemove
    );
    formik.setFieldValue("tags", updatedTags);
  };

  return (
    <form onSubmit={formik.handleSubmit} onKeyPress={handleKeyPress}>
      <div className="mb-2">
        <label htmlFor="title">title</label>

        <input
          id="title"
          name="title"
          type="text"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.title}
          placeholder="the new black flock arrives"
          className="block w-full px-4 py-3 leading-tight text-gray-700 border rounded appearance-none border- focus:outline-none focus:bg-white"
        />

        {formik.submitCount > 0 && formik.errors.title ? (
          <div className="mt-1 text-red-500">{formik.errors.title}</div>
        ) : null}
      </div>

      <div className="mb-4">
        <label htmlFor="content">content</label>
        <input
          id="content"
          name="content"
          type="content"
          placeholder="a quick brown fox carries a big black flock"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.content}
          className="block w-full px-4 py-3 leading-tight text-gray-700 border rounded appearance-none border- focus:outline-none focus:bg-white"
        />

        {formik.submitCount > 0 && formik.errors.content ? (
          <p className="mt-1 text-red-500">{formik.errors.content}</p>
        ) : null}
      </div>

      <div className="mb-4">
        <label htmlFor="tags">tags</label>

        {/* <h1 className="my-1">
          {formik.values.tags.map((v, index) =>
            index === formik.values.tags.length - 1 ? `${v}` : `${v}, `
          )}
        </h1> */}

        <div className="my-1">
          {formik.values.tags.map((tag, index) => (
            <span
              key={index}
              className="cursor-pointer"
              onClick={() => handleRemoveTag(index)}
            >
              {tag}
              {index !== formik.values.tags.length - 1 && <span>, </span>}
            </span>
          ))}
        </div>

        <input
          id="tags"
          name="tags"
          placeholder="volunteering, studies, school"
          onKeyDown={handleTagsKeyDown}
          className="block w-full px-4 py-3 leading-tight text-gray-700 border rounded appearance-none border- focus:outline-none focus:bg-white"
        />
      </div>

      <button
        type="submit"
        className="py-2 mb-4 font-bold text-white bg-orange-400 rounded-full px-7"
      >
        create post
      </button>
    </form>
  );
};

export default CreateThreadTab;
