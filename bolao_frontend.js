window.addEventListener('load', function(){
  var usingInfura = false;
  //The 5 lines allows to use Metamask or Mist if available (but it will use Infura otherwise)
  if(typeof web3 !== 'undefined'){
      web3 = new Web3(web3.currentProvider);
      console.log('Metamask or Mist');
  } else {
      usingInfura = true;
      web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/kBS44cnyBoAqsoZrECz0"));
      console.log('Infura'); 
  }
  //Testar se eh ropsten (colocar em no rikenby tb?)
  //Bellow is the ABI of the voting contract
  abi = JSON.parse('[{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"paises","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"pais","type":"bytes32"}],"name":"informarPaisGanhador","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalApostado","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"qualValorDoTicket","outputs":[{"name":"amount","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"nomeBolao","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"pais","type":"bytes32"}],"name":"aposteiEm","outputs":[{"name":"apostou","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"tempoParaDevolerSeOCriadorDesaparecer","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"paisValido","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"premio","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"paisGanhador","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"endereco","type":"address"},{"name":"pais","type":"bytes32"}],"name":"apostadoEm","outputs":[{"name":"amount","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"pais","type":"bytes32"}],"name":"aposta","outputs":[{"name":"success","type":"bool"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"jahFoiPago","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"apostadoresNoPais","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"aindaDaTempoDeApostar","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"tempoFinalDoBolao","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"criadorDoBolaoDesapareceuQueroMeuDinheiroDeVolta","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"quantosPaises","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"bytes32"}],"name":"enderecoApostadoEm","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"paisGanhadorInformado","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"pais","type":"bytes32"}],"name":"adicionarPais","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"valorTicket","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"devolverPorqueNinguemGanhou","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"receberPremio","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"nomeDoBolaoInput","type":"bytes32"},{"name":"faltaQuantoProFinalEmMinutos","type":"uint256"},{"name":"tempoParaDevolerSeOCriadorDesaparecerInput","type":"uint256"},{"name":"valorTicketInput","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"}]');

  bolaoContract = web3.eth.contract(abi);
  // In your nodejs console, execute contractInstance.address to get the address at which the contract is deployed and change the line below to use your deployed address
  contractInstance = bolaoContract.at('0x4f9f7a7d4702993d502809d442a3ffa0e989eebe');
  comecou()
})

//In future, read the contract in order to get the names below
candidates = {"Belo Horizonte": "candidate-1", "Recife": "candidate-2", "Rio de Janeiro": "candidate-3", "Sao Paulo": "candidate-4"}

function comecou()
{
abi = JSON.parse('[{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"paises","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"pais","type":"bytes32"}],"name":"informarPaisGanhador","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalApostado","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"qualValorDoTicket","outputs":[{"name":"amount","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"nomeBolao","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"pais","type":"bytes32"}],"name":"aposteiEm","outputs":[{"name":"apostou","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"tempoParaDevolerSeOCriadorDesaparecer","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"paisValido","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"premio","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"paisGanhador","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"endereco","type":"address"},{"name":"pais","type":"bytes32"}],"name":"apostadoEm","outputs":[{"name":"amount","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"pais","type":"bytes32"}],"name":"aposta","outputs":[{"name":"success","type":"bool"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"jahFoiPago","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"apostadoresNoPais","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"aindaDaTempoDeApostar","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"tempoFinalDoBolao","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"criadorDoBolaoDesapareceuQueroMeuDinheiroDeVolta","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"quantosPaises","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"bytes32"}],"name":"enderecoApostadoEm","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"paisGanhadorInformado","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"pais","type":"bytes32"}],"name":"adicionarPais","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"valorTicket","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"devolverPorqueNinguemGanhou","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"receberPremio","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"nomeDoBolaoInput","type":"bytes32"},{"name":"faltaQuantoProFinalEmMinutos","type":"uint256"},{"name":"tempoParaDevolerSeOCriadorDesaparecerInput","type":"uint256"},{"name":"valorTicketInput","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"}]');

  bolaoContract = web3.eth.contract(abi);
  // In your nodejs console, execute contractInstance.address to get the address at which the contract is deployed and change the line below to use your deployed address
  contractInstance = bolaoContract.at('0x4f9f7a7d4702993d502809d442a3ffa0e989eebe');



//  document.getElementById('nomeBolao2').innerHTML = "Nome do Bolao: " + hex2a(contractInstance.nomeBolao());

//  let valTemp = contractInstance.nomeBolao.call(name, function(error,result){
  let valTemp = contractInstance.nomeBolao(function(error,result){
    if(!error)
      console.log(result)
    else
      console.error(error);
    document.getElementById('nomeBolao').innerHTML = "Nome do Bolao: " + hex2a(result);
  });


//document.getElementById('nomeBolao2').innerHTML = "NNum " + hex2a(contractInstance.nomeBolao());
  let valTemp2 = contractInstance.quantosPaises(function(error,result){
    if(!error)
      console.log(result)
    else
      console.error(error);
    document.getElementById('nomeBolao2').innerHTML = "Ha: " + result +" paises.";

    for(var i=0; i < result; i++) {
      let valTemp3 = contractInstance.paises(i,function(error,result){
        if(!error)
          console.log(result)
        else
          console.error(error);
        document.getElementById('tabela1').innerHTML += '<tr> <td> <a href="#" onclick = "aposteEm(' + result.toString(16)  +')">' + hex2a(result) +"</a></td> <td> </td> </tr>";
      });
    }
  });

//document.getElementById('nomeBolao2').innerHTML += "Ha quanto mesmo: " + valTemp2 +" paises";
  

  candidateNames = Object.keys(candidates);
  for (var i = 0; i < candidateNames.length; i++) {
    let name = candidateNames[i];
//    let val = contractInstance.totalVotesFor.call(name, function(error,result){
//        if(!error)
//           console.log(result)
//        else
//           console.error(error);

        //let val2 = val.toString();
    
//        $("#" + candidates[name]).html(result+" ");
//    });
    
  }


}

function aposteEm(pais){
   console.log(pais); 
   pais_hex = parseInt(pais, 16);
   console.log(pais_hex); 
   console.log("  "+hex2a(pais_hex));
}


function hex2a(hexx) {
    var hex = hexx.toString();//force conversion
    var str = '';
    for (var i = 2; i < hex.length; i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
}



//function voteForCandidate() {
//  candidateName = $("#Cidade").val();
//  document.getElementById('Hora').innerHTML = "Sua ultima vitacao foi no momento:"+Date()+"em" + candidateName;
//  contractInstance.voteForCandidate(candidateName, {from: web3.eth.accounts[0]}, function(error, result) {
//  

//    web3.eth.getAccounts(function(error, result){
//      if(!error){
//        console.log(result);
//        console.log(result[0]);
//        contractInstance.voteForCandidate(candidateName,  {from: result[0]}, function(error2, result2) {
//          let div_id = candidates[candidateName];
//          contractInstance.totalVotesFor.call(candidateName,function(error3, result3){
//            $("#" + div_id).html(result3.toString());});
//        });
//       }
//     });
//}

