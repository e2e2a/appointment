const homeController = require('../controllers/homeController');
const aboutController = require('../controllers/aboutController');
const serviceController = require('../controllers/serviceController');
const contactController = require('../controllers/contactController');
const userController = require('../controllers/userController');
const verifyController = require('../controllers/verifyController');
module.exports = function(app){
    app.get('/', homeController.index);
    app.get('/about', aboutController.index);
    app.get('/team', aboutController.team);
    app.get('/service', serviceController.index);
    app.get('/booking', serviceController.book);
    app.get('/contact', contactController.index);
    app.get('/login', userController.login);
    app.post('/login', userController.doLogin);
    app.get('/register', userController.register);
    app.post('/register', userController.doRegister);
    app.post('/logout', userController.logout);
    app.get('/profile', userController.edit);
    app.post('/profile', userController.doEdit);
    app.get('/verify', verifyController.verify);
    app.post('/verify', verifyController.doVerify);
    

}