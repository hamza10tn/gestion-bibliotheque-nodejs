const http = require("http");
const express = require("express");
const mongo = require("mongoose");
const bodyParser = require("body-parser");
const mongoconnect = require("./config/dbconnection.json");
const path = require("path");
const Livre = require("./model/livre");

mongo
  .connect(mongoconnect.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("mongo connecter"))
  .catch((err) => console.log(err));


const livrerouter = require("./routes/livre");
const bibliothequerouter = require("./routes/bibliotheque");
var app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "twig");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/bibliotheque", bibliothequerouter);
app.use("/livre", livrerouter);



const server = http.createServer(app);
const io = require("socket.io")(server);


io.on("connection", (socket) => {
  console.log("Un client est connecté.");


  const sendLivresDisponibles = async () => {
    const livresDisponibles = await Livre.find({ etat: "disponible" });
    socket.emit("updateLivresDisponibles", livresDisponibles);
  };

  sendLivresDisponibles();


  socket.on("louerLivre", async (data) => {
    const livreId = data.id;

    try {

      const livre = await Livre.findById(livreId);
      if (!livre) {
        return socket.emit("error", { message: "Livre non trouvé." });
      }

      if (livre.etat === "loué") {
        return socket.emit("error", { message: "Ce livre est déjà loué." });
      }


      livre.etat = "loué";
      await livre.save();

      const bibliotheque = await Bibliotheque.findById(livre.id_bibliotheque);
      if (bibliotheque) {
        bibliotheque.nbr_livre = Math.max(bibliotheque.nbr_livre - 1, 0);
        await bibliotheque.save();
      }

      const livresDisponibles = await Livre.find({ etat: "disponible" });
      io.emit("updateLivresDisponibles", livresDisponibles);

      // Envoyer une confirmation au client
      socket.emit("success", { message: "Livre loué avec succès." });
    } catch (error) {
      console.error("Erreur lors de la location du livre:", error);
      socket.emit("error", { message: "Une erreur s'est produite." });
    }
  });





  //notif 



  // Quand un utilisateur se déconnecte
  socket.on("disconnect", () => {
    console.log("user disconnected");
    io.emit("msg", "user disconnected");
  });
});

server.listen(3000, console.log("server run"));
module.exports = app;
