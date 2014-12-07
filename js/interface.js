/*World Format: items   -> array of {x,y,dy,dx,char}
                field -> array of array of chars that represent deflectors, empty cells, or machines*/
var world = {};
world.items    = [{x:0,y:2,dx:1,dy:0,char:'a'},{x:3,y:0,dx:0,dy:1,char:'b'}];
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
          
          if(cell === 'C' && machines[cell].filter(world.items[i])){   //Move items into chest
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
        world.items.splice(toDel[h],toDel[h]+1);
      }
    }
  };
}();

/*Renders a game world*/
var render = function(world){
  var out = [];
  for(var j = 0; j < world.field.length;j++){ //Deep Copy
    out[j] = world.field[j].slice(0);
  }
  for(var i = 0; i < world.items.length;i++){   //update foreach item
    out[world.items[i].y][world.items[i].x] = world.items[i].char; //overwrite an item on the background
  }
  for(j = 0; j < world.field.length;j++){     //combine into string[]
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
    for(var j = 0; j < field[i].length;j++){  //Go through every cell
      if(machines[field[i][j]]){              //and find if it is a machine
        if(!world.machines[j]){               //then make sure there is a place to put it
          world.machines[j]=[];
        }
        world.machines[j][i]={x:j,y:i,inv:[]};//then put it there
      }
    }
  }
  world.field = field;
  
  init();                                    //Start the simulation
};

var machines = {C:{filter:function(item){return true},iterate:function(state){}},
                U:{iterate:function(state){
                  if(state.i){
                    state.i++;
                    if(state.i === 3){
                      machines.throw(state,{char:'a'});
                    }
                    if(state.i === 5){
                      machines.throw(state,{char:'b'});
                    }
                    if(state.i > 6){
                       machines.throw(state,{char:'c'});
                       state.i = 0;
                    }
                    return;
                  }
                  var inv = world.machines[state.x-1][state.y].inv;
                  var a = -1,b = -1;
                  for(var i = 0; i < inv.length;i++){
                    if(inv[i].char === 'a'){
                      a = i;
                    }else if(inv[i].char === 'b'){
                      b = i;
                    }
                  }
                  if(a !== -1 && b !== -1){
                    var t;
                    if(a < b){ //make a the first one
                      t = b;
                      b = a;
                      a = t;
                    }
                    inv.splice(a,a+1);
                    inv.splice(b,b+1);
                    state.i = 1;
                  }
                }},
                throw:function(state,out){out.x = state.x+1;out.y = state.y;out.dy = 0;out.dx=1;world.items.push(out)}};

var validate = function(key){
  return parseInt(localStorage[String.fromCharCode(key)]) > 0;
};