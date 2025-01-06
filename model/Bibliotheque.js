const mongo = require("mongoose");
const Schema = mongo.Schema;
const Bibliotheque = new Schema({
    nom: String,
    nbr_livre: Number,
    adresse: String,
});
module.exports = mongo.model("bibliotheque", Bibliotheque);
