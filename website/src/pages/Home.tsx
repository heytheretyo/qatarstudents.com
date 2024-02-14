function Home() {
  return (
    <>
      <div className="pt-8 px-7">
        <div className="mb-6">
          <h1 className="mb-5 text-4xl font-medium">
            Let's share, discuss and connect
          </h1>
          <p>
            We connect students around Qatar, this is one of the first
            student-led community platform made by a group of students.
          </p>
        </div>

        <div className="inline-block">
          <input
            type="text"
            placeholder="Enter address"
            className="px-4 py-2 mr-2"
          />
          <button className="px-4 py-2 bg-green-500">Sign up</button>
        </div>
      </div>
    </>
  );
}

export default Home;
