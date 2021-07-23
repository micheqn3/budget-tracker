const router = require("express").Router();
const path = require('path')

// / routes 
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
})

module.exports = router;