const router = require("express").Router();
const User = require("../models/User");
/*
  ユーザー登録
  登録なのでpostを使用
  status500はサーバー関連のエラー
*/
router.post("/register", async (req, res) => {
  try {
    const newUser = await new User({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });

    const user = await newUser.save();
    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json(err);
  }
});

/*
  ログイン
*/
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if(!user) return res.status(404).send("ユーザーが見つかりません");
    /*
      入力されたパスとuser(emailからの検索)のパスが一致すれば 
      valledPasswordにはtrueが入る
    */
    const vailedPassword = req.body.password === user.password;
    if(!vailedPassword) return res.status(400).json("パスワードが違います");

    // ifに引っ掛からなかった場合は200番を返す
    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// exportする必要がある
module.exports = router;