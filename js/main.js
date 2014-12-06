var main = document.getElementById('main');
main.onkeydown = function(e){
  console.log(e);
  if(e.keyCode < 37 || e.keyCode > 40){
    e.preventDefault();                     //prevent the defualt typing action
  }
  if(e.shiftKey){
    switch(e.keyCode){
      case 32:            //space
        type(BLANK);
        break;
      case 37:            //left
        type(LEFT);
        break;
      case 38:            //up
        type(UP);
        break;
      case 39:            //right
        type(RIGHT);
        break;
      case 40:            //down
        type(DOWN);
        break;
    }
    if(e.keyCode > 64 && e.keyCode < 91){ //a = 65, z = 90
      //TODO: Pulverizer, etc ...
      //if(!validate(e.keyCode))return;
      type(String.fromCharCode(e.keyCode));
    }
  }
};
var str = ['************************',
           '************************',
           '************************',
           '************************',
           '************************'];
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
  if(str.substring(off)){                 //make sure not at the end
    sel.anchorNode.data = str.substring(0,off) + char + str.substring(off+1); //splice one character in where the cursor is
    var range = document.createRange();   //create a new selection
    range.setStart(sel.anchorNode, off+1);
    range.setEnd(sel.anchorNode, off+1);
    sel.removeAllRanges();
    sel.addRange(range);                  //set it equal
  }
}