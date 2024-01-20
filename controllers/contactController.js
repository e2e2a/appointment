const SITE_TITLE = 'CAR';

module.exports.index = async (req, res) => {
    if(req.session.userId){
        const user = await User.findById(req.session.userId);
        res.render('contact', {
            site_title: SITE_TITLE,
            title: 'Contact',
            session: req.session,
            user: user,
            currentUrl: req.originalUrl
        });
    }else{
        res.render ('contact', {
            site_title: SITE_TITLE,
            title: 'Contact',
            session: req.session,
            currentUrl: req.originalUrl
        });
    }
}