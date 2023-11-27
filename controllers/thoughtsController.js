const { Thought, User } = require('../models');

module.exports = {
    // create a thought 
    async createThought(req, res) {
        try {
            const thought = await Thought.create(req.body);
            const user = await User.findOneAndUpdate(
                { _id: req.body.userId },
                { $addToSet: { thoughts: thought._id } },
                { new: true }
            );

            if (!user) {
                return res.status(404).json({
                    message: 'Thought created, but no user was found with that ID',
                });
            }

            res.json({ message: 'Created thought', data: thought });
        } catch (err) {
            res.status(500).json(err);
        }
    },

    // get all thoughts 
    async getAllThoughts(req, res) {
        try {
            const thoughts = await Thought.find();
            res.json(thoughts);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },

    // get 1 thought 
    async getSingleThought(req, res) {
        try {
            const thought = await Thought.findOne({ _id: req.params.thoughtsId })
                .select('-__v')
                .populate('reactions')

            if (!thought) {
                return res.status(404).json({ message: 'No thought found with that ID' });
            }

            res.json(thought);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    // update a thought 
    async updateThought(req, res) {
        try {
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtsId },
                { $set: req.body },
                { runValidators: true, new: true }
            );

            if (!thought) {
                return res.status(404).json({
                    message: 'No thought found with that ID',
                });
            }

            res.json('Successfully updated thought');
        } catch (err) {
            res.status(500).json(err);
        }
    },

    // delete a thought 
    async deleteThought(req, res) {
        try {
            const thought = await Thought.findOneAndDelete({ _id: req.params.thoughtsId });

            if (!thought) {
                return res.status(404).json({
                    message: 'No thought found with that ID',
                });
            }
            // remove thought id from user's `thoughts` field
            const dbUserData = User.findOneAndDelete(
                { thoughts: req.params.thoughtsId },
                { $pull: { thoughts: req.params.thoughtsId } },
                { new: true }
            );

            res.json('Successfully deleted reaction');
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },

    // add reaction 
    async addThoughtReaction(req, res) {
        try {
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtsId },
                { $addToSet: { reactions: req.body } },
                { runValidators: true, new: true }
            );

            if (!thought) {
                return res.status(404).json({
                    message: 'No thought found with that ID',
                });
            }

            res.json('Successfully added reaction');
        } catch (err) {
            res.status(500).json(err);
        }
    },

    // remove reaction 
    async removeThoughtReaction(req, res) {
        try {
            console.log(`removeThoughtReaction route reached with thought ID: ${req.params.thoughtsId}, reaction ID: ${req.params.reactionId}`);
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtsId },
                { $pull: { reactions: { reactionId: req.params.reactionId } } },
                { runValidators: true, new: true }
            )

            if (!thought) {
                console.log(`No thought found with ID: ${req.params.thoughtsId}`);
                return res.status(404).json({ message: 'No thought found with that ID' });
            }

            res.json('Successfully removed reaction');
        } catch (err) {
            console.error('Error in removeThoughtReaction:', err);
            res.status(500).json(err);
        }
    }
}