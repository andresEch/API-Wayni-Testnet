const sql = require("./db.js");

const Client = function(client) {
    this.DocumentNum = client.DocumentNum;
    this.Gender = client.Gender;
    this.DateCreate = client.DateCreate;
    this.UserCreate  = client.UserCreate ;
  };

  Client.create = (newClient, result) => {
    sql.query("INSERT INTO Client SET ?", newClient, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
      }
    });
  };

  Client.findByDNI = (clientDNI, result) => {
    sql.query('SELECT Distinct a.UserCreate, a.Gender, a.DocumentNum, b.CodeDocument, b.NumTrans FROM Client a, ClientTrans b WHERE a.DocumentNum=b.IdClient and a.DocumentNum = "'+clientDNI+'"', (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
      }
  
      if (res.length) {
        console.log("found customer: ", res[0].DocumentNum);
        result(null, res[0]);
      }else{
        // not found Customer with the id
        result({ kind: "not_found" }, null);
      } 
    });
    return result;
  };

  Client.findMaxId = result => {
    sql.query('SELECT MAX(a.IdClient) as IdClient FROM Client a', (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
      }
  
      if (res.length) {
        console.log("found customer: ", res[0].IdClient);
        result(null, res);
      }else{
        // not found Customer with the id
        result({ kind: "not_found" }, null);
      } 
    });
    return result;
  };
  module.exports = Client;