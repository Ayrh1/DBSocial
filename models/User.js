// Require schema and model from mongoose
const mongoose = require('mongoose');

// Construct a new instance of the schema class
const userSchema = new mongoose.Schema(
    {
    // Configure individual properties using Schema Types
        username: 
        { 
            type: String, 
            required: true, 
            trim: true, 
            unique: true
        },
        email: 
        { 
            type: String, 
            required: true, 
            unique: true, 
            match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/ 
        },
        thoughts: 
        [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'thought',
            },
        ],
        friends: 
        [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'user',
            },
        ],
        lastAccessed: 
        { 
            type: Date, 
            default: Date.now 
        },

    },
    {
        toJSON:
        {
            virtuals: true,
        },
            id: false,
    }
);

userSchema
    .virtual('friendCount')
    // Getter
    .get(function () {
        return this.friends.length; 
    });

// Initialize our User model
const User = mongoose.model('User', userSchema);

module.exports = User;
