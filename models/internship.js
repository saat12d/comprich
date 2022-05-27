const mongoose = require('mongoose');

const internshipSchema = new mongoose.Schema({
    companyName: String,
    companyLogo: String,
    internPosition: String,
    internDate: String,
    ageRequirement: String,
    signUpDate: Date,
    reimbursement: String,
    signUpForm: String,
    desc: String,
    fromCompany: String,
    location: String
})

module.exports = mongoose.model('Internship', internshipSchema);