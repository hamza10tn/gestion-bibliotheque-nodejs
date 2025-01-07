const Bibliotheque = require("../model/Bibliotheque");
const Livre = require("../model/livre");


async function addLivreToBibliotheque(req, res, next) {
    try {
        const { id } = req.params;
        const { titre, auteur, date_publication } = req.body;


        const bibliotheque = await Bibliotheque.findById(id);
        if (!bibliotheque) {
            return res.status(404).json({ message: "Bibliothèque non trouvée" });
        }


        const livre = new Livre({
            titre,
            auteur,
            date_publication,
            etat: "disponible",
            id_bibliotheque: id,
        });


        await livre.save();


        bibliotheque.nbr_livre = (bibliotheque.nbr_livre || 0) + 1;
        await bibliotheque.save();


        res.status(201).json({
            message: "Livre ajouté avec succès",
            livre,
            bibliotheque,
        });
    } catch (error) {
        next(error);
    }
}


async function location(req, res, next) {
    try {
        const { id } = req.params;


        const livre = await Livre.findById(id);
        if (!livre) {
            return res.status(404).json({ message: "Livre non trouvé" });
        }


        if (livre.etat === "loué") {
            return res.status(400).json({ message: "Le livre est déjà loué" });
        }


        const bibliotheque = await Bibliotheque.findById(livre.id_bibliotheque);
        if (!bibliotheque) {
            return res.status(404).json({ message: "Bibliothèque associée non trouvée" });
        }


        livre.etat = "loué";
        await livre.save();


        bibliotheque.nbr_livre = Math.max((bibliotheque.nbr_livre || 0) - 1, 0);
        await bibliotheque.save();

        return res.status(200).json({
            message: "Le livre a été loué avec succès",
            livre,
            bibliotheque,
        });
    } catch (error) {
        next(error);
    }
}

async function getbooknumber(req, res, next) {
    try {
        const bibliotheques = await Bibliotheque.find();


        const results = await Promise.all(
            bibliotheques.map(async (bibliotheque) => {

                const livres = await Livre.find({ id_bibliotheque: bibliotheque._id });


                const loues = livres.filter((livre) => livre.etat === "loué").length;
                const disponibles = livres.filter((livre) => livre.etat === "disponible").length;

                return {
                    bibliotheque: bibliotheque.nom,
                    loues: loues,
                    disponible: disponibles,
                };
            })
        );


        res.status(200).json(results);
    } catch (error) {
        next(error);
    }
}



module.exports = {
    addLivreToBibliotheque,
    location,
    getbooknumber,
};