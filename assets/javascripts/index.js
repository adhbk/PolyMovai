// index.js - client

var bouton = document.getElementById("Bouton");

var playerData = [];
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

document.getElementById('formulaireCreation').addEventListener('submit',function(event){
  event.preventDefault();

  let player = {name : event.target.nomJoueur.value ,trou : 0 , vicetrou : 0 , neutre : 0 , vicepres : 0 , pres : 0};
  playerData.push(player);
  NA.socket.emit('playerdata',playerData);
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

/*
<table id="myTable" class="table table-borderless table-striped table-earning">
  <thead>
    <tr>
      <th>date</th>
      <th>file name</th>
    </tr>
  </thead>
  <tbody id="testBody"></tbody>
</table>
<script>
  const items1 = [
    { date: "10/17/2018", name: "john doe" },
    { date: "10/18/2018", name: "jane doe" },
  ];
  const items2 = [
    { date: "10/17/2019", name: "john doe" },
    { date: "10/18/2019", name: "jane doe" },
  ];
  function loadTableData(items) {
    const table = document.getElementById("testBody");
    items.forEach( item => {
      let row = table.insertRow();
      let date = row.insertCell(0);
      date.innerHTML = item.date;
      let name = row.insertCell(1);
      name.innerHTML = item.name;
    });
  }
  loadTableData(items1);
  loadTableData(items2);
  loadTableData([]);
</script>
*/