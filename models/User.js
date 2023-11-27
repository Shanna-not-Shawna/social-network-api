const { Schema, model } = require('mongoose');

const userSchema = new Schema(
    { username: { type: String, required: true, unique: true, trim: true, },
      email: { type: String, trim: true, required: true, unique: true, validate: {
                validator: function (validate) {
                    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,8}$/.test(validate);
                },
                message: 'Please enter a valid email'
            },
            required: [true, "Email is required."] },
      thoughts: [{ type: Schema.Types.ObjectId, ref: 'Thought', }],
      friends: [{ type: Schema.Types.ObjectId, ref: 'User', },],
    },
    { toJSON: { virtuals: true, getters: true, },
        id: false,
    }
);

userSchema.virtual('friendCount').get(function () {
    return this.friends.length;
})

const User = model('User', userSchema);

module.exports = User;