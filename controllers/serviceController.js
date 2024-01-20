const SITE_TITLE = 'CAR';

module.exports.index = async (req, res) => {
    if(req.session.userId){
        const user = await User.findById(req.session.userId);
        res.render('service', {
            site_title: SITE_TITLE,
            title: 'Service',
            session: req.session,
            user: user,
            currentUrl: req.originalUrl
        });
    }else{
        res.render ('service', {
            site_title: SITE_TITLE,
            title: 'Service',
            session: req.session,
            currentUrl: req.originalUrl
        });
    }
}

module.exports.book = async (req, res) => {
    if(req.session.userId){
        const user = await User.findById(req.session.userId);
        res.render('booking', {
            site_title: SITE_TITLE,
            title: 'Booking',
            session: req.session,
            user: user,
            currentUrl: req.originalUrl
        });
    }else{
        res.render ('booking', {
            site_title: SITE_TITLE,
            title: 'Booking',
            session: req.session,
            currentUrl: req.originalUrl
        });
    }
}