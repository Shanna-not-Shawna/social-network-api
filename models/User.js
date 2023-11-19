const mongoose = require('mongoose');

const socialSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    // thoughts array of _id values referencing the thought model
    // friends array of _id values referencing the user model (self-reference)
    // create virtual called friendCount that retrieves the length of the user's friends array field on query
});

const User = mongoose.model('User', socialSchema);

const handleError = (err) => console.error(err);

User
    .create({
        username: 'Shay',
        email: 'email1@email.com',
    })
    .then(result => console.log('Created new document', result))
    .catch(err => handleError(err));

module.exports = User;