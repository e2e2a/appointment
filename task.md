task for tommorow
//first to do

-make a template status 500

-booking
    |
    email notification
    
-should separate the JS in profile-edit.ejs

//admin
--create admin template
--put positions of users
  |
   ex. {position: member}

//need to learn
--sgMail.setApiKey('YOUR_SENDGRID_API_KEY');

//practice the encapsulate error rendering
const renderErrorPage = (res, errorCode, title, session, currentUrl, err) => {
  res.status(errorCode).render(`${errorCode}`, {
    site_title: SITE_TITLE,
    title: title,
    session: session,
    currentUrl: currentUrl,
    err: err,
  });
};