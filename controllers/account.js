const User = require("../models/user");
const Login = require('../models/login');
const bcrypt = require("bcrypt");
const mailer = require('nodemailer');
const crypto = require('crypto');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey('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');
// let transporter =mailer.createTransport({
//     service:'gmail',
//     auth:{
//       user:'infose480project@gmail.com',
//       pass:'45594559'
//     }
// });
exports.getLogin = (req,res,next)=>{
    var errorMessage = req.session.errorMessage;
    delete req.session.errorMessage;
    res.render('account/login',{
        path:'/login',
        title:'Login',
        errorMessage:errorMessage
    });
}
exports.postLogin = (req, res, next) => {

    const email = req.body.email;
    const password = req.body.password;

    const loginModel = new Login({
        email: email,
        password: password
    });

    loginModel
        .validate()
        .then(() => {
            User.findOne({ email: email })
                .then(user => {
                    if (!user) {
                        req.session.errorMessage = 'This mail is not found.';
                        req.session.save(function (err) {
                            return res.redirect('/login');
                        })
                    }

                    bcrypt.compare(password, user.password)
                        .then(isSuccess => {
                            if (isSuccess) {
                                req.session.user = user;
                                req.session.isAuthenticated = true;
                                return req.session.save(function (err) {
                                    var url = req.session.redirectTo || '/';
                                    delete req.session.redirectTo;
                                    return res.redirect(url);
                                });
                            }
                            req.session.errorMessage = 'wrong password or email.';
                            req.session.save(function (err) {
                                return res.redirect('/login');
                            })
                        })
                        .catch(err => {
                            console.log(err);
                        })
                })
                .catch(err => console.log(err));
        })
        .catch(err => {
            if (err.name == 'ValidationError') {
                let message = '';
                for (field in err.errors) {
                    message += err.errors[field].message + '<br>';
                }
                res.render('account/login', {
                    path: '/login',
                    title: 'Login',
                    errorMessage: message
                });
            } else {
                next(err);
            }
        });
}
exports.getRegister = (req, res, next) => {
    var errorMessage = req.session.errorMessage;
    delete req.session.errorMessage;
    res.render('account/register', {
        path: '/register',
        title: 'Register',
        errorMessage: errorMessage
    });
}

exports.postRegister = (req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    

    User.findOne({ email: email })
        .then(user => {
            if (user) {
                req.session.errorMessage = 'This mail is used earlier.';
                req.session.save(function (err) {
                    console.log(err);
                    return res.redirect('/register');
                })
            }

            return bcrypt.hash(password, 10);
        })
        .then(hashedPassword => {
            const newUser = new User({
                name: name,
                email: email,
                password: hashedPassword,
                comment: { items: [] }
            });
           
            return newUser.save();
        })
        .then(() => {
            console.log({name:name,email:email,password:password});
            res.redirect('/login');
            let mailOptions = {
                from : 'infose480project@gmail.com',
                to:email,
                subject:'New register',
                text:'Welcome to our app',
                html: `<h1>Welcome ${name}</h1></br></hr> Successfully registered.. <hr>Your password is : ${password}`
            };

            // transporter.sendMail(mailOptions,(error,info)=>{
            //     if(error){
            //       console.log(error);
            //     }else{
            //       console.log('Email sent :',info.response);
            //     }
            // });
            sgMail.send(mailOptions).then(data=>console.log(data)).catch(err=>console.log(err));
        }).catch(err => {
            if (err.name == 'ValidationError') {
                let message = '';
                for (field in err.errors) {
                    message += err.errors[field].message + '<br>';
                }
                res.render('account/register', {
                    path: '/register',
                    title: 'Register',
                    errorMessage: message
                });
            } else {
                next(err);
            }
        })
}

exports.getReset = (req, res, next) => {
    var errorMessage = req.session.errorMessage;
    delete req.session.errorMessage;

    res.render('account/reset', {
        path: '/reset-password',
        title: 'Reset Password',
        errorMessage: errorMessage
    });
}

exports.postReset = (req, res, next) => {

    const email = req.body.email;

    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            return res.redirect('/reset-password');
        }
        const token = buffer.toString('hex');

        User.findOne({ email: email })
            .then(user => {
                if (!user) {
                    req.session.errorMessage = 'the mail is not found.';
                    req.session.save(function (err) {
                        return res.redirect('/reset-password');
                    })
                }
                user.resetToken = token;
                user.resetTokenExpiration = Date.now() + 3600000;

                return user.save();
            }).then(result => {
                console.log(result);
                let mailOptions = {
                    from : 'infose480project@gmail.com',
                    to:email,
                    subject:'Password Reset',
                    html: `
                    <p>Please click to reset your password..</p>
                    <p>
                        <a href="http://localhost:3000/reset-password/${token}">reset password </a>
                    </p>`
                };
                res.redirect('/');
               
                // transporter.sendMail(mailOptions,(error,info)=>{
                //     if(error){
                //       console.log(error);
                //     }else{
                //       console.log('Email sent :',info.response);
                //     }
                // });
                sgMail.send(mailOptions).then(data=>console.log(data)).catch(err=>console.log(err));
            }).catch(err => { next(err); });
    });

}

exports.getNewPassword = (req, res, next) => {

    var errorMessage = req.session.errorMessage;
    delete req.session.errorMessage;

    const token = req.params.token;

    User.findOne({
        resetToken: token, resetTokenExpiration: {
            $gt: Date.now()
        }
    }).then(user => {
        res.render('account/new-password', {
            path: '/new-password',
            title: 'New Password',
            errorMessage: errorMessage,
            userId: user._id.toString(),
            passwordToken: token
        });
    }).catch(err => {
        next(err);
    })
}

exports.postNewPassword = (req, res, next) => {
    const newPassword = req.body.password;
    const userId = req.body.userId;
    const token = req.body.passwordToken;
    let _user;

    User.findOne({
        resetToken: token,
        resetTokenExpiration: {
            $gt: Date.now()
        },
        _id: userId
    }).then(user => {
        _user = user;
        return bcrypt.hash(newPassword, 10);
    }).then(hashedPassword => {
        _user.password = hashedPassword;
        _user.resetToken = undefined;
        _user.resetTokenExpiration = undefined;
        return _user.save();
    }).then(() => {
        res.redirect('/login');
    }).catch(err => { next(err); });
}

exports.getLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/');
    });
}
