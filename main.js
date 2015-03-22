var server2 = new Firebase("https://shining-heat-588.firebaseIO.com");
var server3 = new Firebase("https://popping-heat-2271.firebaseio.com/");
var startX, startY,
    currentX, currentY,
    isClick = false,
    isEraser = false,
    isErasing = false,
    color = "white",
    stroke = 2;
var window = {
    name : null,
    isPowerful : false,
    ID : ""
};
$(document).ready(function() {
    
    $("#whiteboard").mousedown(function(event){ //Listener for mouse pressed
        var parentOffset = $(this).parent().offset();
        startX = currentX = event.pageX - parentOffset.left;
        startY = currentY = event.pageY - parentOffset.top;
        server2.push({
            startX: startX, 
            startY: startY, 
            currentX: currentX, 
            currentY: currentY, 
            color: color, 
            stroke: stroke
        });
        isClick = true;
        if(isEraser) {
            isErasing = true;
            isClick = false;
        } else {
            isErasing = false;
        }
    });
    $("#whiteboard").mouseup(function(event) { //Listener for mouse moved
        isClick = false;
        isErasing = false;
    });
    $("#whiteboard").mouseleave(function(event) {
        $("#whiteboard2").clearCanvas();//Listener for mouse leaving the canvas
        isClick = false;
    })
    $("#whiteboard").mousemove(function(event) { //Listener for mouse released
        var parentOffset = $(this).parent().offset(); //Get offset relative from canvas to document
        startX = currentX;
        startY = currentY;
        currentX = event.pageX - parentOffset.left;
        currentY = event.pageY - parentOffset.top;
        if(isClick && window.isPowerful) {
            server2.push({
                startX: startX, 
                startY: startY, 
                currentX: currentX, 
                currentY: currentY, 
                color: color, 
                stroke: stroke
            });   
        }
        //draw(startX,startY,currentX, currentY, isClick, color, stroke);
        eraser(startX,startY,currentX,currentY,isEraser, isErasing);
    });
    
    server2.on("child_added", function(snapshot) {
        var coordsSet = snapshot.val();
        draw(coordsSet.startX,coordsSet.startY,coordsSet.currentX, coordsSet.currentY, true , coordsSet.color, coordsSet.stroke);
    });
    server2.on("child_removed", function(snapshot) {
        $("#whiteboard").clearCanvas();
    });
    server3.on("child_added", function(snapshot) {
        var name =snapshot.val().name;
        var levelOfPower = snapshot.val().powerLevel;
        if(window.name == name){
            window.isPowerful = levelOfPower;
        }
    });
    server3.on("child_changed", function(snapshot) {
        var name =snapshot.val().powerLevel.name;
        var levelOfPower = snapshot.val().powerLevel;
        if(window.name == name){
            window.isPowerful = levelOfPower;   
        }
    });
    
    $("#white").click(function(event){
        color = setColor(this);
        isEraser = false;
    });
    $("#red").click(function(event){
        color = setColor(this);
        isEraser = false;
    });
    $("#yellow").click(function(event){
        color = setColor(this);
        isEraser = false;
    });
    $("#green").click(function(event){
        color = setColor(this);
        isEraser = false;
    });
    $("#blue").click(function(event){
        color = setColor(this);
        isEraser = false;
    });
    $("#plus").click(function(event){
        if(stroke < 6) {
        stroke++;
        }
    });
    $("#minus").click(function(event){
        if (stroke > 1) {
        stroke--;
        }
    });
    $("#clear").click(function(event){
        if(window.isPowerful) {
            server2.remove();   
        }
    });
    $("#eraser").click(function(event){
        isEraser = true;
        isClick = false;
    });
    
});

$(window).ready(function() {   // cuando se carga te pregunta que eres !! si estudiante o Assessor
    window.name = prompt("Assessor or student ? (Write)");
    while(window.name == null || window.name == ""){
            window.name = prompt("Please enter a name or Assessor");
    }
    if(window.name!="Assessor"){   // SI NO ! ERES ESTUDIANTE
        alert("Welcome Student: "+ window.name);
    } else {
        alert("Welcome Assessor, time to teach!");//cuando sabe que eres profe
        document.getElementById("powerful").style.visibility = "visible";
        document.getElementById("powerful").onclick = function() {
            alert("algo pasa");
            }
        };
    var ID = server3.push(
        {name: window.name ,powerLevel: window.name=="Assessor"?true:false}
    );
    window.ID = ID.key();
});
function draw(startX,startY,currentX, currentY,isClick, color, stroke) { //Draws a dot on the canvas at the x and y position if isClick is true
    if(isClick) {
        $("#whiteboard").drawLine({
            strokeStyle: color,
            strokeWidth: stroke,
            x1: startX, y1: startY,
            x2: currentX, y2: currentY,
        });
    }
}

function eraser(startX, startY, currentX, currentY, isEraser, isErasing) {
    if(isEraser) {
        $("#whiteboard2").clearCanvas();
        $("#whiteboard2").drawEllipse({
            layer: true,
            fillStyle: 'rgba(0,0,0,0.0)',
            strokeStyle: 'white',
            x : currentX, y : currentY,
            width: 50, height: 50
        });
        if(isErasing) {
            $("#whiteboard").drawEllipse({
                layer: true,
                fillStyle: 'rgba(0,0,0,0.0)',
                strokeStyle: 'rgba(0,0,0,0.0)',
                x : currentX, y : currentY,
                width: 50, height: 50
            });
        }
    }
}
function setColor(obj) {
    return obj.id;
}
function popup(mylink, windowname)
{
if (!window.focus)return true;
var href;
if (typeof(mylink) == 'string')
   href=mylink;
else
   href=mylink.href;
window.open(href, windowname, 'width=400,height=200,scrollbars=yes');
return false;
}



console.log(server3.child("user"));
