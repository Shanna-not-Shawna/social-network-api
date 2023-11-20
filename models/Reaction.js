const { Schema, Types } = require('mongoose');

const reactionSchema = new Schema({
    reactionId: { type: Schema.Types.ObjectId, default: () => new Types.ObjectId (), required: true, },
    reactionBody: { type: String, required: true, minLength: 1, maxLength: 280, },
    username: { type: String, required: true, trim: true, },
    createdAt: { type: Date, default: Date.now, get: (date) => { return date.toLocalDateString();}},
},
{ toJSON: { getters: true, }, id: false, _id: false, }
);