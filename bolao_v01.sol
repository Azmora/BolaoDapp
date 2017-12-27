pragma solidity ^0.4.19;

    contract owned {
        address public owner;

        function owned() {
            owner = msg.sender;
        }

        modifier onlyOwner {
            require(msg.sender == owner);
            _;
        }

        function transferOwnership(address newOwner) onlyOwner {
            owner = newOwner;
        }
    }

contract Bolao is owned {

    uint public tempoFinalDoBolao;
    uint public tempoParaDevolerSeOCriadorDesaparecer;
    bytes32 public nomeBolao;
    uint public valorTicket; 

    uint public totalApostado = 0;
    mapping( bytes32 => uint256) public apostadoresNoPais;
    bytes32[] public paises;
    mapping (bytes32 => bool) public paisValido;


    bytes32 public paisGanhador;    
    bool public paisGanhadorInformado = false;
    bool semGanhadorDoBolao = false;
    uint public premio = 0;
    uint valorADevolver = 0;

    mapping (address => mapping (bytes32 => bool)) public enderecoApostadoEm;
    mapping (address => bool) public jahFoiPago;


/**
     * Constrctor function
     *Lembre-se 1 ether = 1e18 wei
     * 
     */
    function Bolao(
	bytes32 nomeDoBolaoInput,
	uint faltaQuantoProFinalEmMinutos ,
	uint tempoParaDevolerSeOCriadorDesaparecerInput,
	uint valorTicketInput
    ) public {
	nomeBolao = nomeDoBolaoInput;
	tempoFinalDoBolao = now + faltaQuantoProFinalEmMinutos * 1 minutes; 
	tempoParaDevolerSeOCriadorDesaparecer = tempoParaDevolerSeOCriadorDesaparecerInput * 1 minutes;
	valorTicket = valorTicketInput;  
    }

    function adicionarPais( bytes32 pais) onlyOwner public returns (bool success){
        uint id = 0;
        id = paises.length++;
        paises[id] = pais;
        paisValido[pais] = true;
        return true;
    }

//    function paisValido(bytes32 candidate) view public returns (bool) {
//      for(uint i = 0; i < paises.length; i++) {
//        if (paises[i] == candidate) {
//            return true;
//        }
//      }
//        return false;
//   }  
    

    function aposta(bytes32 pais) payable public returns (bool success){
	require( paisValido[pais]                         //Se o pais estah na Copa
		&& now < tempoFinalDoBolao               //Se eh antes do fim
		&& !enderecoApostadoEm[msg.sender][pais]    //Se jï¿½ apostou
		&& msg.value == valorTicket);            //Se o dinheiro eh exato (dar troco?) (aceitar a mais?)

	enderecoApostadoEm[msg.sender][pais] = true;
	apostadoresNoPais[pais] += 1;	
	totalApostado += 1;
	return true;

    }

    function aposteiEm(bytes32 pais) constant public returns (bool apostou){
	  return enderecoApostadoEm[msg.sender][pais];
    }

    function qualValorDoTicket() constant public returns (uint256 amount){
      return valorTicket;
    }


    function apostadoEm(address endereco, bytes32 pais) public constant returns (bool amount){
	  return enderecoApostadoEm[endereco][pais];
    }

    function informarPaisGanhador(bytes32 pais) onlyOwner public returns (bool success){
	  require (now >= tempoFinalDoBolao);
	  paisGanhador = pais;
	  paisGanhadorInformado = true;
	  if(apostadoresNoPais[pais] > 0){
  		premio = this.balance / apostadoresNoPais[pais];
      } else 
      {
		valorADevolver = this.balance / totalApostado;
		semGanhadorDoBolao = true;
      }
	  return true;
    }

    function receberPremio() public returns (bool success){
	require(paisGanhadorInformado 
		&& enderecoApostadoEm[msg.sender][paisGanhador] 
		&& !jahFoiPago[msg.sender]);
	jahFoiPago[msg.sender] = true;
	msg.sender.send(premio); // sends ether to the seller: it's important to do this last to prevent recursion attacks
	return true;
    }

    function devolverPorqueNinguemGanhou() public returns (bool success){
	require(semGanhadorDoBolao 
		&& !jahFoiPago[msg.sender]);
	jahFoiPago[msg.sender] = true;
	msg.sender.send(valorADevolver); // sends ether to the seller: it's important to do this last to prevent recursion attacks
	return true;
    }

    function criadorDoBolaoDesapareceuQueroMeuDinheiroDeVolta() public returns (bool success){
	require(!paisGanhadorInformado 
		&& now > tempoFinalDoBolao + tempoParaDevolerSeOCriadorDesaparecer
		&& !jahFoiPago[msg.sender]);
	jahFoiPago[msg.sender] = true;
	msg.sender.send(valorTicket); 
	return true;
    }
    
    function aindaDaTempoDeApostar() public constant returns (bool){
        return (now <= tempoFinalDoBolao);
    }
    
    function quantosPaises() public constant returns (uint){
        return paises.length;
    }
	
}
