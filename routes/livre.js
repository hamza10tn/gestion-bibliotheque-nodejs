const express = require("express");
const router = express.Router();
const LivreController = require("../controller/livrecontroller");
const validateLivre = require("../middl/validate");

router.post("/create/:id", validateLivre, LivreController.addLivreToBibliotheque);
router.put("/location/:id", LivreController.location);
router.get("/resume", LivreController.getbooknumber);




router.get("/socket", (req, res, next) => {
    res.render("location");
});
module.exports = router;
