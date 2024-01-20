const SITE_TITLE = 'CAR';
const User = require('../models/user');
const multer = require('multer');
var fileUpload = require('../middlewares/profile-upload-middleware');
const UserToken = require('../models/userToken');
//token
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { customAlphabet } = require('nanoid');
const sixDigitCode = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 6);

module.exports.register = (req, res) => {
    res.render('register', {
        site_title: SITE_TITLE,
        title: 'Register',
        session: req.session,
        currentUrl: req.originalUrl,
        messages: req.flash(),
    });
}
module.exports.doRegister = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    // Checking
    const existingUser = await User.findOne({ email });
    try {
        if (existingUser) {
            if (existingUser.isVerified) {
                console.log('Email already used! Please enter another email.');
                req.flash('error', 'Email already used! Please enter another email.');
                res.redirect('/register');
                return;
            } else {
                if (password !== confirmPassword) {
                    req.flash('error', 'Password does not match.');
                    return res.redirect('/register');
                }
                const data = {
                    fullname: req.body.fullname,
                    email: email,
                    birthdate: req.body.birthdate,
                    contact: req.body.contact,
                    address: req.body.address,
                    password: password,
                    isVerified: false,
                };
                const registrationToken = jwt.sign({ userId: existingUser._id }, 'Reymond_Godoy_Secret7777', { expiresIn: '1d' });
                // Generate a 6-digit verification code
                const verificationCode = sixDigitCode();
                await UserToken.findOneAndUpdate(
                    { userId: existingUser._id },
                    {
                        token: registrationToken,
                        verificationCode: verificationCode,
                        expirationDate: new Date(new Date().getTime() + 24 * 5 * 60 * 1000),
                        expirationCodeDate: new Date(new Date().getTime() + 5 * 60 * 1000),
                    },
                    { new: true }
                );
                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'emonawong22@gmail.com',
                        pass: 'nouv heik zbln qkhf',
                    },
                });
                const sendEmail = async (from, to, subject, htmlContent) => {
                    try {
                        const mailOptions = {
                            from,
                            to,
                            subject,
                            html: htmlContent,
                        };
                        const info = await transporter.sendMail(mailOptions);
                        console.log('Email sent:', info.response);
                    } catch (error) {
                        console.error('Error sending email:', error);
                        throw new Error('Failed to send email');
                    }
                };
                const verificationLink = `http://localhost:8080/verify?token=${registrationToken}`;
                // Send an email with the verification link
                const emailContent = `
                    <div style="font-family: Arial, sans-serif; padding: 20px;">
                        <h1 style="color: #000;">Hello ${existingUser.fullname}</h1>
                        <p style="color: #000;">From: <strong>Reymond R. Godoy</strong></p>
                        <p style="color: #000;">Your verification code is: <strong>${verificationCode}</strong></p>
                        <p style="color: #000;">Click the link below to verify your email:</p>
                        <a href="${verificationLink}" style="text-decoration: none; display: inline-block; padding: 10px; background-color: #4CAF50; color: #fff; border-radius: 5px;">Verify Email</a>
                    </div>
                `;
                sendEmail(
                    'Swiftfixhub.com <emonawong22@gmail.com>',
                    existingUser.email,
                    'Verify your email',
                    emailContent
                );
                await User.findByIdAndUpdate(existingUser._id, data, {
                    new: true
                });
                res.redirect(`/verify?token=${registrationToken}&sendcode=true`);
            }
        } else {
            if (password !== confirmPassword) {
                req.flash('error', 'Password does not match.');
                return res.redirect('/register');
            }
            const user = new User({
                fullname: req.body.fullname,
                email: req.body.email,
                birthdate: req.body.birthdate,
                contact: req.body.contact,
                address: req.body.address,
                password: password,
                isVerified: false,
            });
            await user.save();
            const registrationToken = jwt.sign({ userId: user._id }, 'Reymond_Godoy_Secret7777', { expiresIn: '1d' });
            const verificationCode = sixDigitCode();
            const userToken = new UserToken({
                userId: user._id,
                token: registrationToken,
                verificationCode: verificationCode,
                expirationDate: new Date(new Date().getTime() + 24 * 5 * 60 * 1000),
                expirationCodeDate: new Date(new Date().getTime() + 5 * 60 * 1000), // 5 mins expiration
            });
            await userToken.save();
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'emonawong22@gmail.com',
                    pass: 'nouv heik zbln qkhf',
                },
            });
            const sendEmail = async (from, to, subject, htmlContent) => {
                try {
                    const mailOptions = {
                        from,
                        to,
                        subject,
                        html: htmlContent,  // Set the HTML content
                    };
                    const info = await transporter.sendMail(mailOptions);
                    console.log('Email sent:', info.response);
                } catch (error) {
                    console.error('Error sending email:', error);
                    throw new Error('Failed to send email');
                }
            };
            // link
            const verificationLink = `http://localhost:8080/verify?token=${registrationToken}`;
            const emailContent = `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h1 style="color: #000;">Hello ${user.fullname}</h1>
                <p style="color: #000;">From: <strong>Reymond R. Godoy</strong></p>
                <p style="color: #000;">Your verification code is: <strong>${verificationCode}</strong></p>
                <p style="color: #000;">Click the link below to verify your email:</p>
                <a href="${verificationLink}" style="text-decoration: none; display: inline-block; padding: 10px; background-color: #4CAF50; color: #fff; border-radius: 5px;">Verify Email</a>
            </div>
            `;
            sendEmail(
                'Swiftfixhub.com <emonawong22@gmail.com>',
                user.email,
                'Verify your email',
                emailContent
            );
            console.log('Verification email sent. Please verify your email to complete registration.');
            res.redirect(`/verify?token=${registrationToken}&sendcode=true`,);
        }
    } catch (error) {
        console.error('Registration failed:', error);
        res.status(500).render('500', {
            site_title: SITE_TITLE,
            title: 'Internal Server Error',
            session: req.session,
            currentUrl: req.originalUrl
        });
    }
};

