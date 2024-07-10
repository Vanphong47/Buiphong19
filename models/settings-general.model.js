const mongoose = require("mongoose");

const settingGeneralSchema = new mongoose.Schema({
    websiteName: String,
    logo: String,
    phone: String,
    email: String,
    address: String,
    copyright: String
}, {
    timestamps: true
});

const settingGeneral = mongoose.model("SettingGeneral", settingGeneralSchema, "settings-general");

module.exports = settingGeneral;
