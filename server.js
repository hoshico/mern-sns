const express = require("express");
const app = express();
// routes/user.jsのモジュールを読み込む
const userRoute = require('./routes/users');
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');
const PORT = 3000
const mongoose = require("mongoose");
require("dotenv").config();

/*
  データベース接続
*/
mongoose
  .connect(process.env.MONGOURL)
  .then(() => {
    console.log("DBと接続中・・・ ");
  }).catch((err) => {
    console.log(err);
  });

/*
  ミドルウェア
  server.jsと切り分けるためにしよう
  "/api/users"でusers.jsが読み込まれる
*/
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);


app.listen(PORT, () => console.log("サーバーが起動しました"));