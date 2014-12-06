var main = document.getElementById('main');
main.onkeydown = function(e){
  console.log(e.keyCode);
  if(e.keyCode < 37 || e.keyCode > 40){
    type(String.fromCharCode(e.keyCode));
    e.preventDefault();                     //prevent the defualt typing action
  }
};
var str = ['abcdef','ghijkl','mnopqr'];
main.innerText = str.join('\n');

function type(char){
  var sel = window.getSelection();
  var str = sel.anchorNode.data;          //get internal text
  var off = sel.anchorOffset;             //get current index
  if(str.substring(off)){                 //make sure not at the end
    sel.anchorNode.data = str.substring(0,off) +String.fromCharCode(e.keyCode)+str.substring(off+1); //splice one character in where the cursor is
    var range = document.createRange();   //create a new selection
    range.setStart(sel.anchorNode, off+1);
    range.setEnd(sel.anchorNode, off+1);
    sel.removeAllRanges();
    sel.addRange(range);                  //set it equal
  }
}