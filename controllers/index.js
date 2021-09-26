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
    var sessions = [];

   // var sessions = [];


    // Attendre un lien valide entre client et serveur
    io.sockets.on("connection", function (socket) {
      console.log("Client connecté")
      //console.log(socket)

      const session = socket.request.session;
      session.connections++;
      session.save();

      loopArray:
      for(const obj of sessions){
        console.log("comparaison de la session entrante avec les sessions stockées")
        console.log(socket.request.sessionID)
        console.log(obj.session)
        if(obj.session == socket.request.sessionID){
          console.log("match")
          connect(socket,obj.credentials)
          break loopArray;
        }
      }

      socket.on('login', credentials => {
        if(connect(socket,credentials)){
          sessions.push({session: socket.request.sessionID , credentials : credentials})
          console.log("enregistrement de la session ")
          console.log(socket.request.sessionID)
        }


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

      socket.on('disconnectaccount', () => {
        for(s of sessions){
          if(s.session == socket.request.sessionID){
            sessions.splice(sessions.indexOf(s),1)
          }
        }
        socket.emit('disconnectaccount')
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

  function connect(socket,credentials){ 
    let idCompte = login(credentials)
    //console.log(idCompte)
    if(idCompte == -1){
      socket.emit('loginfail')
      return 0;
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

    return 1;
  }
};



