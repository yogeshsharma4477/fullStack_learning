const {Router} = require('express')
const { createUser, updateUser } = require('../controller/userController.js')

const router = Router()

router.post('/', createUser)

router.put('/:id', updateUser)

module.exports = router;