// Require dependencies
const express = require('express');
const router = express.Router();
const expressValidator  = require('express-validator');
const { sanitizeBody } = require('express-validator/filter');
const nodemailer = require('nodemailer');
const flash = require('connect-flash');
const session = require('express-session');

// HTTP Request
const https = require('https');

// Express Validator Middleware
router.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
        , root  = namespace.shift()
        , formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param : formParam,
            msg : msg,
            value : value
        };
    }
}));

// Express Session Middleware
router.use(session({
    secret: 'ninja fox',
    resave: true,
    saveUninitialized: true
}));

// Express Messages Middleware
router.use(require('connect-flash')());
router.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});

// @route  GET contact
// @desc   GET Contact page
// @access Public
router.get('/contact', function (req, res) {
    res.render('contact', {
        title:'Contact me'
    });
});

// @route  POST contact
// @desc   POST Contact information
// @access Public
router.post('/contact', [
    sanitizeBody('name')
        .trim()
        .escape(),
    sanitizeBody('email')
        .normalizeEmail(),
    sanitizeBody('subject')
        .trim()
        .escape(),
    sanitizeBody('message')
        .trim()
        .escape()
    ] , function (req, res) {
    // CAPTCHA
    // Check captcha
    verifyRecaptcha(req.body["g-recaptcha-response"], function(success) {
        // If captcha verification is a success, validate and send the email
        if (success) {

        // Data Validation
        req.checkBody('name', 'Name is required').notEmpty();
        req.checkBody('email', 'Email is required').notEmpty();
        req.checkBody('email', 'Email does not feel right').isEmail();
        req.checkBody('message', 'Message is required').notEmpty(); 
        
        // Check for validation errors
        let errors = req.validationErrors();
        let nameErr, emailErr, emailTypeErr, msgErr;

        if (errors) {
            // Save the errors
            for (let i=0; i < errors.length; i++) {
                if (errors[i].param === "name") {
                nameErr = "*Name is required";
                }
                if (errors[i].param === "email") {
                emailErr = "*Email is required";
                }
                if (errors[i].msg === "Email does not feel right") {
                emailTypeErr = "*Email does not feel right";
                }
                if (errors[i].param === "message") {
                msgErr = "*Message is required";
                }
            }

        res.render('contact', {
            nameError: nameErr ,
            emailError: emailErr,
            emailTypeError: emailTypeErr,
            msgError: msgErr
        });

        } else {

            // The actual output format of the message, that it is going to be sent by email
            const output = `
            <p>You have a new contact request</p>
            <h3>Contact Details</h3>
            <ul> 
                <li>Name: ${req.body.name}</li>
                <li>Email: ${req.body.email}</li>
                <li>Subject: ${req.body.subject}</li>
            </ul>
            <h3>Message</h3>
            <p>${req.body.message}</p>
            `;

        // NODEMAILER
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: 'smtp-mail.outlook.com',
            secureConnection: false, // TLS requires secureConnection to be false
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: 'EMAIL_SENDER', // generated ethereal user
                pass: 'EMAIL_SENDER_PASSWORD' // generated ethereal password
            },
            tls: {
            ciphers:'SSLv3'
            }
        });

        // setup email data with unicode symbols
        let mailOptions = {
            from: '"Nodemailer Contact" <EMAIL_SENDER>', // sender address
            to: 'EMAIL_RECEIVER', // list of receivers
            subject: 'Node contact request', // Subject line
            html: output // html body
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            } else {
                console.log('Message sent: %s', info.messageId);
                console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
            }
        });
        
        req.flash('success', 'Your message has been sent successfully');
        res.redirect("/contact");
        }

        } else {
            req.flash('danger', 'Please select Captcha');
            res.redirect("/contact");
        }

    });

    }); // End of Contact POST

    // Set the captcha secret key
    var SECRET = "YOUR_SECRET_KEY";

    // Helper function to make API call to recatpcha and check response
    function verifyRecaptcha(key, callback) {
    https.get("https://www.google.com/recaptcha/api/siteverify?secret=" + SECRET + "&response=" + key, function(res) {
        var data = "";
        res.on('data', function (chunk) {
            data += chunk.toString();
        });
        res.on('end', function() {
            try {
                var parsedData = JSON.parse(data);
                callback(parsedData.success);
            } catch (e) {
                callback(false);
            }
        });
    });
}

// Exports the router 
module.exports = router;