var initStorage = function(){
  //machines
  localStorage.E = 0; //(E)xtruder
  localStorage.P = 0; //(P)ulverizer
  localStorage.S = 0; //(S)ifter
  localStorage.U = 0; //F(U)rnace
  localStorage.G = 0; //(G)enerator
  localStorage.T = 0; //(T)ree Farm
  localStorage.F = 0; //(F)reezer
  
  //building
  localStorage.C = 0; //(C)hest
  localStorage.I = 0; //(I)nput
  localStorage.O = 0; //(O)utput
  
  //Items
  localStorage.r = 0; //(r)ock
  localStorage.w = 0; //(w)ood
  localStorage.i = 0; //(i)ron
  localStorage.c = 0; //(c)opper
  localStorage.g = 0; //(g)ravel
  localStorage.p = 0; //(p)ower
  localStorage.s = 0; //(s)now
};

var updateStorage = function(){
  var machines = document.getElementById('machines');
  var items = document.getElementById('items');
  var first =
  '(E)xtruder'   + ':' + localStorage.E + '\n' +
  '(P)ulverizer' + ':' + localStorage.P + '\n' +
  '(S)ifter'     + ':' + localStorage.S + '\n' +
  'F(U)rnace'    + ':' + localStorage.U + '\n' +
  '(G)enerator'  + ':' + localStorage.G + '\n' +
  '(T)ree Farm'  + ':' + localStorage.T + '\n' +
  '(F)reezer'    + ':' + localStorage.F + '\n';
  
  var second =
  '(C)hest'  + ':' + localStorage.C + '\n' +
  '(I)nput'  + ':' + localStorage.I + '\n' +
  '(O)utput' + ':' + localStorage.O + '\n';
  
  var last =
  '(r)ock'   + ':' + localStorage.r + '\n' +
  '(w)ood'   + ':' + localStorage.w + '\n' +
  '(i)ron'   + ':' + localStorage.i + '\n' +
  '(c)opper' + ':' + localStorage.c + '\n' +
  '(g)ravel' + ':' + localStorage.g + '\n' +
  '(p)ower ' + ':' + localStorage.p + '\n' +
  '(s)now'   + ':' + localStorage.s + '\n';

  machines.innerText = first + second;
  items.innerText = last;
};
updateStorage();
