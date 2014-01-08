"use strict";
var timer;
var arrayOfCards = new Array(81);
setUpGame();

$(function() {
    laydownCards(12);
    $("#gameBoard > div").click(play);
    $("#backgrounds img").click(changeBackground);
    $("#addMore").click(addColumn);
    $("#shuffle").click(shuffleCards);
    $("#gameBoard > div").click(play);
});

function laydownCards(num) {
    for(var i = 0; i < num; i++) {
        var card = $("<div>").click(play);
        card = fillCard(card);
        card.appendTo("#gameBoard");
    }
}

//Set up game board
function setUpGame() {
    var counter = -1;
    var thisShade = 1;
    var shapes = 0;

    for(var i = 0; i < arrayOfCards.length; i++) {
        var cardObject = new Object();
        
        //Populate Color
        var thisColor;
        if(i % 3 == 1) {
            thisColor = "red";
        } else if (i % 3 == 2) {
            thisColor = "purple";
        } else {
            thisColor = "green";
        }
        cardObject.color = thisColor;
        
        //Populate Count
        if(i % 3 == 0) {
            counter++;
        } 
        cardObject.count = (counter % 3) + 1;
        
        //Populate Shading
        if((i % 9)/3 == 0) {
            thisShade++;
        }
        var shading;
        if(thisShade % 3 == 1) {
            shading = "solid";
        } else if (thisShade % 3 == 2) {
            shading = "hollow";
        } else { 
            shading = "stripe";
        }       
        cardObject.shade = shading;
        
        //Populate Shape
        if((i % 27)/9 == 0) {
            shapes++;
        }
        var thisShape;
        if(shapes % 3 == 1) {
            thisShape = "diamond";
        } else if (shapes % 3 == 2) {
            thisShape = "oval";
        } else {
            thisShape = "squiggle";
        }        
        cardObject.shape = thisShape;
        
        //Fill Array
        arrayOfCards[i] = cardObject;
    }

    // Shuffle Array
    fisherYates(arrayOfCards);
}

function fisherYates ( myArray ) {
  var i = myArray.length;
  if ( i == 0 ) return false;
  while ( --i ) {
     var j = Math.floor( Math.random() * ( i + 1 ) );
     var tempi = myArray[i];
     var tempj = myArray[j];
     myArray[i] = tempj;
     myArray[j] = tempi;
   }
}

function play() {
    if($(this).hasClass("highlight")) {
        $(this).removeClass("highlight");
    } else {
        $(this).addClass("highlight");
        checkBoard();
    }
}

function checkBoard() {
    // thisCard.color + "|" + thisCard.shape + "|" + thisCard.shade + "|" + thisCard.count
    var pieces = $(".highlight");
    if(pieces.length == 3) {
        if(isSet(pieces)) {
            $("#sets").text("You found a set!");
            clearTimeout(timer);
            timer = setTimeout(clearDiv, 5000); 

            $("#score").text((parseInt($("#score").text()) + 1));

            //Check if end of game
            if(arrayOfCards.length === 3 && $("#lastCard").attr("checked") == "checked") {
                $("#addMore").attr("disabled", "disabled");
                for(var i = 0; i < 2; i++) {
                    $(pieces[i]).text("");
                    fillCard($(pieces[i]));
                }
                $(pieces[2]).text("").append($("<img>").attr("src", "images/set.jpg").attr("id", "backOfCard"));
                setTimeout(function() {
                    doGuessing(pieces)
                } , 1000);
            } else if(arrayOfCards.length < 3) {
                var r = confirm("You have played through the deck! Play again?");
                $("#addMore").attr("disabled", "disabled");
                if (r==true){
                    $("#gameBoard").children().remove();
                    setUpGame();
                    laydownCards(12);
                    $("#deck").text(arrayOfCards.length);
                    $("#score").text("0");
                }
            } else if (parseInt($("#gameBoard").css("width")) == 1070) {
                $("#gameBoard").css("width", "860px");
                $("#addMore").removeAttr("disabled");
                $(pieces).remove();
            } else {
                for(var i = 0; i < pieces.length; i++) {
                    $(pieces[i]).text("");
                    fillCard($(pieces[i]));
                }
                $("#deck").text(arrayOfCards.length);
            }
        } else {
            $("#sets").text("this is not a set");
            clearTimeout(timer);
            timer = setTimeout(clearDiv, 5000);
        }
        $(".highlight").removeClass("highlight");
    }
}

function fillCard(card) {
    var thisCard = arrayOfCards.pop();
    if(thisCard) {
        for(var j = 0; j < thisCard.count; j++) {
            $("<img>")
            .attr("src", "images/" + thisCard.color + "-" + thisCard.shape + "-" + thisCard.shade + ".png")
            .appendTo(card);
        }

        $("<div>")
        .addClass("stats")
        .text(thisCard.color + "|" + thisCard.shape + "|" + thisCard.shade + "|" + thisCard.count)
        .appendTo(card);

        return card;
    } else {
        return null;
    }
}

function changeBackground() {
    var image = this.src;
    $("body").css("background-image", "url(" + image + ")");
}

