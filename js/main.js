var main = document.getElementById('main');
main.onkeydown = function(e){
  //console.log(e);
  if(e.keyCode < 37 || e.keyCode > 40){
    e.preventDefault();                     //prevent the defualt typing action
  }
  if(e.shiftKey){
    var back;
    var first = grabData(main);
    switch(e.keyCode){
      case 32:            //space
        back = type(BLANK);
        break;
      case 37:            //left
        back = type(LEFT);
        break;
      case 38:            //up
        back = type(UP);
        break;
      case 39:            //right
        back = type(RIGHT);
        break;
      case 40:            //down
        back = type(DOWN);
        break;
    }
    if(back){
      var second = grabData(main);
      var loc = compare(first,second);
      if(loc){
        world.machines[loc.x][loc.y]=undefined;
      }
    }
    if(e.keyCode === 51){
      back = type('#');
      var second = grabData(main);
      var loc = compare(first,second);
      makeMachine('#',loc.x,loc.y);
    }
    if((e.keyCode > 64 && e.keyCode < 91)){ //a = 65, z = 90
      if(!validate(e.keyCode))return;
      var char = String.fromCharCode(e.keyCode);
      localStorage[char] = parseInt(localStorage[char])-1;
      back = type(char);
      var second = grabData(main);
      var loc = compare(first,second);
      makeMachine(char,loc.x,loc.y);
    }
    if(back && localStorage[back]){
      localStorage[back] = parseInt(localStorage[back])+1;
    }
  }
};
var str = ['***********************************',
           '***********************************',
           '***********************************',
           '***********************************',
           '***********************************',
           '***********************************',
           '***********************************',
           '***********************************',
           '***********************************',
           '***********************************',
           '***********************************',
           '***********************************',
           '***********************************',
           '***********************************'];
main.innerText = str.join('\n');

/* grabs data from a text box */
function grabData(element){
  var tmp = element.childNodes, out = [];
  for(var i = 0; i < tmp.length;i+=2){ // every other one is <br>
    out[i/2] = tmp[i].data;            // get string data from text element
  }
  return out;
}

/* replace character in front of the cursor with char and move the cursor forward*/
function type(char){
  var sel = window.getSelection();
  var str = sel.anchorNode.data;          //get internal text
  var off = sel.anchorOffset;             //get current index
  var out = str.substring(off,off+1);
  if(str.substring(off)){                 //make sure not at the end
    sel.anchorNode.data = str.substring(0,off) + char + str.substring(off+1); //splice one character in where the cursor is
    var range = document.createRange();   //create a new selection
    range.setStart(sel.anchorNode, off+1);
    range.setEnd(sel.anchorNode, off+1);
    sel.removeAllRanges();
    sel.addRange(range);                //set it equal
    return out;
  }
}
var compare = function(a,b){
  for(var i = 0; i < a.length;i++){
    if(a[i]!==b[i]){
      for(var j = 0; j < a[i].length;j++){
        if(a[i][j]!==b[i][j]){
          return {x:j,y:i};
        }
      }
    }
  }
};