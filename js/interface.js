/*World Format: items   -> array of {x,y,dy,dx,char}
                field -> array of array of chars that represent deflectors, empty cells, or machines*/
var world = {};
world.items    = [];
world.machines = [];
world.field = [];

/*Runs physics for one timestep given small time increments (dt)*/

var iterate = function(){
  var t = 0;
  return function(world,dt){
    t += dt;
    if(t >= TIMESTEP){                             //if past timestep take one step
      t -= TIMESTEP;
      var toDel = [];
      for(var i = 0; i < world.items.length;i++){  //update foreach item
        world.items[i].x += world.items[i].dx;
        world.items[i].y += world.items[i].dy;
        if(world.field[world.items[i].y][world.items[i].x] !== BLANK){ //If cell is deflector or machine, it needs special attention
          var cell = world.field[world.items[i].y][world.items[i].x];  //For simplicity
          
          if(cell === 'C' && machines[cell].filter(world.items[i],world.machines[world.items[i].x][world.items[i].y])){   //Move items into chest
            toDel.push(i);
            world.machines[world.items[i].x][world.items[i].y].inv.push(world.items[i]);
          }
          
          if(cell === UP){         //handle arrows
            world.items[i].dy = -1;
            world.items[i].dx =  0;
          }else if(cell === DOWN){
            world.items[i].dy =  1;
            world.items[i].dx =  0;
          }else if(cell === LEFT){
            world.items[i].dy =  0;
            world.items[i].dx = -1;
          }else if(cell === RIGHT){
            world.items[i].dy =  0;
            world.items[i].dx =  1;
          }
          //change velocity based on /\-|
        }
      }
      for(var j = 0; j < world.machines.length;j++){                          //for every machine run the iterate function
        for(var k = 0;world.machines[j] && k < world.machines[j].length;k++){
          if(world.machines[j][k]&&machines[world.field[k][j]]){
            machines[world.field[k][j]].iterate(world.machines[j][k]);
          }
        }
      }
      for(var h = toDel.length-1;h >= 0; h--){ //delete items picked up by the chests
        world.items.splice(toDel[h],1);
      }
    }
  };
}();

/*Renders a game world*/
var render = function(world){
  var out = [];
  for(var j = 0; j < world.field.length;j++){   //Deep Copy
    out[j] = world.field[j].slice(0);
  }
  for(var i = 0; i < world.items.length;i++){   //update foreach item
    out[world.items[i].y][world.items[i].x] = world.items[i].char; //overwrite an item on the background
  }
  for(j = 0; j < world.field.length;j++){       //combine into string[]
    out[j] = out[j].join('');
  }
  return out.join('\n');                        //combine into string
};

//TODO: Clean this part up
var prevTime = 0;
var loop = function(){
  var curTime = Date.now();
  var deltaTime = curTime - prevTime;
  prevTime = curTime;
  iterate(world,deltaTime/1000);
  main.innerText = render(world);
  updateStorage();
  requestAnimationFrame(loop);
};
var init = function(){
  prevTime = Date.now();
  loop();
};

