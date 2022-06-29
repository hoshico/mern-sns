const express = require("express");
const app = express();
// routes/user.jsのモジュールを読み込む
const userRoute = require('./routes/users');
const PORT = 3000

// "/"がエンドポイント
// reqでgetやpostなど
// resでサーバー側からのレスポンス
//app.get("/", (req, res) => {
//  res.send("hello express");
//})

/*
  ミドルウェア
  server.jsと切り分けるためにしよう
  "/api/users"でusers.jsが読み込まれる
*/
app.use("/api/users", userRoute);


app.listen(PORT, () => console.log("サーバーが起動しました"));