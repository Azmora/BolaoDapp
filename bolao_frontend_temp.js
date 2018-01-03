//variaveis globais
var paises =[];//criando uma array vazia
var paisesToString32 =[];//
var paises_direto =[];//
var numDePaises = 0;
var p = [];
var apostasNoPais = {};
var apostasNoPaisEndereco = {};
var usingInfura = false;

window.addEventListener('load', function(){
  //Injecting web3j to interact with the blockchain

  if(typeof web3 !== 'undefined'){
      web3 = new Web3(web3.currentProvider);
      console.log('Metamask or Mist');
  } else {
      usingInfura = true;
      web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/kBS44cnyBoAqsoZrECz0"));
      console.log('Infura'); 
  }
  
  abi = JSON.parse(contract_abi());
  bolaoContract = web3.eth.contract(abi);
  contractInstance = bolaoContract.at('0x4f9f7a7d4702993d502809d442a3ffa0e989eebe');
 
 comecou()
})

function comecou()
{
//Dizendo o nome do Bolao
  contractInstance.nomeBolao(function(error,result){
    if(error){ console.error(error); } else { 
      document.getElementById('nomeBolao').innerHTML += hex2a(result);
    } 
  });

  //Dizendo o valor da aposta
  contractInstance.qualValorDoTicket(function(error,result){
    if(error){ console.error(error); } else { 
      document.getElementById('valorAposta').innerHTML += result.dividedBy('1e18') + " Ethers";
    } 
  });

  //Dizendo o tempo
  //Ha varios testes possiveis aqui (em particular, a questao do timezone)
  contractInstance.tempoFinalDoBolao(function(error,result){
    if(error){ console.error(error); } else { 
      var dataFim = new Date(result.toNumber()*1000); 
      var day = dataFim.getDate(); var month = dataFim.getMonth() + 1; year = dataFim.getFullYear();
      var hour = dataFim.getHours(); var min = dataFim.getMinutes();
      document.getElementById('dataHora').innerHTML += "dia "+ day + "/" + month  + "/" +year +" até as " +hour +":"+min  +" hs.";
      //document.getElementById('tempoBolao').innerHTML += ". Obs: A hora é dada de acordo com a zona de tempo dado pelo seu Browser.";
      web3.eth.getBlockNumber(function(error2, result2){ 
        console.log(result);
        //document.getElementById('tempoBolao').innerHTML += "O bolao acaba no Bloco: " + result + " e o bloco atual é:" + result2;
      });
    } 
  });


//Dizendo quanto paises estao no Bolao
  promiseNumDePaises = new Promise(function(resolve,reject){
    let valTemp2 = contractInstance.quantosPaises(function(error,result){
      if(error) console.error(error); else{
//        console.log(result);
        numDePaises = result;
        document.getElementById('qttdPaises').innerHTML += result +".";
        resolve(result);
      } //end if
    }); //end contractInstance.quantosPaises    
  });   //end promiseNumDePaises

//Obtendo os paises do Bolao
  promiseNumDePaises.then(function(response,reject){
    for(var i=0; i < numDePaises; i++) {
      p[i] = new Promise(function(resolve, reject){
	contractInstance.paises(i,function(error,result){
          if(error){
            console.error(error); 
            reject(error);
          } else {
            paises[paises.length]= result.toString(32);
            
//          console.log(hex2a(result));
            contractInstance.apostadoresNoPais(hex2a(result),function(error,result2){
              apostasNoPais[result.toString(32)] = result2.toNumber();
//            console.log(apostasNoPais[hex2a(result)]); console.log(hex2a(result));
              resolve(1);
            });//end contract method (most internal)
          }
        });//end contract method
      });//end Promise
    }//end for

    Promise.all(p).then(function(response,rejection)  {
      paises.sort();
      for(var i=0; i < numDePaises; i++) {
        document.getElementById('tabela1').innerHTML += '<tr> <td> <a href="#" onclick = "aposteEm( \'' 
        + paises[i] +'\' )" id="a' + i  +'">'
        + hex2a(paises[i])+"</a></td> <td>"+ apostasNoPais[paises[i]] +" </td> </tr>";

        console.log('<tr> <td> <a href="#" onclick = "aposteEm( \'' 
        + paises[i] +'\' ) id="a' + i  +'">'
        
        //+ paises[i] +'\' ) id="' + paises[i] +'">'
        + hex2a(paises[i])+"</a></td> <td>"+ apostasNoPais[paises[i]] +" </td> </tr>");
       
      }//end for
        if(!usingInfura)
        {
          console.log("Deve colocar onde o usuario apostou");
          usuarioApostouEm();
        }

    });//end Promise.all(p)

  });//end then promiseNumDePaises

}

function enderecoApostadoEmForm(){
console.log("entrou em enderecoApostouEmForm()");
  address = document.getElementById("enderecoApostouOnde").value;
  enderecoApostouEm(address, " (*) ");
}

