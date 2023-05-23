const PlayList = require("./../../models/PlayList/playlist.model");
function setPlaylistRoute(app) {
  app.get("/playlists", checkAuth, function (req, res) {
    PlayList.getAllPlayLists()
      .then((allPlayLists) => {
        let promises = [];
        for (let i = 0; i < allPlayLists.length; i++) {
          if (!allPlayLists[i].description) {
            allPlayLists[i].description = "there is no desc here";
          }

          let playListsVideos = [];
          let counter = 0;
          for (let j = 0; j < allPlayLists[i].videosId.length; j++) {
            promises.push(
              video.getById(allPlayLists[i].videosId[j]).then((oneOfVideo) => {
                if (oneOfVideo && counter < 3) {
                  counter++;
                  console.log("vak");
                  playListsVideos.push(oneOfVideo);
                }
              })
            );
          }
          allPlayLists[i].Videos = playListsVideos;
        }
        promises.push(Promise.resolve(allPlayLists));
        return Promise.all(promises);
      })
      .then((result) => {
        if (req.user) {
          if (req.user.role == "admin") {
            res.render("playlists", {
              allPlayLists: result[result.length - 1],
              bag: "true",
              userId: req.user.id,
              userName: req.user.fullname,
              avaUrl: req.user.avaUrl,
              menu: "Exit",
            });
          } else {
            res.render("playlists", {
              userId: req.user.id,
              allPlayLists: result[result.length - 1],
              userName: req.user.fullname,
              avaUrl: req.user.avaUrl,
              menu: "Exit",
            });
          }
        } else {
          res.render("playlists", {
            allPlayLists: result[result.length - 1],
            userName: "not auth",
            menu: "Log in",
          });
        }
      })
      .catch((err) => {
        res.status(404);
        console.error(err);
        res.render("err");
      });
  });

  app.get("/playlists", checkAuth, function (req, res) {
    PlayList.getAllPlayLists()
      .then((allPlayLists) => {
        let promises = [];
        for (let i = 0; i < allPlayLists.length; i++) {
          if (!allPlayLists[i].description) {
            allPlayLists[i].description = "there is no desc here";
          }

          let playListsVideos = [];
          let counter = 0;
          for (let j = 0; j < allPlayLists[i].videosId.length; j++) {
            promises.push(
              video.getById(allPlayLists[i].videosId[j]).then((oneOfVideo) => {
                if (oneOfVideo && counter < 3) {
                  counter++;
                  console.log("vak");
                  playListsVideos.push(oneOfVideo);
                }
              })
            );
          }
          allPlayLists[i].Videos = playListsVideos;
        }
        promises.push(Promise.resolve(allPlayLists));
        return Promise.all(promises);
      })
      .then((result) => {
        if (req.user) {
          if (req.user.role == "admin") {
            res.render("playlists", {
              allPlayLists: result[result.length - 1],
              bag: "true",
              userId: req.user.id,
              userName: req.user.fullname,
              avaUrl: req.user.avaUrl,
              menu: "Exit",
            });
          } else {
            res.render("playlists", {
              userId: req.user.id,
              allPlayLists: result[result.length - 1],
              userName: req.user.fullname,
              avaUrl: req.user.avaUrl,
              menu: "Exit",
            });
          }
        } else {
          res.render("playlists", {
            allPlayLists: result[result.length - 1],
            userName: "not auth",
            menu: "Log in",
          });
        }
      })
      .catch((err) => {
        res.status(404);
        console.error(err);
        res.render("err");
      });
  });

  app.get("/newPlayList", checkAuth, function (req, res) {
    console.log(req.user.login);

    res.render("newPlayList", {
      userId: req.user.id,
      userName: req.user.fullname,
      avaUrl: req.user.avaUrl,
      menu: "Exit",
    });
  });
  app.post("/insertPlayList", function (req, res) {
    if (req.body.name.length > 30) {
      res.render("err");
      return;
    }
    if (req.body.description.length > 200) {
      res.render("err");
      return;
    }
    let newPlayList = new PlayList(
      req.body.name,
      req.user.id,
      req.body.description
    );
    PlayList.createPlaylist(newPlayList)
      .then((result) => {
        return user.addPlaylist(result.id, req.user.id);
      })
      .then((result) => {
        res.redirect("/playlists");
      })
      .catch((err_2) => {
        res.render("err", { err: err_2 });
      });
  });
  app.get("/selectedPlayList", checkAuth, function (req, res) {
    if (req.query.playlistId)
      res.render("selectedPlayList", {
        userId: req.user.id,
        playlistId: req.query.playlistId,
        PlaylistId: req.query.playlistId,
        userName: req.user.fullname,
        avaUrl: req.user.avaUrl,
        menu: "Exit",
      });
    else {
      res.status(200);
      res.send("дай бог тебе по сасалам");
    }
  });
  app.post("/deleteVideoFromPlaylist", checkAuth, function (req, res) {
    let playlistId = req.body.playlistId;
    let videoId = req.body.videoId;
    PlayList.getById(playlistId)
      .then((result) => {
        if (result.authorId == req.user.id) {
          return PlayList.deleteVideoFromPlayList(result.id, videoId);
        } else {
          res.status(403);
          res.render("err", "dai bog tebe po sosalam");
        }
      })
      .then((result) => {
        res.status(200);
        res.redirect(`/selectedPlayList?page=1&playlistId=${playlistId}`);
      })
      .catch((err) => {
        console.log(err);
        if (err == "BYDY REZAT BLAAAA") {
          res.status(400);
          res.render("err", { err: "BYDY REZAT BLAAAA" });
        } else {
          res.status(404);
          console.error(err);
          res.render("err");
        }
      });
  });
  app.get("/addVideoToPlayList", checkAuth, function (req, res) {
    let videosId = req.query.videoId;
    user
      .getAllUserPlaylists(req.user)
      .then((result) => {
        if (result.length == 0) {
          res.redirect("/newPlayList");
        } else {
          let promises = [];
          for (let id of result) {
            promises.push(PlayList.getById(id));
          }
          return Promise.all(promises);
        }
      })
      .then((result) => {
        console.log(result);
        playlists = [];
        for (let playlist of result) {
          if (playlist.videosId.indexOf(videosId) == -1) {
            playlists.push(playlist.name);
          }
        }
        res.render("addVideoToPlayList", {
          userId: req.user.id,
          id: req.query.videoId,
          userName: req.user.fullname,
          avaUrl: req.user.avaUrl,
          menu: "Exit",
          playlists: playlists,
        });
      })
      .catch((err) => {
        console.error(err);
        res.status(500);
      });
  });
  app.post("/insertVideoToPlayList", checkAuth, function (req, res) {
    PlayList.addVideoToPlayList(req.user.id, req.body.name, req.body.videoId)
      .then(() => {
        console.log(req.body.name);
        console.log(req.body.videoId);
        res.redirect("/playlists");
      })
      .catch((err_2) => {
        res.status(404);
        console.error(err_2);
        res.render("err", { err: err_2 });
      });
  });
  app.get("/editPlayList", checkAuth, function (req, res) {
    PlayList.getPlayListById(req.query.id)
      .then((result) => {
        res.render("editPlayList", {
          userId: req.user.id,
          name: result.name,
          desc: result.description,
          id: req.query.id,
          userName: req.user.fullname,
          avaUrl: req.user.avaUrl,
          menu: "Exit",
        });
      })
      .catch((err_2) => {
        res.status(404);
        console.error(err_2);
        res.render("err", { err: "server error" });
      });
  });
  app.post("/editList", checkAuth, function (req, res) {
    console.log("\n\n" + req.body.listId + req.body.name + "\n\n");
    PlayList.updatePlayList(
      req.body.listId,
      req.body.name,
      req.body.description
    )
      .then((result) => {
        res.redirect(`/playlists`);
      })
      .catch((err_2) => {
        res.status(404);
        console.error(err_2);
        res.render("err", { err: "update ne ydalca" });
      });
  });
  app.post("/deletePlayList", checkAuth, function (req, res) {
    let playlistId = req.body.playlistId;
    PlayList.getById(playlistId)
      .then((result) => {
        if (result) {
          if (result.authorId == req.user.id) {
            return PlayList.deletePlayListById(playlistId);
          } else {
            return Promise.reject("not enough rights");
          }
        } else {
          return Promise.reject("playlist does not exist");
        }
      })
      .then((result) => {
        return user.deletePlayList(req.user.id, playlistId);
      })
      .then((result) => {
        res.status(200);
        res.redirect("/playlists");
      })
      .catch((err) => {
        if (err == "not enough rights") {
          res.status(403);
          res.render("err", { err: err });
        } else if (err == "playlist does not exist") {
          res.status(400);
          res.render("err", { err: err });
        } else {
          res.status(500);
          res.render("err", { err: "Ooops" });
        }
      });
  });
  app.get("/createPlayList", checkAuth, function (req, res) {
    res.render("newPlayList", {
      userId: req.user.id,
      userName: req.user.fullname,
      avaUrl: req.user.avaUrl,
      menu: "Exit",
    });
  });
}
module.exports = setPlaylistRoute;
