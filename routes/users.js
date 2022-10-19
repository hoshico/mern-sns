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
      return res.status(200).json("ユーザー情報が更新されました");
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

/*
  ユーザーのフォロー
  putメソッドを使用する(フォローする/外すなど常に情報を更新させる内容)
  ユーザーをフォローできる条件: 
  他のユーザーであること(自分自身はフォローできない)
*/
router.put("/:id/follow", async(req, res) => {
  if(req.body.userId !== req.params.id) {
    try {
      // ユーザーをフォローする処理
      // フォローする相手のid
      const user = await User.findById(req.params.id);
      // 自分自身のid
      const currentUser = await User.findById(req.body.userId);

      if(!user.followers.includes(req.body.userId)) {
        await user.updateOne({
          $push: {
            followers: req.body.userId,
          }
        });
        // 自分のフォロー数を増やす
        await currentUser.updateOne({
          $push: {
            followings: req.params.id,
          }
        })
        return res.status(200).json("フォローに成功しました");
      } else {
        return res.status(403).json("あなたはすでにこのユーザーをフォローしています");
      }
    } catch {
      return res.status(500).json(err);
    }
  } else {
    return res.status(500).json("自分自身をフォローできません");
  }
});

/*
  ユーザーのフォローを外す
*/
router.put("/:id/unfollow", async(req, res) => {
  if(req.body.userId !== req.params.id) {
    try {
      // フォローする相手のid
      const user = await User.findById(req.params.id);
      // 自分自身のid
      const currentUser = await User.findById(req.body.userId);
      // フォロワーに存在したら外すことができる
      if(user.followers.includes(req.body.userId)) {
        await user.updateOne({
          $pull: {
            followers: req.body.userId,
          }
        });
        // 自分のフォロー数を増やす
        await currentUser.updateOne({
          $pull: {
            followings: req.params.id,
          }
        })
        return res.status(200).json("フォローを解除しました");
      } else {
        return res.status(403).json("このユーザーはフォロー解除できません");
      }
    } catch {
      return res.status(500).json(err);
    }
  } else {
    return res.status(500).json("自分自身をフォロー解除できません");
  }
});


// exportする必要がある
module.exports = router;