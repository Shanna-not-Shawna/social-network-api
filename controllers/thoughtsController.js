const { Thought, User } = require('../models');

module.exports = {
    // get all thoughts 
    async getAllThoughts(req, res) {
        try {
            const thoughts = await Thought.find();
            res.json(thoughts);
        } catch (err) {
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
                return res.status(404).json({ message: 'No thought with that ID' });
            }

            res.json(thought);
        } catch (err) {
            res.status(500).json(err);
        }
    },

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
                    message: 'Thought created, but found no user with that ID',
                });
            }

            res.json( { message: 'Created thought', data: thought });
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

            res.json(thought);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    // delete a thought 
    async deleteThought(req, res) {
        try {
            const thought = await Thought.findOneAndRemove({ _id: req.params.thoughtsId });

            if (!thought) {
                return res.status(404).json({
                    message: 'No thought found with that ID',
                });
            }

            res.json(thought);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    // add reaction 
    async addThoughtReaction(req, res) {
        try {
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtsId },
                { $addToSet: {reactions: req.body} },
                { runValidators: true, new: true }
            );

            if (!thought) {
                return res.status(404).json({
                    message: 'No thought found with that ID',
                });
            }

            res.json(thought);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    // remove reaction 
    async removeThoughtReaction(req, res) {
        try {
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtsId },
                { $pull: { reactions: { reactionId: req.params.reactionId } } },
                { runValidators: true, new: true }
              )
        
              if (!thought) {
                return res.status(404).json({ message: 'No thought found with that ID' });
              }
        
              res.json(thought);
            } catch (err) {
              res.status(500).json(err);
        }
    }
}