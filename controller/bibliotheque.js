
const Bibliotheque = require("../model/Bibliotheque");
const Livre = require("../model/livre");

async function addBibliotheque(req, res, next) {
    try {
        const bibliotheque = new Bibliotheque({
            nom: req.body.nom,
            adresse: req.body.adresse,
            nbr_livre: 0,
        });
        await bibliotheque.save();
        res.status(200).send("add good");
    } catch (err) {
        console.log(err);
    }
}

async function getallbibliotheque(req, res, next) {
    try {
        const data = await Bibliotheque.find();
        res.json(data);
    } catch (err) {
        console.log(err);
    }
}

async function getbyidbibliotheque(req, res, next) {
    try {
        const data = await Bibliotheque.findById(req.params.id);
        res.json(data);
    } catch (err) {
        console.log(err);
    }
}

async function deletebyidbibliotheque(req, res, next) {
    try {
        const data = await Bibliotheque.findByIdAndDelete(req.params.id);
        res.json(data);
    } catch (err) {
        console.log(err);
    }
}



module.exports = {
    addBibliotheque,
    getallbibliotheque,
    getbyidbibliotheque,
    deletebyidbibliotheque,
}