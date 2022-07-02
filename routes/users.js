const router = require("express").Router();
const User = require("../models/User");

/*
  CRUD
  ユーザー情報の更新
*/
router.put("/:id", async(req, res) => {
  if(req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      res.status(200).json("ユーザー情報が更新されました");
    } catch(err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("あなたは自分のアカウントの時だけ更新できます");
  }
});

/*
  CRUD
  ユーザー情報の削除
*/
router.delete("/:id", async(req, res) => {
  if(req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      res.status(200).json("ユーザー情報が削除されました");
    } catch(err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("あなたは自分のアカウントの時だけ削除できます");
  }
});

/*
  CRUD
  ユーザー情報の取得
  取得の際はパスワードを見えないようにしたい
  update_atは必要ない情報

  user情報の全てを分割代入する
  passwordとupdateAt以外のotherのみ取得
*/
router.get("/:id", async(req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, updatedAt, ...other } = user._doc;
    res.status(200).json(other);
  } catch(err) {
    return res.status(500).json(err);
  }
});


// exportする必要がある
module.exports = router;