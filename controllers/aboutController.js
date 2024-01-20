const SITE_TITLE = 'CAR';

module.exports.index = async (req, res) => {
    if(req.session.userId){
        const user = await User.findById(req.session.userId);
        res.render('about', {
            site_title: SITE_TITLE,
            title: 'About',
            session: req.session,
            user: user,
            currentUrl: req.originalUrl
        });
    }else{
        res.render ('about', {
            site_title: SITE_TITLE,
            title: 'About',
            session: req.session,
            currentUrl: req.originalUrl
        });
    }
}

module.exports.team = async (req,res) => {
    if(req.session.userId){
        const user = await User.findById(req.session.userId);
        res.render('team', {
            site_title: SITE_TITLE,
            title: 'team',
            session: req.session,
            user: user,
            currentUrl: req.originalUrl
        });
    } else{
        res.render('team', {
            site_title: SITE_TITLE,
            title: 'team',
            session: req.session,
            currentUrl: req.originalUrl
        });
    }
}