var run = function(){
  var field = grabData(main);                 //Pull cells of the div
  for(var i = 0; i < field.length;i++){
    field[i] = field[i].split('');
  }
  //updateConfig();
  for(var j = 0; j < world.machines.length;j++){
    for(var k = 0;world.machines[j] && k < world.machines[j].length;k++){
      if(world.machines[j][k]&&machines[world.machines[j][k].type]){
        var temp = world.machines[j][k];
        temp.config = config(temp.type,document.getElementById(temp.x+','+temp.y).value);
      }
    }
  }
  world.field = field;
  
  init();                                    //Start the simulation
};
var makeMachine = function(char,x,y){
  if(machines[char]){           //find if it is a machine
    if(!world.machines[x]){     //then make sure there is a place to put it
      world.machines[x]=[];
    }
    world.machines[x][y]={x:x,y:y,type:char,inv:[]};//then put it there
  }
};
var config = function(type,value){
  if(type === 'C' || type === 'I'){
    if(!value){
      value = 'rwhtoicgps';
    }
    return value;
  }
  var DEFAULT = [{x:-1,y:0},{x:1,y:0}];
  var map = {LEFT:{x:-1,y:0},RIGHT:{x:1,y:0},UP:{x:0,y:-1},DOWN:{x:0,y:1}};
  if(!value){
    return DEFAULT;
  }
  var temp = value.split(',');
  var out = DEFAULT;
  if(map[temp[0]]){
    out[0] = map[temp[0]];
  }
  if(map[temp[1]]){
    out[1] = map[temp[1]];
  }
  return out;
};
var machines = {C:{filter:function(item,state){return state.config.search(item.char) > -1},iterate:function(state){}},
                E:{iterate:function(state){
                  if(state.i){
                    state.i++;
                    if(state.i > 5){
                      machines.throw(state,{char:'r'});
                      state.i = 0;
                    }
                  }else{
                    state.i = 1;
                  }
                }},
                P:{iterate:function(state){
                  if(state.i){
                    state.i++;
                    if(state.i >= 5){
                      machines.throw(state,{char:'g'});
                      state.i = 0;
                    }
                  }else if(machines.craft(state,{r:1})){  //maybe redefine inv?
                    state.i = 1;
                  }
                }},
                S:{iterate:function(state){
                  if(state.i){
                    state.i++;
                    if(state.i === 4){
                      machines.throw(state,{char:'o'});
                      state.i = 0;
                    }
                  }else if(machines.craft(state,{g:1})){  //maybe redefine inv?
                    state.i = 1;
                  }
                }},
                U:{iterate:function(state){
                  if(state.i){
                    state.i++;
                    if(state.i === 5){
                      if(Math.random() > 0.75){
                        machines.throw(state,{char:'c'});
                      }
                    }
                    if(state.i >= 6){
                      if(Math.random() > 0.65){
                        machines.throw(state,{char:'i'});
                      }
                      state.i = 0;
                    }
                    return;
                  }else if(machines.craft(state,{o:1})){  //maybe redefine inv?
                    state.i = 1;
                  }
                }},
                T:{iterate:function(state){
                  if(state.i){
                    state.i++;
                    if(state.i >= 10 && state.i < 15){
                      if(Math.random() > 0.75){
                        machines.throw(state,{char:'t'});
                      }
                    }
                    if(state.i >= 15){
                      if(Math.random() > 0.65){
                        machines.throw(state,{char:'w'});
                      }
                    }
                    if(state.i >= 20){
                      if(Math.random() > 0.65){
                        machines.throw(state,{char:'w'});
                      }
                      state.i = 0;
                    }
                    return;
                  }else if(machines.craft(state,{t:1})){
                    state.i = 5;
                  }else{
                    state.i = 1;
                  }
                }},
                G:{iterate:function(state){
                  if(state.i){
                    state.i++;
                    if(state.i >= 10){
                      machines.throw(state,{char:'p'});
                      state.i = 0;
                    }
                  }else if(machines.craft(state,{w:1})){
                    state.i = 1;
                  }
                }},
                D:{iterate:function(state){
                  if(state.i){
                    state.i++;
                    if(state.i >= 10){
                      machines.throw(state,{char:'h'});
                      state.i = 0;
                    }
                  }else if(machines.craft(state,{t:1})){
                    state.i = 1;
                  }
                }},
                F:{iterate:function(state){
                  if(state.i){
                    state.i++;
                    if(state.i >= 40){
                      machines.throw(state,{char:'s'});
                      state.i = 0;
                    }
                  }else if(machines.craft(state,{h:10,p:10})){
                    state.i = 1;
                  }
                }},
                I:{iterate:function(state){
                  if(state.i){
                    state.i++;
                    if(state.i >= 40){
                      machines.throw(state,{char:'s'});
                      state.i = 0;
                    }
                  }else if(machines.craft(state,{h:10,p:10})){
                    state.i = 1;
                  }
                }},
                O:{iterate:function(state){
                  if(!(world.machines[state.x-1]&&world.machines[state.x-1][state.y]&&world.machines[state.x-1][state.y].inv)){
                    return;
                  }
                  var inv = world.machines[state.x-1][state.y].inv;
                  for(var i = 0; i < inv.length;i++){
                    localStorage[inv[i].char] = parseInt(localStorage[inv[i].char])+1;
                  }
                  world.machines[state.x-1][state.y].inv = [];
                }},
                '#':{iterate:function(state){
                  if(!(world.machines[state.x+state.config[0].x]&&world.machines[state.x+state.config[0].x][state.y+state.config[0].y]
                  &&world.machines[state.x+state.config[0].x][state.y + state.config[0].y].inv)){
                    return false;
                  }
                  var inv = world.machines[state.x+state.config[0].x][state.y + state.config[0].y].inv;
                  var t = inv.shift();
                  if(t){
                    machines.throw(state,t);
                  }
                }},
                throw:function(state,out){out.x = state.x+state.config[1].x;out.y = state.y + state.config[1].y;
                out.dy = state.config[1].y;out.dx=state.config[1].x;world.items.push(out)},
                craft:function(state,inputs){
                  if(!(world.machines[state.x+state.config[0].x]&&world.machines[state.x+state.config[0].x][state.y+state.config[0].y]
                  &&world.machines[state.x+state.config[0].x][state.y + state.config[0].y].inv)){
                    return false;
                  }
                  var inv = world.machines[state.x+state.config[0].x][state.y + state.config[0].y].inv;
                  var toDel = [];
                  for(var i = 0; i < inv.length;i++){
                    if(inputs[inv[i].char]){        //find needed items
                      inputs[inv[i].char]--;        //subtract 1 from needed amount
                      toDel.push(i);                //note location
                    }
                  }
                  var done = true;                  //Make sure everything was found
                  for(var prop in inputs) {
                     done &= inputs[prop] === 0;
                  }
                  if(!done)return false;            //return if not enough items
                  
                  for(var j = toDel.length-1; j >= 0; j--){ //use items
                    inv.splice(j,j+1);
                  }
                  return true;
                }
};

var validate = function(key){
  return parseInt(localStorage[String.fromCharCode(key)]) > 0;
};