// Login Controller
module.exports.login = (req, res) => {
    res.render('login', {
        site_title: SITE_TITLE,
        title: 'Login',
        session: req.session,
        messages: req.flash(),
        currentUrl: req.originalUrl,
    });
}
module.exports.doLogin = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
             // 400 Bad Request
            req.flash('error', 'Invalid email.');
            return res.redirect('/login');
        }else {
            if(user.isVerified) {
                user.comparePassword(req.body.password, (error, valid) => {
                    if (error) {
                        return res.status(403).send('Forbidden'); // 403 Forbidden
                    }
                    if (!valid) {
                        // 400 Bad Request
                        req.flash('error', 'Invalid password.');
                        return res.redirect('/login');
                    }
                    req.session.userId = user.id;
                    res.redirect('/');
                });
            }else{
                req.flash('error', 'Users not found.');
                return res.redirect('/login');
            }
        }
    } catch (error) {
        return res.status(500).send(error.message); // 500 Internal Server Error
    }
}

module.exports.logout = (req, res) => {
    const userId = req.session.userId;
    req.session.destroy((err) => {
        if (err) {
            console.error('error destroying session', err);
        } else {
            console.log('user logout', userId)
            res.redirect('/');
        }
    })
}

module.exports.edit = async (req, res) => {
    try {
        // Assuming your user data is stored in the User model
        const user = await User.findOne({ _id: req.session.userId });

        if (!user) {
            // Handle the case where user data is not found
            return res.status(404).send('User not found');
        }

        res.render('profile-edit', {
            site_title: SITE_TITLE,
            title: 'Profile',
            session: req.session,
            user: user, // Pass the user data to the view
            currentUrl: req.originalUrl
        });
    } catch (error) {
        // Handle any errors that may occur during the database query
        console.error('Error fetching user data:', error);
        res.status(500).send('Internal Server Error');
    }
};

module.exports.doEdit = async (req, res) => {
    const user = await User.findOne({ _id: req.session.userId });
    var upload = multer({
        storage: fileUpload.files.storage(),
        allowedFile: fileUpload.files.allowedFile
    }).single('image');
    upload(req, res, async function (err) {
        // Checking if the error is an instance of MulterError, which would indicate 
        // an error specifically related to the file upload process, e.g. 
        // the file is too large, no file was attached, etc.
        if (err instanceof multer.MulterError) {
            // Sending the multer error to the client
            return res
                .status(err.status || 400)
                .render('400', { err: err });
        } else if (err) { // If there's another kind of error (not a MulterError), then handle it here
            // Sending the generic error to the client
            console.log(err);
            return res
                .status(err.status || 500)
                .render('500', { err: err });
        } else { // If no errors occurred during the file upload, continue to the next step
            let imageUrl = ''; // Default to an empty string
            if (user.imageURL) {
                // If user.imageURL exists, use it
                imageUrl = user.imageURL;
            }
            if (req.file) {
                // If a file was uploaded, construct the new image URL
                imageUrl = `/public/img/profile/${req.session.userId}/${req.file.filename}`;
            }
            const updateUser = {
                fullname: req.body.fullname,
                email: req.body.email,
                birthdate: req.body.birthdate,
                contact: req.body.contact,
                address: req.body.address,
                imageURL: imageUrl
            };
            const updatedUser = await User.findByIdAndUpdate(user._id, updateUser, {
                new: true
            });
            if (updatedUser) {
                console.log('user updated profile', user._id);
                res.redirect('/profile');
            } else {
                console.log('update failed');
            }
        }
    });
}

