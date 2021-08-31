// index.js - controlleur

// On référence les actions de réponse et d'envoi globaux côté serveur.
// Ce code sera exécuté pour toute entrée WebSocket entrante.

/**
 * Recoit les messages websockets du client.
 * 
 * Connecte les boutons de l'interface avec leur fonction
 */

exports.setSockets = function () {
    var NA = this,
        path = NA.modules.path;
        io = NA.io;

    console.log("exports.setSockets");


    // Attendre un lien valide entre client et serveur
    io.sockets.on("connection", function (socket) {

      socket.emit('playerdata',NA.playerData);

      console.log("nouvel onglet")

      socket.on('disconnect', function(){
        console.log('client déconnecté')
      })

      socket.on('appui_bouton',function(donnees){
        console.log(donnees)
      })

      socket.on('playerdata',function(data){
        console.log(data);
        NA.playerData = data;
        io.emit('playerdata',data);
        let dataJSON = JSON.stringify(data, null, 2);

        NA.fs.writeFile('playerdata.json', dataJSON, (err) => {
            if (err) console.log(err);
            console.log('Data written to file');
        });
      })



    });


};


