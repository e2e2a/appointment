const SITE_TITLE = 'CAR';
const User = require('../models/user');

module.exports.index = async (req, res) => {
    
    if(req.session.userId){
        const user = await User.findById(req.session.userId);
        res.render('index', {
            site_title: SITE_TITLE,
            title: 'Home',
            session: req.session,
            user: user,
            currentUrl: req.originalUrl
        });
    }else{
        res.render ('index', {
            site_title: SITE_TITLE,
            title: 'Home',
            session: req.session,
            currentUrl: req.originalUrl
        });
    }
}