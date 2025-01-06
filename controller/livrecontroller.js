const Bibliotheque = require("../model/Bibliotheque");
const Livre = require("../model/livre");


async function addLivreToBibliotheque(req, res, next) {
    try {
        const { id } = req.params; // ID de la bibliothèque
        const { titre, auteur, date_publication } = req.body;

        // Vérifie si la bibliothèque existe
        const bibliotheque = await Bibliotheque.findById(id);
        if (!bibliotheque) {
            return res.status(404).json({ message: "Bibliothèque non trouvée" });
        }

        // Création du livre
        const livre = new Livre({
            titre,
            auteur,
            date_publication,
            etat: "disponible", // Le livre est disponible par défaut
            id_bibliotheque: id, // Associe le livre à la bibliothèque
        });

        // Sauvegarde du livre dans la base de données
        await livre.save();

        // Mise à jour du nombre de livres dans la bibliothèque
        bibliotheque.nbr_livre = (bibliotheque.nbr_livre || 0) + 1;
        await bibliotheque.save();

        // Réponse réussie
        res.status(201).json({
            message: "Livre ajouté avec succès",
            livre,
            bibliotheque,
        });
    } catch (error) {
        // Passer l'erreur au middleware suivant
        next(error);
    }
}


async function location(req, res, next) {
    try {
        const { id } = req.params; // ID du livre

        // Recherche du livre par ID
        const livre = await Livre.findById(id);
        if (!livre) {
            return res.status(404).json({ message: "Livre non trouvé" });
        }

        // Vérifie si le livre est déjà loué
        if (livre.etat === "loué") {
            return res.status(400).json({ message: "Le livre est déjà loué" });
        }

        // Recherche de la bibliothèque associée
        const bibliotheque = await Bibliotheque.findById(livre.id_bibliotheque);
        if (!bibliotheque) {
            return res.status(404).json({ message: "Bibliothèque associée non trouvée" });
        }

        // Mise à jour de l'état du livre et sauvegarde
        livre.etat = "loué";
        await livre.save();

        // Décrémentation du nombre de livres disponibles dans la bibliothèque
        bibliotheque.nbr_livre = Math.max((bibliotheque.nbr_livre || 0) - 1, 0);
        await bibliotheque.save();

        return res.status(200).json({
            message: "Le livre a été loué avec succès",
            livre,
            bibliotheque,
        });
    } catch (error) {
        // Passer l'erreur au middleware suivant
        next(error);
    }
}

async function getbooknumber(req, res, next) {
    try {
        // Récupérer toutes les bibliothèques
        const bibliotheques = await Bibliotheque.find();

        // Mapper les bibliothèques pour calculer les statistiques
        const results = await Promise.all(
            bibliotheques.map(async (bibliotheque) => {
                // Récupérer les livres associés
                const livres = await Livre.find({ id_bibliotheque: bibliotheque._id });

                // Calcul des livres loués et disponibles
                const loues = livres.filter((livre) => livre.etat === "loué").length;
                const disponibles = livres.filter((livre) => livre.etat === "disponible").length;

                return {
                    bibliotheque: bibliotheque.nom, // Nom de la bibliothèque
                    loues: loues,
                    disponible: disponibles,
                };
            })
        );

        // Renvoyer la réponse
        res.status(200).json(results);
    } catch (error) {
        next(error); // Gestion des erreurs
    }
}

//fonction de socket ici

module.exports = {
    addLivreToBibliotheque,
    location,
    getbooknumber,
};