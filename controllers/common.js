// common.js - controlleur

    /* Partie du programme qui s'exécute au démarrage */
exports.setModules = function () {
var   NA = this;
      NA.fs = require('fs')


let rawdata = NA.fs.readFileSync('playerdata.json');
NA.playerData = JSON.parse(rawdata);

let rawdatacomptes = NA.fs.readFileSync('comptes.json');
NA.comptes = JSON.parse(rawdatacomptes);

};

exports.setSessions = function (next) {
  var NA = this;

  NA.storedSessionId = null;

  next();
};