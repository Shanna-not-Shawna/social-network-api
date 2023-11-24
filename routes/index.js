const router = require('express').Router();
const apiRoutes = require('./api');

router.use('/api', apiRoutes);

// Catch-all route
router.use((req, res) => {
  console.log(`Received request: ${req.method} ${req.url}`);
  return res.send('Wrong route! (catch-all)');
});

module.exports = router;