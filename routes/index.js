const router = require('express').Router();
const apiRoutes = require('./api');

router.use('/api', apiRoutes);


router.use((req, res) => {
  res.status(404).send('<h1> 404 Error! Hint, check routes folder in root directory</h1>');
  console.log(res);
});

module.exports = router;

