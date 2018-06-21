var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var RaceSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    name: {
        type: String,
        trim: true,
        unique: true,
        required: "Name cannot be blank"
    },
    creator: {
        type: Schema.ObjectId,
        require: true,
        ref: 'User'
    },
    descriptions: [
        {
            title: {
                type: String,
                default: ''
            },
            text: {
                type: String,
                default: ''
            },
            position: {
                type: Number,
                default: 999
            }
        }
    ],
    qualities: [
        {
            name: {
                type: String,
                required: "Quality name cannot be blank"
            },
            text: {
                type: String,
                default: ''
            },
            type: {
                type: String,
                default: ''
            },
            formula: {
                type: String,
                default: ''
            },
            conditional: {
                type: String,
                default: ''
            }
        }
    ],
    alternatives: [
        {
            text: {
                type: String,
                default: ''
            },
            type: {
                type: String,
                default: ''
            },
            formula: {
                type: String,
                default: ''
            },
            conditional: {
                type: String,
                default: ''
            }
        }
    ],
    source: {
        type: String,
        default: ''
    }
});
mongoose.model('Race', RaceSchema);