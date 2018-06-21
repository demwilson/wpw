var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var FeatSchema = new Schema({
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
    types: [ String ],
    flavor_text: {
        type: String,
        default: ''
    },
    benefit: {
        type: String,
        default: ''
    },
    normal: {
        type: String,
        default: ''
    },
    special: {
        type: String,
        default: ''
    },
    requires_value: {
        type: Boolean,
        default: false
    },
    prerequisites: [
        {
            text: {
                type: String,
                default: ''
            },
            type: {
                type: String,
                default: ''
            },
            requirement: {
                type: String,
                default: ''
            }
        }
    ],
    modifiers: [
        {
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
    },
    url: {
        type: String,
        default: ''
    }
});
mongoose.model('Feat', FeatSchema);