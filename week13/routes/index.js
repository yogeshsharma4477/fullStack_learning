const { Router } = require('express')
const router = Router();
const UserRouters = require('./userRoute.js')

router.use('/api/user', UserRouters)

module.exports = router;