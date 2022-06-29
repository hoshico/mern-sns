const router = require("express").Router();

router.get('/', (req, res) => {
  res.send("auth router");
});

// exportする必要がある
module.exports = router;