const video = require("./../../models/video/video.model");
const telegramBot = require("./routes/telegramBot/telegram.js");
function setVideoRoute(app) {
  app.post("/insert", checkAuth, function (req, res) {
    let new_video = new video();
    new_video.name = req.body.name;
    if (req.body.name.length > 30) {
      console.log("err");
      res.render("err", { err: "ne xutryite" });
      return;
    }
    new_video.authorId = req.user.id;
    new_video.description = req.body.description;
    if (req.body.description.length > 300) {
      console.log("err2");
      res.render("err", { err: "ne xutryite" });
      return;
    }
    if (!req.files.imageFile) {
      console.log("err3");
      res.render("err", { err: "upload picture!!!" });
      return;
    }
    if (!req.files.videoFile) {
      console.log("err4");
      res.render("err", { err: "upload video!!!" });
      return;
    }
    if (req.files.videoFile.mimetype != "video/mp4") {
      res.render("err", { err: "video must be mp4 formated!!!" });
      return;
    }
    if (
      req.files.imageFile.mimetype != "image/jpeg" &&
      req.files.imageFile.mimetype != "image/jpg" &&
      req.files.imageFile.mimetype != "image/png"
    ) {
      res.render("err", { err: "photo must be png jpeg jpg formated!!!" });
      return;
    }
    if (req.files.videoFile.size > 30000000) {
      res.render("err", { err: "video file size limit exceed" });
      return;
    }
    if (req.files.imageFile.size > 5000000) {
      res.render("err", { err: "photo file size limit exceed" });
      return;
    }
    if (!req.body.name) {
      console.log("err");
      res.render("err", { err: "name is required field" });
      return;
    }
    new_video.registredAt = new Date(); //
    console.log(new_video.imageUrl);

    let promise1 = new Promise((resolve, reject) => {
      cloudinary.v2.uploader
        .upload_stream(
          {
            resource_type: "video",
          },
          function (error, result) {
            console.log(result, error);
            if (error) reject(error);
            else resolve(result);
          }
        )
        .end(req.files.videoFile.data);
    });
    let promise2 = new Promise((resolve, reject) => {
      cloudinary.v2.uploader
        .upload_stream(
          {
            resource_type: "image",
          },
          function (error, result) {
            console.log(result, error);
            if (error) reject(error);
            else resolve(result);
          }
        )
        .end(req.files.imageFile.data);
    });
    Promise.all([promise1, promise2])
      .then((dataFiles) => {
        new_video.videoUrl = dataFiles[0].secure_url;
        console.log("\n\n\n\n" + new_video.videoUrl);
        new_video.imageUrl = dataFiles[1].secure_url;
        console.log("\n\n\n\n" + new_video.imageUrl);
        return video.insert(new_video);
      })
      .then((result) => {
        console.log("we here");
        return user.addVideo(result._id, req.user._id);
      })
      .then((videoId) => {
        return Promise.all([user.getById(req.user.id), videoId]);
      })
      .then(([res, videoId]) => {
        let promises = [];
        for (let i = 0; i < res.subscribedUsers.length; i++) {
          promises.push(user.getById(res.subscribedUsers[i]));
        }
        return Promise.all([Promise.all(promises), videoId]);
      })
      .then(([subscribedUsers, videoId]) => {
        let promises = [];
        for (let i = 0; i < subscribedUsers.length; i++) {
          promises.push(
            telegramBot.sendMessage({
              chat_id: subscribedUsers[i].chatId,
              text: `${req.user.fullname} uploaded new video https://vladich-bub.herokuapp.com/tasks/${videoId}`,
              link: `/`,
            })
          );
        }
        return Promise.all(promises);
      })
      .then((result) => {
        res.status(200);
        if (req.user.role == "admin") {
          res.render("myVideos", {
            userName: req.user.fullname,
            avaUrl: req.user.avaUrl,
            bag: "true",
            menu: "Exit",
            userId: req.user.id,
          });
        } else {
          res.render("myVideos", {
            userId: req.user.id,
            userName: req.user.fullname,
            avaUrl: req.user.avaUrl,
            menu: "Exit",
          });
        }
      })
      .catch((err) => {
        console.error(err);
        res.render("err", { err: "insert error" });
      });
  });
  app.get("/new", checkAuth, function (req, res) {
    console.log("new");
    res.render("new", {
      userId: req.user.id,
      userName: req.user.fullname,
      avaUrl: req.user.avaUrl,
      menu: "Exit",
    });
  });
  // // CREATE NEW VIDEO
  app.get("/about", function (req, res) {
    if (req.user) {
      console.log(req.user.avaUrl);
      if (req.user.role == "admin") {
        res.render("about", {
          bag: "true",
          userId: req.user.id,
          userName: req.user.fullname,
          avaUrl: req.user.avaUrl,
          menu: "Exit",
        });
        return;
      }
      console.log(req.user.avaUrl);
      res.render("about", {
        userName: req.user.fullname,
        avaUrl: req.user.avaUrl,
        menu: "Exit",
        userId: req.user.id,
      });
      return;
    }
    res.render("about", {
      userName: "not auth",
      menu: "Log in",
    });
    return;
  });

  app.get("/videosAll", function (req, res) {
    if (req.query.userId) {
      if (!req.user) {
        res.render("tasks", {
          menu: "Log in",
          userName: "not auth",
          userId: req.query.userId,
          userFilter: req.query.userId,
        });
      } else {
        if (req.user.role == "admin") {
          res.render("tasks", {
            userId: req.user.id,
            bag: "true",
            userName: req.user.fullname,
            avaUrl: req.user.avaUrl,
            menu: "Exit",
            userFilter: req.query.userId,
          });
        } else {
          res.render("tasks", {
            userId: req.user.id,
            userName: req.user.fullname,
            avaUrl: req.user.avaUrl,
            menu: "Exit",
            userFilter: req.query.userId,
          });
        }
      }
    } else {
      if (!req.user) {
        res.render("tasks", {
          menu: "Log in",
          userName: "not auth",
        });
      } else {
        if (req.user.role == "admin") {
          res.render("tasks", {
            userId: req.user.id,
            bag: "true",
            userName: req.user.fullname,
            avaUrl: req.user.avaUrl,
            menu: "Exit",
          });
        } else {
          res.render("tasks", {
            userId: req.user.id,
            userName: req.user.fullname,
            avaUrl: req.user.avaUrl,
            menu: "Exit",
          });
        }
      }
    }
  });

  app.get("/myVideos", checkAuth, function (req, res) {
    res.status(200);
    res.render("myVideos", {
      userId: req.user.id,
      userName: req.user.fullname,
      avaUrl: req.user.avaUrl,
      menu: "Exit",
    });
  });
}
module.exports = setVideoRoute;
