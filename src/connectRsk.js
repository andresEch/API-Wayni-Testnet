const Web3 = require('web3');
const Tx = require('ethereumjs-tx');
const Txy = require('ethereumjs-tx');
const express = require('express');

const getClient = () => {
 var client = new Web3();
 client.setProvider(new client.providers.HttpProvider("https://public-node.testnet.rsk.co"));
 return client;
};
var Trx;

var abi = [
  {
    "constant": false,
    "inputs": [
      {
        "internalType": "address",
        "name": "_sender",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_receiver",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "identifier",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "gen",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "docDni",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "document",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "checkUsers",
        "type": "string"
      }
    ],
    "name": "setData",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "internalType": "address",
        "name": "_owner",
        "type": "address"
      }
    ],
    "name": "getData",
    "outputs": [
      {
        "internalType": "address",
        "name": "beneficiary",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "receivers",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "identify",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "gender",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "DNI",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "document",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "checkUser",
        "type": "string"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  }
];

var contract_Address = "0x9156E49474249337c4B6D727bc7EC588b3374581";

async function CreateAccountAndTx(PKUID, genero, DNI, Document, Check) {
    var client = getClient();
    var newAccount = await client.eth.accounts.create(DNI);
    var account1 = newAccount.address; // Your account address 1
    var account2 = '0x6501e552757b4D48a1930E947c164F22ddDDF807'; // Your account address 2
    var pkey = '99100e73ad088dcdc0250e4e352705d424e0b7eae38697504a2966278d1ac881';
    
    var privateKey1 = newAccount.privateKey;
    // web3.eth.defaultAccount = account1;
    /* txCount = await web3.eth.getTransactionCount(account2, 'pending');
        // Build the transaction
        var txObject = {
            nonce:    web3.utils.toHex(txCount),
            to:       account1,
            value:    web3.utils.toHex(500000000000000),
            gasLimit: web3.utils.toHex(21000),
            gasPrice: web3.utils.toHex(80000000),
            data: 0,
            chainId: 31
        }
            // Sign the transaction
            var tx1 = new Tx(txObject);
            var prueba = tx1.sign(new Buffer(pkey,'hex'));

            console.log(prueba);
    
            var serializedTx = tx1.serialize();
            var raw = serializedTx.toString('hex');
    
            // Broadcast the transaction
            //var transaction = await web3.eth.sendSignedTransaction(raw);  
            var transaction = await web3.eth.sendSignedTransaction(raw, function(err, hash) {
              if (!err)
                  {
                    console.log('Txn Sent and hash is '+hash);
                  }
              else
                  {
                    console.error(err);
                  }
                });              
            console.log("entro2"); */

            const rawTx = {
              nonce: await client.eth.getTransactionCount(account2),
              gasPrice: client.utils.toHex(80000000),
              gasLimit: client.utils.toHex(30000),
              to: account1,
              data: null,
              value: client.utils.toHex(500000000000000)
              }
              const privateKey = new Buffer(pkey, 'hex');
              console.log(JSON.stringify(rawTx, null, 2));
              const tx = new Tx(rawTx);
              tx.sign(privateKey);
             
              const receipt = await client.eth.sendSignedTransaction('0x' + tx.serialize().toString('hex'));
              console.log(`tx: "${receipt.transactionHash}". result: ${receipt.status ? 'OK' : 'error'}\n`);

        Trx = await transContract(account1, account2, privateKey1,PKUID, genero, DNI, Document, Check);
        return Trx;
        
};

async function transContract(account1, account2, privateKey1, PKUID, genero, DNI, Document, Check){
  var client = getClient();
    var contract = new client.eth.Contract(abi, contract_Address);

    var myData = contract.methods.setData(account1, account2, PKUID, genero, DNI, Document, Check).encodeABI();
    
    // Build the transaction
    var txObject = {
        nonce:    await client.eth.getTransactionCount(account1),
        to:       contract_Address,
        value:    0,
        gasLimit: client.utils.toHex(200000),
        gasPrice: client.utils.toHex(80000000),
        data: myData  
    }
        // Sign the transaction
        var tx2 = new Txy(txObject);
        console.log(JSON.stringify(txObject, null, 2));
        tx2.sign(new Buffer(privateKey1.substring(2,66), 'hex'));

        var serializedTx = tx2.serialize();
        var raw = serializedTx.toString('hex');

        // Broadcast the transaction
        var transaction = await client.eth.sendSignedTransaction(raw)
        console.log(transaction.transactionHash);
        return transaction.transactionHash;
}

async function SearchTx(trx){
  var client = getClient();
  var responseP = { AccountClient: '', AccountWayni: '', PKUID: '', genero: '', Document: '', CheckUser: '', date: '' };
    var trans = await client.eth.getTransaction(trx);
    var contract = new client.eth.Contract(abi, contract_Address);
    var myData = await contract.methods.getData(trans.from).call();
    console.log(myData.DNI);
    responseP = { AccountClient: myData.beneficiary, AccountWayni: myData.receivers, PKUID: myData.identify, 
      genero: myData.gender, Document: myData.DNI, CheckUser: myData.CheckUser, date: new Date() };
    return responseP;
}


module.exports = {
    CreateAccountAndTx: CreateAccountAndTx,
    SearchTx: SearchTx
}



