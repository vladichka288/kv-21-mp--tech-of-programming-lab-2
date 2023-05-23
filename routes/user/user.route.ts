const User = require("./../../models/user/user.model");
const Video = require("./../../models/video/video.model");
const View = require("./../../models/view/view.model");
require("./passport");

function checkAuth(req, res, next) {
  if (!req.user) {
    res.status(401);
    res.render("autho");
    return;
  }
  next();
}

function checkAdmin(req, res, next) {
  if (req.User.role !== "admin") {
    console.log("nbabax");
    res.status(403);
    res.render("err", { err: "only for admin" });
    return;
  }
  console.log("RTAX");
  next();
}
function setUserRoute(app) {
  app.get("/", (req, res) => {
    if (req.user) {
      console.log(req.user.avaUrl);
      if (req.user.role == "admin") {
        res.render("index", {
          bag: "true",
          userId: req.user.id,
          userName: req.user.fullname,
          avaUrl: req.user.avaUrl,
          menu: "Exit",
        });
        return;
      }
      console.log(req.user.avaUrl);
      res.render("index", {
        userName: req.user.fullname,
        avaUrl: req.user.avaUrl,
        menu: "Exit",
        userId: req.user.id,
      });
      return;
    }
    res.render("index", {
      userName: "not auth",
      menu: "Log in",
    });
    return;
  });
  app.get("/updAdmin", checkAdmin, (req, res) => {
    User
      .updateToAdminById(req.query.id)
      .then((result) => {
        res.redirect(`users/${req.query.id}`);
      })
      .catch((err) => {
        res.render("err", { err: "error upd user" });
      });
  });
  app.get("/updUser", checkAdmin, (req, res) => {
    User
      .downgradeToUserById(req.query.id)
      .then((result) => {
        res.redirect(`/users/${req.query.id}`);
      })
      .catch((err) => {
        console.error(err);
        res.render("err", { err: "error upd user" });
      });
  });

  app.get("/viewersVideos", checkAuth, function (req, res) {
    res.render("viewsUsers");
  });
  app.get("/userPage", checkAuth, function (req, res) {
    if (req.query.userId) {
      User.getById(req.query.userId).then((result) => {
        console.log("req.User.role = ", req.User.role);
        if (req.User.role != "user") {
          if (result.subscribedUsers.indexOf(req.User.id) == -1) {
            let data = new Date(result.registredAt).toLocaleString();
            console.log("data takaka");
            res.render("users/user", {
              photoUrl: result.avaUrl,
              name: result.fullname,
              date: data,
              role: result.role,
              videosCount: result.videos.length,
              playlistCount: result.playlists.length,
              userId: req.query.userId,
              subscribe: true,
              Admin: true,
            });
          } else {
            let data = new Date(result.registredAt).toLocaleString();
            console.log("pissss");
            res.render("users/user", {
              photoUrl: result.avaUrl,
              name: result.fullname,
              date: data,
              role: result.role,
              videosCount: result.videos.length,
              playlistCount: result.playlists.length,
              userId: req.query.userId,
              Admin: true,
            });
          }
        } else {
          if (result.subscribedUsers.indexOf(req.User.id) == -1) {
            let data = new Date(result.registredAt).toLocaleString();
            console.log("data takaka");
            res.render("users/user", {
              photoUrl: result.avaUrl,
              name: result.fullname,
              date: data,
              role: result.role,
              videosCount: result.videos.length,
              playlistCount: result.playlists.length,
              userId: req.query.userId,
              subscribe: true,
            });
          } else {
            let data = new Date(result.registredAt).toLocaleString();
            console.log("pissss");
            res.render("users/user", {
              photoUrl: result.avaUrl,
              name: result.fullname,
              date: data,
              role: result.role,
              videosCount: result.videos.length,
              playlistCount: result.playlists.length,
              userId: req.query.userId,
            });
          }
        }
      });
    } else {
      res.status(403);
      res.render("err", { err: "not valid data" });
    }
  });
  app.get("/users/:id", checkAuth, function (req, res) {
    User.getById(req.params.id)
      .then((user) => {
        if (user) {
          if (req.User.role == "admin") {
            console.log("KLAZ");
            res.render("users/user", {
              userId: req.User.id,
              Image: User.avaUrl,
              Login: User.login,
              Fullname: User.fullname,
              Date: User.registredAt,
              role: User.role,
              userId: req.params.id,
              bag: "true",
              userName: req.User.fullname,
              avaUrl: req.User.avaUrl,
              menu: "Exit",
            });
          } else {
            console.log("PULZ");
            res.render("users/user", {
              userId: req.User.id,
              Image: User.avaUrl,
              Login: User.login,
              Fullname: User.fullname,
              Date: User.registredAt,
              role: User.role,
              toAdmin: "true",
              userId: req.params.id,
              bag: "true",
              userName: req.User.fullname,
              avaUrl: req.User.avaUrl,
              menu: "Exit",
            });
          }
        } else {
          res.render("err", { err: "invalid user id!!!" });
        }
      })
      .catch((err) => {
        res.status(404);
        console.error(err);
        res.render("err", { err: "invalid user id!!!" });
      });
  });
  // //

  app.get("/subscribeOnUser", checkAuth, function (req, res) {
    if (req.query.userId) {
      let subsId = req.User.id;
      console.log("id = " + req.query.userId);
      if (req.User.chatId != "") {
        return User.addSubscribe(req.query.userId, subsId)
          .then((result) => {
            res.status(200);
            res.redirect(`/userPage?userId=${req.query.userId}`);
          })
          .catch((err) => {
            console.error(err);
            res.status(500);
            res.render("err", { err: err });
          });
      } else {
        console.log(req.User.fullname);
        res.status(200);
        res.redirect(`https://web.telegram.org/#/im?p=@Crow_vlad_bot`);
      }
    }
  });
  app.get("/UnsubscribeOnUser", checkAuth, function (req, res) {
    let subsId = req.User.id;
    if (req.User.chatId) {
      return User.unsubscribe(req.query.userId, subsId)
        .then((result) => {
          res.status(200);
          res.redirect(`/userPage?userId=${req.query.userId}`);
        })
        .catch((err) => {
          console.error(err);
          res.status(500);
          res.render("err", { err: err });
        });
    } else {
      res.redirect(300, `https://телеграм.онлайн/#/im?p=@Crow_vlad_bot`);
    }
  });

  app.get("/users", checkAuth, checkAdmin, function (req, res) {
    console.log("in |all users |");
    user
      .getAll()
      .then((Users) => {
        res.render("users", {
          Users,
          bag: "true",
          userId: req.User.id,
          userName: req.User.fullname,
          avaUrl: req.User.avaUrl,
          menu: "Exit",
        });
      })
      .catch((err) => {
        res.status(404);
        console.error(err);
        res.render("err");
      });
  });

  app.get("/tasks/:id", checkAuth, function (req, res) {
    Video.getById(req.params.id)
      .then((result) => {
        let views = [];
        for (let i = 0; i < result.views.length; i++) {
          views.push(View.getById(result.views[i]));
        }
        return Promise.all(views);
      })
      .then((views) => {
        console.log("views" + views);
        let checked = false;
        for (let i = 0; i < views.length; i++) {
          if (views[i].viewerId == req.User.id) {
            checked = true;
          }
        }
        if (checked == false) {
          const ViewToInsert = new View(new Date(), req.User.id);
          return ViewToInsert.createView(View);
        }
      })
      .then((result) => {
        console.log("result", result);
        if (result) {
          console.log(result);
          return Video.addView(req.params.id, result.id);
        }
      })
      .then((result) => {
        return Video.getById(req.params.id);
      })
      .then((Video) => {
        return Promise.all([Video, User.getById(Video.authorId)]);
      })
      .then(([result, authorVideo]) => {
        return Promise.all([Video.getAllViews(result.id), result, authorVideo]);
      })
      .then(([views, result, authorVideo]) => {
        console.log(views);
        if (req.user) {
          if (req.User.role == "admin") {
            res.render("tasks/task", {
              id: result.id,
              Video: result.videoUrl,
              Name: result.name,
              Description: result.description,
              Date: helpers.getCurrnetDate(result.registredAt, new Date()),
              bag: "true",
              userId: req.User.id,
              userName: req.User.fullname,
              avaUrl: req.User.avaUrl,
              menu: "Exit",
              display: "block",
              _id: req.params.id,
              authorName: authorVideo.fullname,
              photoUrl: authorVideo.avaUrl,
              authorId: authorVideo.id,
              views: views.length,
            });
            return;
          } else {
            if (req.User.videos.indexOf(req.params.id) !== -1) {
              console.log("parm");
              res.render("tasks/task", {
                id: result.id,
                Video: result.videoUrl,
                Name: result.name,
                Description: result.description,
                Date: helpers.getCurrnetDate(result.registredAt, new Date()),
                display: "block",
                userId: req.User.id,
                userName: req.User.fullname,
                avaUrl: req.User.avaUrl,
                menu: "Exit",
                _id: req.params.id,
                authorName: authorVideo.fullname,
                photoUrl: authorVideo.avaUrl,
                authorId: authorVideo.id,
                views: views.length,
              });
              return;
            } else {
              res.render("tasks/task", {
                id: result.id,
                Video: result.videoUrl,
                Name: result.name,
                Description: result.description,
                Date: helpers.getCurrnetDate(result.registredAt, new Date()),
                display: "none",
                userId: req.User.id,
                userName: req.User.fullname,
                avaUrl: req.User.avaUrl,
                menu: "Exit",
                _id: req.params.id,
                authorName: authorVideo.fullname,
                photoUrl: authorVideo.avaUrl,
                authorId: authorVideo.id,
                views: views.length,
              });
              return;
            }
          }
        } else {
          res.render("tasks/task", {
            id: result.id,
            Video: result.videoUrl,
            Name: result.name,
            Description: result.description,
            Date: helpers.getCurrnetDate(result.registredAt, new Date()),
            userName: "not auth",
            menu: "Log in",
            display: "none",
            authorName: authorVideo.fullname,
            photoUrl: authorVideo.avaUrl,
            authorId: authorVideo.id,
            views: views.length,
          });
        }
      })
      .catch((err) => {
        res.status(404);
        console.error(err);
        res.render("err", { err: "invalid id!!!" });
      });
  });
  app.post("/tasks/:id", checkAuth, function (req, res) {
    let videoId = req.params.id;
    if (req.User.role == "admin") {
      return Video.getById(req.params.id)
        .then((result) => {
          return User.deleteVideo(result.authorId, req.params.id);
        })
        .then(() => {
          return Video.deleteById(req.params.id);
        })
        .then(() => {
          return PlayList.getPlaylistsWithThisVideo(videoId);
        })
        .then((arrayOfPlaylists) => {
          let promises = [];
          for (playlist of arrayOfPlaylists) {
            promises.push(
              PlayList.deleteVideoFromPlayList(playlist.id, videoId)
            );
          }
          return Promise.all(promises);
        })
        .then(() => {
          return User.getById(req.User.id);
          res.redirect("/videosAll");
        })
        .catch((err) => {
          res.status(404);
          console.error(err);
          res.render("err");
        });
    } else {
      if (req.User.videos.indexOf(req.params.id) !== -1) {
        return Video.getById(req.params.id)
          .then(() => {
            return User.deleteVideo(req.User.id, req.params.id);
          })
          .then(() => {
            return Video.deleteById(req.params.id);
          })
          .then(() => {
            return PlayList.getPlaylistsWithThisVideo(videoId);
          })
          .then((arrayOfPlaylists) => {
            let promises = [];
            for (playlist of arrayOfPlaylists) {
              promises.push(
                PlayList.deleteVideoFromPlayList(playlist.id, videoId)
              );
            }
            return Promise.all(promises);
          })
          .then(() => {
            res.redirect("/videosAll");
          })
          .catch((err) => {
            res.status(404);
            console.error(err);
            res.render("err");
          });
      } else {
        res.render("err", { err: "пососеш ок!!!" });
      }
    }
  });
  app.get("/api/users", checkAuth, checkAdmin, function (req, res) {
    if (req.user) {
      if (req.User.role == "admin") {
        user
          .getAll()
          .then((result) => res.json(result))
          .catch((err) => {
            console.error(err);
            res.render("err");
          });
      }
      user
        .getAll()
        .then((result) => res.json(result))
        .catch((err) => {
          console.error(err);
          res.render("err");
        });
    }
  });
  app.get("/api/users/:id", checkAuth, checkAdmin, function (req, res) {
    user
      .getById(req.params.id)
      .then((result) => {
        res.json(result);
      })
      .catch((err) => {
        console.error(err);
        res.render("err", { err: "invalid id!!!" });
      });
  });
  app.post("/updateUserPhoto", checkAuth, function (req, res) {
    if (!req.files.photoFile) {
      console.log("err3");
      res.render("err", { err: "upload picture!!!" });
      return;
    }
    if (
      req.files.photoFile.mimetype != "image/jpeg" &&
      req.files.photoFile.mimetype != "image/jpg" &&
      req.files.photoFile.mimetype != "image/png"
    ) {
      res.render("err", { err: "photo must be png jpeg jpg formated!!!" });
      return;
    }
    if (req.files.photoFile.size > 5000000) {
      res.render("err", { err: "photo file size limit exceed" });
      return;
    }

    let promise = new Promise((resolve, reject) => {
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
        .end(req.files.photoFile.data);
    });
    promise
      .then((dataFiles) => {
        imageUrl = dataFiles.secure_url;
        console.log("\n\n\n\n" + imageUrl);
        return User.userUpdatePhoto(req.User._id, imageUrl);
      })
      .then((result) => {
        res.status(200);
        res.redirect("/");
      })
      .catch((err) => {
        console.error(err);
        res.render("err", { err: "insert error" });
      });
  });
}
