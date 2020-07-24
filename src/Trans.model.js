const sql = require("./db.js");

  const ClientTrans = function(clientTrans) {
    this.NumTrans = clientTrans.NumTrans;
    this.CodeDocument = clientTrans.CodeDocument;
    this.CodeFP = clientTrans.CodeFP;
    this.IdClient  = clientTrans.IdClient;
    this.DateTrans = clientTrans.DateTrans;
    this.DateCreate = clientTrans.DateCreate;
    this.UserCreate  = clientTrans.UserCreate ;
  };

  ClientTrans.create = (newTrans, result) => {
    sql.query("INSERT INTO ClientTrans SET ?", newTrans, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
      }
    });
  };

  module.exports = ClientTrans;