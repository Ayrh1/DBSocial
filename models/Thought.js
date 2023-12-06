// Require schema and model from mongoose
const mongoose = require('mongoose');
const formatDate = require('../utils/date.js');

const reactionSchema = new mongoose.Schema(
    {
       reactionId: 
       {
            type: mongoose.Schema.Types.ObjectId,
            default: () => new mongoose.Types.ObjectId(),
       },
       reactionBody: 
       {
            type: String,
            maxLength: 280,
       },
       username: 
       { 
           type: String, 
           required: true, 
       },
       createdAt: 
       {
        type: Date,
        default: Date.now,
        get: formatDate,
       },

    },
    {
        virtuals: true,
        getters: true, // Enable getters for toJSON
    }
);

// Construct a new instance of the schema class
const thoughtSchema = new mongoose.Schema(
    {
        thoughtText: 
        {
            type: String,
            minLength: 1,
            maxLength: 280,
        },
        createdAt: 
        {
            type: Date,
            default: Date.now,
            get: formatDate,
        },
        username: 
        { 
            type: String, 
            required: true, 
        },
        reactions: [reactionSchema],
    },
    {
    toJSON: {
        virtuals: true,
        getters: true, // Enable getters for toJSON
      },
      id: false,
    }
);

thoughtSchema
    .virtual('reactionCount')
    // Getter
    .get(function () {
        return this.reactions.length; 
    });

// Initialize our User model
const Thought = mongoose.model('thought', thoughtSchema);

module.exports = Thought;
