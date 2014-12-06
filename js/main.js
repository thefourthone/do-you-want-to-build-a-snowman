var main = document.getElementById('main');
main.onkeydown = function(e){
  console.log(e);
  if(e.keyCode < 37 || e.keyCode > 40){
    e.preventDefault();                     //prevent the defualt typing action
  }
  if(e.shiftKey){
    switch(e.keyCode){
      case 32:            //space
        type('*');
        break;
      case 37:            //left
        type('<');
        break;
      case 38:            //up
        type('^');
        break;
      case 39:            //right
        type('>');
        break;
      case 40:            //down
        type('v');
         break;
    }
    if(e.keyCode > 64 && e.keyCode < 91){ //a = 65, z = 90
      //Pulverizer, etc ...
    }
  }
};
var str = ['************************',
           '************************',
           '************************',
           '************************',
           '************************'];
main.innerText = str.join('\n');

/* replace character in front of the curssor with char and move the cursor forward*/
function type(char){
  var sel = window.getSelection();
  var str = sel.anchorNode.data;          //get internal text
  var off = sel.anchorOffset;             //get current index
  if(str.substring(off)){                 //make sure not at the end
    sel.anchorNode.data = str.substring(0,off) + char +str.substring(off+1); //splice one character in where the cursor is
    var range = document.createRange();   //create a new selection
    range.setStart(sel.anchorNode, off+1);
    range.setEnd(sel.anchorNode, off+1);
    sel.removeAllRanges();
    sel.addRange(range);                  //set it equal
  }
}