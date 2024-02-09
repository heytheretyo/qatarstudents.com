import app from "./app";

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`starting server at: http://localhost:${port}`);
});
