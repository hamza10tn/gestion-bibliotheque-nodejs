const yup = require("yup");
const validate = async (req, res, next) => {
  //titre obligatoire et de type string avec une longueur minimale de 3 caractères
  //author obligatoire et de type string avec une longueur minimale de 3 caractères
  //date_publication obligatoire et de type date et la dare de publication doit être superieur à la date actuelle

  const schema = yup.object().shape({
    titre: yup.string().required().min(3),
    auteur: yup.string().required().min(3),
    date_publication: yup.date().required().max(new Date())
  });
  try {
    await schema.validate(req.body);
    next();
  } catch (err) {
    res.status(400).send(err.errors);
  }
};

module.exports = validate;
