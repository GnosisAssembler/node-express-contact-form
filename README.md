# Node-Express-Contact-Form
A Node-Express contact form using Nodemailer and ReCaptcha Verification.

### Prerequisites

* [Node.js](https://nodejs.org/en/)
* [ReCaptcha v2 Registered Site](https://www.google.com/recaptcha/intro/v3beta.html) 

### Getting Started

```
# Go to your project directory
cd my-contact-form

# Clone the repository
git clone https://github.com/pankaryp/Node-Express-Contact-Form.git

# Install NPM dependencies
npm install
```

#### ReCaptcha
In order to have the reCaptcha "I am not a robot" checkbox in the contact form, you must register a domain at [Google ReCaptcha](https://www.google.com/recaptcha/intro/v3beta.html) and under the __Domain__ label add localhost for testing purposes or your actual domain for production.

!['domain'](domain.png?raw=true)

After that, you need to replace your own __Site key__ and __Secret Key__ in the code files.

!['sitekey'](sitekey.png?raw=true)

* views/contact.pug , *line 42*
```pug
.form-group
      .g-recaptcha(data-sitekey='YOUR_DATA_SITE_KEY')
    button.btn.btn-primary(type='submit' value='submit') Submit
```

* routes/contact.js , *line 172*
```javascript
 // Set the captcha secret key
    var SECRET = "YOUR_SECRET_KEY";
```

#### Nodemailer
In order for Nodemailer to work, you must set

* The __Email Sender__ and __Host__ - routes/contact.js , *line 127*
```javascript
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
```

* The __Email Receiver__ - routes/contact.js, *line 142*
```javascript
let mailOptions = {
    from: '"Nodemailer Contact" <EMAIL_SENDER>', // sender address
    to: 'EMAIL_RECEIVER', // list of receivers
    subject: 'Node contact request', // Subject line
    html: output // html body
};
```

Opening [`localhost:3000/contact`](localhost:3000/contact) you must see the contact page.

!['contact'](contact.png?raw=true)

### Contributing
---
If something is unclear, wrong, or needs to be refactored, please let me know. Pull requests are always welcome. Please open an issue before submitting a pull request. 

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
