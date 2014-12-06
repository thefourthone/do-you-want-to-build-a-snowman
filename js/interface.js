var TIMESTEP = 1;
var iterate = function(){
  var t = 0;
  return function(world,dt){
    t += dt;
    if(t >= TIMESTEP){                             //if past timestep take one step
      t -= TIMESTEP;
      for(var i = 0; i < world.items.length;i++){ //update foreach item
        world.items[i].x += world.items[i].dx;
        world.items[i].y += world.items[i].dy;
        if(world.machine[world.items[i].y][world.items[i].x] !== '*'){          //If cell is deflector or machine, it needs special attention
          //change velocity based on <>^V/\-|
          //absorb if machine
        }
      }
    }
  };
}();

var render = function(world){
  var out = [];
  for(var j = 0; j < world.machine.length;j++){
    out[j] = world.machine[j].slice(0);
  }
  for(var i = 0; i < world.items.length;i++){ //update foreach item
    out[world.items[i].y][world.items[i].x] = world.items[i].char;
  }
  for(j = 0; j < world.machine.length;j++){
    out[j] = out[j].join('');
  }
  
  return out.join('\n');
};
var prevTime = 0;
var world = {};
world.items = [{x:0,y:2,dx:1,dy:0,char:'a'}];
world.machine = ['**********'.split(''),'**********'.split(''),'**********'.split(''),'**********'.split(''),'**********'.split(''),'**********'.split(''),'**********'.split('')];
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