function enderecoApostouEm(address, simbolo)
{
  console.log("entrou em enderecoApostouEm(address)");
    console.log(address);

  for(var i=0; i < numDePaises; i++) {
    
    //console.log("Iteracao " + i + " " + paises[i]);
    escopoCorretoAcima(address, paises[i],i,simbolo);
  }//end for
}
//Mudar o nome da funcao
function escopoCorretoAcima(address, pais,i,simbolo){
  var a5 = "a"+i;
  //a5 = "nomeBolao";
  console.log(a5);
  contractInstance.apostadoEm(address, pais,function(error, result){
      if(error){
      console.log("Deu erro");
        console.log(error);
      }
        else
      {      
        if(result){
          console.log(pais);
          console.log(typeof pais);
          console.log(result);
          a2 = document.getElementById(a5);
          console.log(typeof a2);
          console.log(a2);

          a2.innerHTML += simbolo;

        } else{
          console.log("Nao entrou na iteracao de" + pais);
        }//if interno
      }//if mais externo
    });//end contract method s

}

//Sua ultima Aposta
function usuarioApostouEm(){
   web3.eth.getAccounts(function(error, result){
     if(!error){
       console.log(result);
       console.log(result[0]);
       //usar como valor, o valor do ticket
       enderecoApostouEm(result[0], " (Apostado por você)");
     }   
   }); 
}


//Funcao para apostar
function aposteEm(pais){
   console.log("Apostando em " + hex2a(pais)); 
   pais_hex = parseInt(pais, 32);
   web3.eth.getAccounts(function(error, result){
     if(!error){
       console.log(result);
       console.log(result[0]);
       //usar como valor, o valor do ticket
       contractInstance.aposta(pais, {from: result[0], value: 1000000000000000 }, function(error2, result2) {
         if(!error2){
           console.log("apostou...");
         } else {
           console.log("Deu algum Erro...");
         }
       });
     }   
   }); 
}


function hex2a(hexx) {
    var hex = hexx.toString();//force conversion
    var str = '';
    for (var i = 2; i < hex.length; i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
    }
    
function contract_abi(){
   return '[{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"paises","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"pais","type":"bytes32"}],"name":"informarPaisGanhador","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalApostado","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"qualValorDoTicket","outputs":[{"name":"amount","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"nomeBolao","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"pais","type":"bytes32"}],"name":"aposteiEm","outputs":[{"name":"apostou","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"tempoParaDevolerSeOCriadorDesaparecer","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"paisValido","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"premio","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"paisGanhador","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"endereco","type":"address"},{"name":"pais","type":"bytes32"}],"name":"apostadoEm","outputs":[{"name":"amount","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"pais","type":"bytes32"}],"name":"aposta","outputs":[{"name":"success","type":"bool"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"jahFoiPago","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"apostadoresNoPais","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"aindaDaTempoDeApostar","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"tempoFinalDoBolao","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"criadorDoBolaoDesapareceuQueroMeuDinheiroDeVolta","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"quantosPaises","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"bytes32"}],"name":"enderecoApostadoEm","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"paisGanhadorInformado","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"pais","type":"bytes32"}],"name":"adicionarPais","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"valorTicket","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"devolverPorqueNinguemGanhou","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"receberPremio","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"nomeDoBolaoInput","type":"bytes32"},{"name":"faltaQuantoProFinalEmMinutos","type":"uint256"},{"name":"tempoParaDevolerSeOCriadorDesaparecerInput","type":"uint256"},{"name":"valorTicketInput","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"}]';
}


function filtrando() {
    var input, filter, tr, th, a, i;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    tr = document.getElementById("tabela1");
    th = tr.getElementsByTagName("tr");
    //console.log(th.length);
    for (i = 0; i < th.length; i++) {
        a = th[i].getElementsByTagName("a")[0];
        if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
            th[i].style.display = "";
        } else {
            th[i].style.display = "none";
        }
    }
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


/*

promiseNumDePaises.then(function(response,reject){
    for(var i=0; i < numDePaises; i++) {
      console.log("loop: " + i.toString());
      p[i] = new Promise(function(resolve, reject){
	let valTemp3 = contractInstance.paises(i,function(error,result){
          if(error) console.error(error); else {
            document.getElementById('tabela1').innerHTML += '<tr> <td> <a href="#" onclick =    "aposteEm( \'' + result.toString(32)  +'\' )">' + hex2a(result)+"</a></td> <td> </td> </tr>";
            paises[paises.length]= hex2a(result);//String certinho
            paisesToString32.push(result.toString(32));//string com o codigo hex
            paises_direto.push(result);//string com o codigo hex
            console.log("deve vir antes in loop");
            resolve(1);
          }
        });//end contract method
      });//end Promise
    }//end for

*/
