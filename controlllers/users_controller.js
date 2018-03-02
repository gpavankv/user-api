const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


module.exports = {

    test(req, res) {
        // res.header("Access-Control-Allow-Origin", "*");
        // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        console.log('Incoming req');
        res.send({message: 'Test Successful!'});
    },

    getAllUsers(req, res, next) {
        // res.header("Access-Control-Allow-Origin", "*");
        // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

        User.find().then((users) => {
            for(let i=0;i<users.length;i++){
                users[i].password = '';
                users[i].token = '';
            }
            res.status(200).send(users);
            console.log(users);
        });
    },

    createUser(req, res, next) {
        const userProps = req.body;
        bcrypt.genSalt(8).then((salt) => {
            bcrypt.hash(userProps.password, salt)
                .then((hash) => {
                    userProps.password = hash;
                    User.create(userProps)
                        .then(() => res.status(201).send({
                            message: 'User created',
                            created: true
                        }))
                        .catch(next);
                }).catch(err => console.log(err));
        }).catch(err => console.log(err));
    },

    verifyUser(req, res, next) {
        const userDetails = req.body;
        console.log(userDetails);
        User.findOne({email: userDetails.email})
            .then((user) => {
                bcrypt.compare(userDetails.password, user.password)
                    .then(result => {
                        if (result === true) {
                            let token = jwt.sign({user}, 'secret', { expiresIn: '1h'});
                            res.send({
                                message: `${user.firstName} ${user.lastName}`,
                                token: token,
                                authorized: true
                            });
                            // user.token = token;
                            // user.save();
                        } else {
                            res.status(401).send({message: 'Wrong Password! Please check your password!'});
                        }
                    }).catch(err => {
                    console.log(err);
                    res.status(401).send({message: 'Could not authorize'});
                    next();
                });

            }).catch(err => {
            console.log(err);
            res.status(401).send({message: 'Could not authorize'});
            next();
        });
    },

    findUserByEmail(req, res, next) {
        const userDetails = req.body;
        console.log(req.body)
        User.findOne({email: userDetails.email})
            .then((user) => {
                console.log(user);
                if(user !== null){
                    res.status(200).send({ message: 'found'});
                } else {
                    res.status(204).send({message: 'not user found with that email'});
                }
                next();
            }).catch(err => {
            res.status(401).send({ error: 'There\'s been an error! please try again'});
            next();
        });
    },

    updateUser(req, res, next){
        const userDetails = req.body;
        const newUser = { };
        console.log(userDetails);
        User.findOne({email: userDetails.email})
            .then((user) => {
                console.log(user);
                if(user!=null) {
                    bcrypt.genSalt(8).then((salt) => {
                        bcrypt.hash(userDetails.password, salt)
                            .then((hash) => {
                                userDetails.password = hash;
                                if (userDetails.newEmail != null && userDetails.newEmail !== user.email) {
                                    console.log(userDetails.firstName);

                                    newUser.firstName = userDetails.firstName;
                                    newUser.lastName = userDetails.lastName;
                                    newUser.email = userDetails.newEmail;
                                    newUser.password = userDetails.password;
                                    User.updateOne({email: userDetails.email}, newUser, {upsert: false}).then((data) => {
                                        if(data.nModified === 1){
                                            res.send({updated: true});
                                            next();
                                        }
                                    })
                                } else {
                                    console.log(userDetails.firstName);
                                    newUser.firstName = userDetails.firstName;
                                    newUser.lastName = userDetails.lastName;
                                    newUser.email = userDetails.email;
                                    newUser.password = userDetails.password;

                                    User.updateOne({email: userDetails.email}, newUser, {upsert: false}).then((data) => {
                                        if(data.nModified === 1){
                                            res.send({updated: true});
                                            next();
                                        }
                                    })
                                }
                            })
                    })
                } else {
                    res.send({
                        updated: false,
                        message: 'could not find user'
                    });
                }
                console.log()
            }).catch(err => {
            res.status(401).send({ message: 'could not find user'});
            next();
        });
    },

    deleteUser(req, res, next){
        const userDetails = req.body;
        User.findOneAndRemove({email: userDetails.email})
            .then((data) => {
                console.log(data);
                res.status(200).send({deleted: true });
                next();
            }).catch((error) => {
                console.log(error);
                next();
            });
    },

    verifyToken(req, res, next) {
        const userDetails = req.body;
        let decoded = jwt.verify(userDetails.token, 'secret');
        console.log(decoded);
        User.findOne({token: userDetails.token})
            .then(user => {
                let rName = `${user.firstName}${user.lastName}`;
                let bName = `${userDetails.firstName}${userDetails.lastName}`;
                if( rName === bName){
                    res.send({ message: 'request succeded'});
                } else {
                    res.send({ message: 'either token or other details are wrong'});
                }
            })
            .catch(err => console.log(err));
    }

}