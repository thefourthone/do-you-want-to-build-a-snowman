/*World Format: items   -> array of {x,y,dy,dx,char}
                machine -> array of array of chars that represent deflectors, empty cells, or machines*/
var world = {};
world.items = [{x:0,y:2,dx:1,dy:0,char:'a'}];
world.machine = ['**********'.split(''),
                 '**********'.split(''),
                 '**********'.split(''),
                 '**********'.split(''),
                 '**********'.split(''),
                 '**********'.split(''),
                 '**********'.split('')];

/*Runs physics for one timestep given small time increments (dt)*/
var TIMESTEP = 1;
var iterate = function(){
  var t = 0;
  return function(world,dt){
    t += dt;
    if(t >= TIMESTEP){                             //if past timestep take one step
      t -= TIMESTEP;
      for(var i = 0; i < world.items.length;i++){  //update foreach item
        world.items[i].x += world.items[i].dx;
        world.items[i].y += world.items[i].dy;
        if(world.machine[world.items[i].y][world.items[i].x] !== '*'){//If cell is deflector or machine, it needs special attention
          //TODO
          //change velocity based on <>^V/\-|
          //absorb if machine
        }
      }
    }
  };
}();

/*Renders a game world*/
var render = function(world){
  var out = [];
  for(var j = 0; j < world.machine.length;j++){ //Deep Copy
    out[j] = world.machine[j].slice(0);
  }
  for(var i = 0; i < world.items.length;i++){   //update foreach item
    out[world.items[i].y][world.items[i].x] = world.items[i].char; //overwrite an item on the background
  }
  for(j = 0; j < world.machine.length;j++){     //combine into string[]
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