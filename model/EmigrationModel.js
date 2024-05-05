const mongoose = require('mongoose');

const EmigrationSchema = new mongoose.Schema({
    salutaion: {
        type: String
    },
    surName: {
        type: String,
        required: true
    },
    GivenName: {
        type: String,
        required: true
    },
    Nationality: {
        type: String,
        required: true
    },
    DOB: {
        type: Date
    },
    Address: {
        type: String,
        required: true
    },
    State: {
        type: String,
        required: true
    },
    Pincode: {
        type: String,
        required: true
    },
    PhoneNumber: {
        type: String,
        required: true
    },
    PassportNumber: {
        type: String,
        required: true
    },
    CountryOfPassport: {
        type: String,
        required: true
    },
    VisaStatus:{
        type: String
    },
    ExpiryDate: {
        type: Date,
        default: Date.now()
        // required: true
    },
    TypeOfVisa: {
        type: String,
        required: true
    },
    VisaAttached:{
        type: String
    },
    issuedDateType: {
        type: Boolean,
        default: false
    },
    issuedDate: {
        type: Date,
        default: Date.now()

    },
    validityDate:{
        type: Date,
    },
    CompanyName: {
        type: String
    },
    PassportUrl: {
        type: String
    },
    PhotoUrl: {
        type: String
    },
    PanCardUrl: {
        type: String
    },
    StatusOfApplication: [
        {
            comments: {
                type: String
            },
            CommentDate: {
                type: Date,
                default: Date.now
            }
        }
    ],
    UicNo: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Emigration = mongoose.model('Emigration', EmigrationSchema);
module.exports = Emigration;