function addColumn() {
    $("#gameBoard").css("width", "1070px");
    $("#deck").text(arrayOfCards.length);
    laydownCards(3);
    $("#gameBoard > div").click(play);
    $("#addMore").attr("disabled", "disabled");
    $("#gameBoard > div").click(play);
    
}

function shuffleCards() {
    var array = $("#gameBoard > div");
    fisherYates(array);
    $("#gameBoard").children().remove();
    $(array).appendTo($("#gameBoard"));
    $("#gameBoard > div").click(play);
}

/*
function availableSets() {
    var counter = new Array(1);
    var chosenCards = new Array();
    recursiveMethod(counter, chosenCards, $("#gameBoard > div"));
    alert(counter[0]);
}


function recursiveMethod(counter, chosenCards, allPieces) {
    if(chosenCards.length == 3) {
        //base case.
        if(isSet(chosenCards)) {
            counter[0]++;
        }
    } else {
        //recursive case.
        for(var i = 0; i < allPieces.length; i++) {
            if(chosenCards.length < 3) {
                //choose
                var card = allPieces.slice(i, i + 1);
                console.log(card);
                chosenCards.push(card);
                //explore
                recursiveMethod(counter, chosenCards, allPieces);
                //unchoose
                allPieces.splice(i, 0, card);
                chosenCards.pop();
            }
        }
    }
} */

function isSet(pieces) {
    var color = ($(pieces[0]).find(".stats").text().split("|")[0] == $(pieces[1]).find(".stats").text().split("|")[0] &&
        $(pieces[1]).find(".stats").text().split("|")[0] == $(pieces[2]).find(".stats").text().split("|")[0]) ||
       (($(pieces[0]).find(".stats").text().split("|")[0] != $(pieces[1]).find(".stats").text().split("|")[0]) &&
       ($(pieces[1]).find(".stats").text().split("|")[0] != $(pieces[2]).find(".stats").text().split("|")[0]) &&
       ($(pieces[2]).find(".stats").text().split("|")[0] != $(pieces[0]).find(".stats").text().split("|")[0]));

    var shape = ($(pieces[0]).find(".stats").text().split("|")[1] == $(pieces[1]).find(".stats").text().split("|")[1] &&
        $(pieces[1]).find(".stats").text().split("|")[1] == $(pieces[2]).find(".stats").text().split("|")[1]) ||
       (($(pieces[0]).find(".stats").text().split("|")[1] != $(pieces[1]).find(".stats").text().split("|")[1]) &&
       ($(pieces[1]).find(".stats").text().split("|")[1] != $(pieces[2]).find(".stats").text().split("|")[1]) &&
       ($(pieces[2]).find(".stats").text().split("|")[1] != $(pieces[0]).find(".stats").text().split("|")[1]));
    
    var count = ($(pieces[0]).find(".stats").text().split("|")[3] == $(pieces[1]).find(".stats").text().split("|")[3] &&
        $(pieces[1]).find(".stats").text().split("|")[3] == $(pieces[2]).find(".stats").text().split("|")[3]) ||
       (($(pieces[0]).find(".stats").text().split("|")[3] != $(pieces[1]).find(".stats").text().split("|")[3]) &&
       ($(pieces[1]).find(".stats").text().split("|")[3] != $(pieces[2]).find(".stats").text().split("|")[3]) &&
       ($(pieces[2]).find(".stats").text().split("|")[3] != $(pieces[0]).find(".stats").text().split("|")[3]));

    var shade = ($(pieces[0]).find(".stats").text().split("|")[2] == $(pieces[1]).find(".stats").text().split("|")[2] &&
        $(pieces[1]).find(".stats").text().split("|")[2] == $(pieces[2]).find(".stats").text().split("|")[2]) ||
       (($(pieces[0]).find(".stats").text().split("|")[2] != $(pieces[1]).find(".stats").text().split("|")[2]) &&
       ($(pieces[1]).find(".stats").text().split("|")[2] != $(pieces[2]).find(".stats").text().split("|")[2]) &&
       ($(pieces[2]).find(".stats").text().split("|")[2] != $(pieces[0]).find(".stats").text().split("|")[2]));
    
    return (color && shape && count && shade);
}

function clearDiv() {
    $("#sets").html("&nbsp;");
}

function doGuessing(pieces) {
    var guess = prompt("Please enter your guess. Colors are red, purple, or green. Shapes are diamond, oval, or squiggle. Shading is either hollow, solid or stripe. Count is a number (1 -3).","color, shape, count, shade");
    if(guess != null) {
        var array = guess.split(", ");
        //check to see if it's the right guess.
        var finalCard = arrayOfCards.pop();
       
        if(finalCard.color == array[0].trim() && 
           finalCard.shape == array[1].trim() &&
           finalCard.count == array[2].trim() &&
           finalCard.shade == array[3].trim()){
            alert("Correct!");
        } else {
            alert("Sorry, incorrect :( Correct answer is: " + 
                finalCard.color + " " + 
                finalCard.shape + " " + 
                finalCard.count + " " + 
                finalCard.shade);
        }
        arrayOfCards.push(finalCard);
        $(pieces[2]).text("");
        fillCard($(pieces[2]));
    }
}