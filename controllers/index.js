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

    var clients = [];


    // Attendre un lien valide entre client et serveur
    io.sockets.on("connection", function (socket) {
      console.log("Client connecté")
      socket.on('login', credentials => {
        let idCompte = login(credentials)
        //console.log(idCompte)
        if(idCompte == -1){
          socket.emit('loginfail')
          return;
        }
        socket.emit('loginsucceed');

        clients.push({compteID : idCompte,socket : socket});
        
        //console.log('envoi des données des joueurs:')
        //console.log(NA.playerData)

        //console.log(NA.playerData[idCompte])
        socket.emit('playerdata',NA.playerData[idCompte]);
        
        socket.on('playerdata',function(data){
          console.log(data);

          NA.playerData[idCompte] = data;

          clients.forEach((item,index,arr) => {
            if(item.compteID == idCompte)
              item.socket.emit('playerdata',data)
          })

          let dataJSON = JSON.stringify(NA.playerData, null, 2);
  
          NA.fs.writeFile('playerdata.json', dataJSON, (err) => {
              if (err) console.log(err);
              console.log('Data written to file');
          });
        })

      })


      socket.on('createaccount', credentials => {
        let creation = createAccount(credentials);
        if(creation == -1 || creation == -2)
          socket.emit('accountalreadyexists')
        else
          socket.emit('accountcreated')
      })


      //console.log("nouvel onglet")

      socket.on('disconnect', function(){
        console.log('client déconnecté')
      })

    });


  function login(credentials){ 
    //console.log('demande de connexion avec:')
    //console.log(credentials)
    //console.log('La liste des comptes est:')
    //console.log(NA.comptes)

    let id = -1;
    
    NA.comptes.forEach( (item,index,arr) => {
      //console.log(credentials.mdp)
      //console.log(item.mdp)
      //console.log(credentials.login)
      //console.log(item.login)

      if(credentials.mdp == item.mdp && credentials.login == item.login)
        id =  index;
      
    })

    return id;
  }

  function createAccount(credentials){
    //console.log('création du compte:')
    //console.log(credentials)

    let retour = 0;

    NA.comptes.forEach( (item,index,arr) => {
      if(credentials.login == item.login)
        retour = -2;
    })
    if(retour == -2)
      return retour;

    NA.comptes.push(credentials);

    //console.log('La liste des comptes est maintenant:')
    //console.log(NA.comptes)

    let dataJSON = JSON.stringify(NA.comptes, null, 2);

    NA.fs.writeFile('comptes.json', dataJSON, (err) => {
        if (err) retour = -1;
        //console.log('Data written to file');
        retour = 1;
    });


    return retour;

  }

};


