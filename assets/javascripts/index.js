// index.js - client

var bouton = document.getElementById("Bouton");

var playerData = [];

document.getElementById('formulaireCreationJoueur').style.visibility = "hidden"
/*
bouton.addEventListener("click", function () {
  var donnees = ["contenu exemple"];

  NA.socket.emit("appui_bouton", donnees);
});*/

NA.socket.on('playerdata',function (data){
  console.log(data);
  miseAJourData(data);
  playerData = data;
})

NA.socket.on('loginsucceed',function (){
  console.log('login successful')
  document.getElementById('formulaireCreationCompte').style.visibility = "hidden";
  document.getElementById('formulaireConnexion').style.visibility = "hidden";
  document.getElementById('formulaireCreationJoueur').style.visibility = "visible";

})

NA.socket.on('loginfail',function (){
  console.log('login failed :(')
  document.getElementById('messageConnexion').innerHTML = "Identifiants invalides";
})

NA.socket.on('accountalreadyexists',function (){
  console.log('compte existe déjà')
  document.getElementById('messageCreation').innerHTML = "Ce nom de compte est déjà pris !";
})

NA.socket.on('accountcreated',function (){
  console.log('compte créé')
  document.getElementById('messageCreation').innerHTML = "Le compte a bien été créé";
})


document.getElementById('formulaireCreationJoueur').addEventListener('submit',function(event){
  event.preventDefault();

  let player = {name : event.target.nomJoueur.value ,trou : 0 , vicetrou : 0 , neutre : 0 , vicepres : 0 , pres : 0};
  playerData.push(player);
  NA.socket.emit('playerdata',playerData);
})

document.getElementById('formulaireCreationCompte').addEventListener('submit',function(event){
  event.preventDefault();

  let credentials = {login : event.target.nomCompte.value , mdp : event.target.motDePasse.value}
  console.log('creation du compte:')
  console.log(credentials)
  NA.socket.emit('createaccount',credentials);
})

document.getElementById('formulaireConnexion').addEventListener('submit',function(event){
  event.preventDefault();

  let credentials = {login : event.target.nomCompte.value , mdp : event.target.motDePasse.value}
  console.log('creation au compte:')
  console.log(credentials)
  NA.socket.emit('login',credentials);
})

function miseAJourData(data){

  const table = document.getElementById("tableauScores");
  while (table.hasChildNodes()) {
    table.removeChild(table.lastChild);
  }
  data.forEach( (item,index,arr) => {

    let row = table.insertRow();

    let name = row.insertCell(0);
    name.innerHTML = item.name;
    name.innerHTML += '<button id="Bouton" class=" btn btn-sm btn-danger" type="button" onclick="playerData.splice('+ index + ',1); NA.socket.emit(\'playerdata\',playerData)">Delete</button>';


    let trouduc = row.insertCell(1);
    trouduc.innerHTML = item.trou;
    trouduc.appendChild(createButton(index, 'trou', +1))
    trouduc.appendChild(createButton(index, 'trou', -1))


    let viceTrouduc = row.insertCell(2);
    viceTrouduc.innerHTML = item.vicetrou;
    viceTrouduc.appendChild(createButton(index, 'vicetrou', +1))
    viceTrouduc.appendChild(createButton(index, 'vicetrou', -1))

    let neutre = row.insertCell(3);
    neutre.innerHTML = item.neutre;
    neutre.appendChild(createButton(index, 'neutre', +1))
    neutre.appendChild(createButton(index, 'neutre', -1))

    let vicePres = row.insertCell(4);
    vicePres.innerHTML = item.vicepres;
    vicePres.appendChild(createButton(index, 'vicepres', +1))
    vicePres.appendChild(createButton(index, 'vicepres', -1))

    let pres = row.insertCell(5);
    pres.innerHTML = item.pres;
    pres.appendChild(createButton(index, 'pres', +1))
    pres.appendChild(createButton(index, 'pres', -1))

    let score = row.insertCell(6);
    score.innerHTML = item.vicetrou + item.neutre*2 + item.vicepres*3 + item.pres*4;


  });
}

function createButton(field, subtamaman, inc) {
  const button = document.createElement('button');
  button.className = `btn btn-sm btn-${inc > 0 ? 'success' : 'danger'}`;
  button.type = 'button';
  button.addEventListener('click', event => {
      event.preventDefault();
      playerData[field][subtamaman] += inc;
      NA.socket.emit('playerdata', playerData)
  });
  button.textContent = inc == 1 ? "+1" : inc;

  return button;
}

