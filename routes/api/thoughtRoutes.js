const router = require('express').Router();

const {
    getAllThoughts,
    getSingleThought,
    createThought,
    updateThought,
    deleteThought,
    addThoughtReaction,
    removeThoughtReaction,
} = require('../../controllers/thoughtsController');

router.route('/').get(getAllThoughts).post(createThought);

router
    .route('/:thoughtsId')
    .get(getSingleThought)
    .put(updateThought)
    .delete(deleteThought);

router.route('/:thoughtsId/reactions').post(addThoughtReaction);

router.route('/:thoughtsId/reactions/:reactionId').delete(removeThoughtReaction);


module.exports = router;