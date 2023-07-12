if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
const { Router } = require('express');
const router = Router()
router.delete('/logout', (req, res) => {
    req.logOut();
    res.clearCookie('mlcl');
    req.session.destroy()
    res.redirect('/connecter');

})
module.exports = router