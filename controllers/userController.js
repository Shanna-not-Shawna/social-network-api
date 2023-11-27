const { User, Thought } = require('../models');

module.exports = {
    // Create a new user
    async createUser(req, res) {
        try {
            const dbUserData = await User.create(req.body);
            res.json(dbUserData);
        } catch (err) {
            res.status(500).json(err);
        }
    },

       // GET all users
       async getAllUsers(req, res) {
        try {
            const users = await User.find();
            res.json(users);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    // GET a single user by ID
    async getSingleUser(req, res) {
        try {
            const user = await User.findOne({ _id: req.params.userId })
                .select('-__v')
                .populate({ path: 'thoughts' })
                .populate({ path: 'friends' })

            if (!user) {
                return res.status(404).json({ message: 'No user with that ID' });
            }
            res.json(user);
        } catch (err) {
            console.error('Error in getSingleUser:', err);
        res.status(500).json(err);
        }
    },

    // Update a user
    async updateUser(req, res) {
        try {
            const user = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $set: req.body },
                { runValidators: true, new: true }
            );

            if (!user) {
                return res.status(404).json({ message: 'No user with this id found' });
            }

            res.json('Successfully updated user');
        } catch (err) {
            res.status(500).json(err);
        }
    },

    // Delete a user
    async deleteUser(req, res) {
        try {
            const user = await User.findOneAndDelete({ _id: req.params.userId });

            if (!user) {
                return res.status(404).json({ message: 'No user with id found' });
            }
            
            await Thought.deleteMany({ _id: { $in: user.thoughts } });

            res.json({ message: 'User successfully deleted' });
        } catch (err) {
            console.error('Error in deleteUser:', err);
            res.status(500).json(err)
        }
    },

    // add a friend 
    async addFriend(req, res) {
        try {
            const user = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $addToSet: { friends: req.params.friendId } },
                { new: true }
            );

            res.json({ message: 'Friend added.', data: user });
        } catch (err) {
            res.status(500).json(err);
        }
    },

    // delete a friend 
    async deleteFriend(req, res) {
        try {
            const user = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $pull: { friends: req.params.friendId } },
                { runValidators: true, new: true }
            )

            if (!user) {
                return res.status(404).json({ message: 'No user with this id!' });
            }

            res.json('Successfully removed friend');
        } catch (err) {
            res.status(500).json(err);
        }
    },

};