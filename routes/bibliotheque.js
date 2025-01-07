const express = require("express");
const router = express.Router();
const BibliothequeController = require("../controller/bibliotheque");

router.post("/create", BibliothequeController.addBibliotheque);
router.get("/list", BibliothequeController.getallbibliotheque);
router.get("/details/:id", BibliothequeController.getbyidbibliotheque);
router.delete("/delete/:id", BibliothequeController.deletebyidbibliotheque);


module.exports = router;
