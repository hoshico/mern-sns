const router = require("express").Router();

router.get('/', (req, res) => {
  res.send("post router");
});

// exportする必要がある
module.exports = router;