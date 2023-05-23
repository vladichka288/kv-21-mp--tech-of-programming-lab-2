const app = require("./server");
const setAllRoutes = require("./routes/index");
const connectDB = require("./db");
connectDB();

//

let authRouter = require("./auth");
let apiRouter = require("./routes/api");
let developerRouter = require("./routes/developer");
app.use("/auth", authRouter);
app.use("/api/v1", apiRouter);
app.use("/developer/v1", developerRouter);
setAllRoutes(app);
set;
app.get("*", (req, res) => {
  res.render("err", { err: "page not found" });
});
