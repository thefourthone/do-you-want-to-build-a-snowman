var initStorage = function(val){
  //machines
  val = val || 0;
  localStorage.E = val; //(E)xtruder
  localStorage.P = val; //(P)ulverizer
  localStorage.S = val; //(S)ifter
  localStorage.U = val; //F(U)rnace
  localStorage.G = val; //(G)enerator
  localStorage.T = val; //(T)ree Farm
  localStorage.D = val; //(D)eHydrator
  localStorage.F = val; //(F)reezer
  
  //building
  localStorage.C = val; //(C)hest
  localStorage.I = val; //(I)nput
  localStorage.O = val; //(O)utput
  
  //Items
  localStorage.r = val; //(r)ock
  localStorage.w = val; //(w)ood
  localStorage.h = val; //(h)2o
  localStorage.t = val; //(t)ree
  localStorage.o = val; //(o)re
  localStorage.i = val; //(i)ron
  localStorage.c = val; //(c)opper
  localStorage.g = val; //(g)ravel
  localStorage.p = val; //(p)ower
  localStorage.s = val; //(s)now
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
  '(D)ehydrator' + ':' + localStorage.T + '\n' +
  '(F)reezer'    + ':' + localStorage.F + '\n';
  
  var second =
  '(C)hest'  + ':' + localStorage.C + '\n' +
  '(I)nput'  + ':' + localStorage.I + '\n' +
  '(O)utput' + ':' + localStorage.O + '\n';
  
  var last =
  '(r)ock'   + ':' + localStorage.r + '\n' +
  '(w)ood'   + ':' + localStorage.w + '\n' +
  '(h)2o'    + ':' + localStorage.h + '\n' +
  '(t)ree'   + ':' + localStorage.t + '\n' +
  '(o)re'    + ':' + localStorage.o + '\n' +
  '(i)ron'   + ':' + localStorage.i + '\n' +
  '(c)opper' + ':' + localStorage.c + '\n' +
  '(g)ravel' + ':' + localStorage.g + '\n' +
  '(p)ower ' + ':' + localStorage.p + '\n' +
  '(s)now'   + ':' + localStorage.s + '\n';

  machines.innerText = first + second;
  items.innerText = last;
};
updateStorage();


var updateConfig = function(){
  var out = "";
  for(var j = 0; j < world.machines.length;j++){
    for(var k = 0;world.machines[j] && k < world.machines[j].length;k++){
      if(world.machines[j][k]&&machines[world.machines[j][k].type]){
        var temp = world.machines[j][k];
        out += '<div>Type: ' + temp.type + ' Loc: ' + temp.x + ',' + temp.y +
        '<input id="'+temp.x+','+temp.y+'"type="text"></input></div>';
      }
    }
  }
  document.getElementById('config').innerHTML = out;
};