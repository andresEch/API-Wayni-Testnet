pragma solidity >=0.4.0 <0.7.0;

contract TrxWayni {
    

    struct Transaction {
        address beneficiary;
        address receivers;
        string identify;
        string gender;
        string docDni;
        string document;
        string checkUser;
    }
    

    mapping (address => Transaction) private Trxsave;
    

    function setData(address _sender, address _receiver, string memory identifier, string memory gen, string memory docDni, string memory document, 
        string memory checkUsers) public {
        
        Trxsave[_sender] = Transaction(_sender, _receiver,identifier,gen, docDni, document, checkUsers);
        
    }

    function getData(address _owner) public view 
    returns(address beneficiary, address receivers, string memory identify, string memory gender,
     string memory DNI, string memory document, string memory checkUser) {
        return(Trxsave[_owner].beneficiary, Trxsave[_owner].receivers, Trxsave[_owner].identify, 
            Trxsave[_owner].gender, Trxsave[_owner].docDni, Trxsave[_owner].document,
            Trxsave[_owner].checkUser);
    }
}