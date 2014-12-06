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
      for(var i = 0; i < world.items.length;i++){  //update foreach item
        world.items[i].x += world.items[i].dx;
        world.items[i].y += world.items[i].dy;
        if(world.field[world.items[i].y][world.items[i].x] !== BLANK){//If cell is deflector or machine, it needs special attention
          var cell = world.field[world.items[i].y][world.items[i].x];
          if(cell === UP){
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
          if(machines[cell]){
            //TODO
          }
        }
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
  console.log(deltaTime/1000);
  iterate(world,deltaTime/1000);
  main.innerText = render(world);
  requestAnimationFrame(loop);
};
var init = function(){
  prevTime = Date.now();
  loop();
};

var run = function(){
  var field = grabData(main);                //Pull cells of the div
  for(var i = 0; i < field.length;i++){
    field[i] = field[i].split('');
    for(var j = 0; j < field[i].length;j++){ //Go through every cell
      if(machines[field[i][j]]){             //and find if it is a machine
        if(!world.machines[j]){              //then make sure there is a place to put it
          world.machines[j]=[];
        }
        world.machines[j][i]={};             //then put it there
      }
    }
  }
  world.field = field;
  
  init();                                    //Start the simulation
};

var machines = {C:1,U:1};