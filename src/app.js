const express = require("express");
const bodyParser = require('body-parser');
const router = express.Router();
const app = express();
const ClientTrx = require("./ClientTrans.model.js");
const Trx = require("./Trans.model");
const Rsks = require("./connectRsk");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

let PKID = '';
let gen= '';
let Document= '';
let Site= '';
let Checkin= '';
var clientid= '';
let trxDet= '';

let responseP = { PKUID: '', Trx: '', DNI: 0 };
let responseP2 = { PKUID: '', gender: '', DocumentNum: '', CodeDocument: '', Trx: ''};
let responseN = { CodeError: 0, Descrip: '' };

   app.get('/TrxWayni', function (req, res) {
        responseN = {
            CodeError: 1, Descrip: 'No se admite GET' 
        };
     res.send(responseN);
    });
    app.post('/TrxWayni', async function (req, res) {
     if(!req.body.PKUID || !req.body.genero || !req.body.DNI || !req.body.Document || !req.body.Check) {
        responseN = {
            CodeError: 1, Descrip: 'Debe agregar todos los campos, todos son obligatorios' 
        };
        res.send(req.body);
     } else {
        PKID = req.body.PKUID;
        gen = req.body.genero;
        Document = req.body.DNI;
        Site = req.body.Document;
        Checkin = req.body.Check;
        
        var trans = await Rsks.CreateAccountAndTx(PKID, gen, Document, Site, Checkin);

        var datetime = new Date();

        const client = new ClientTrx({
            DocumentNum: Document,
            Gender: gen,
            DateCreate: datetime,
            UserCreate: PKID
          });

          ClientTrx.create(client, (err, data) => {
            if (err)
              res.status(500).send({
                message:
                  err.message || "Some error occurred while creating the client."
              });
          });

          /* ClientTrx.findMaxId((err,data) => {
            if (err)
              res.status(500).send({
                message:
                  err.message || "Error al devolver el ultimo cliente creado"
              });
              else clientid = data[0].IdClient;
            }); */

            const transW = new Trx({
              NumTrans: trans,
              CodeDocument: Site,
              CodeFP: Checkin,
              IdClient: parseInt(Document),
              DateTrans: datetime,
              DateCreate: datetime,
              UserCreate: PKID
            });

          Trx.create(transW, (err, data) => {
            if (err)
              res.status(500).send({
                message:
                  err.message || "Some error occurred while creating the Trans."
              });
          });
          
        responseP = { PKUID: PKID, Trx: trans, DNI: Document };
        res.send(responseP);
      }
     
     
    });

    app.get('/GetTrxGen', function (req, res) {
      if(!req.query.DNI) {
        responseN = {
            CodeError: 1, Descrip: 'Debe agregar todos los campos, todos son obligatorios' 
        };
        res.send(responseN);
      }else {
        Document = req.query.DNI;
        console.log(req.query.DNI);
        ClientTrx.findByDNI(Document,(err,data) => {
          if (err)
            res.status(500).send({
              message:
                err.message || "No existe el cliente"
            });
            else{
              responseP2 = { PKUID: data.UserCreate, gender: data.Gender, DocumentNum: data.DocumentNum, CodeDocument: data.CodeDocument, Trx: data.NumTrans};
              res.send(responseP2);
            } 
          });
      }
  });

  app.get('/GetTrxDet', async function (req, res) {
    if(!req.query.Trx) {
      responseN = {
          CodeError: 1, Descrip: 'Debe agregar todos los campos, todos son obligatorios' 
      };
      res.send(responseN);
    }else {
      trxDet = req.query.Trx;
      var trans = await Rsks.SearchTx(trxDet);
      res.send(trans);
    }
});
    
   app.use(function(req, res, next) {
    responseN = {
        CodeError: 1, Descrip: 'Servicio no encontrado' 
    };
    res.status(404).send(responseN);
   });

   module.exports = app;
 