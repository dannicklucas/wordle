var height = 4;
var width = 4;
var end = false;
var row = 0;
var column = 0;

var listWord = null;
var word;
var hint;


async function getWordHint(){
    if(listWord === null){
        document.getElementById("startOver").disabled;
        document.getElementById("startOver").innerHTML = 'Loading...';
        const res = await fetch("https://api.masoudkf.com/v1/wordle", {
            headers: {
            "x-api-key": "sw0Tr2othT1AyTQtNDUE06LqMckbTiKWaVYhuirv",
            },
        });
        let temp = await res.json();
        var {dictionary} = temp;
        listWord = dictionary;
        document.getElementById("startOver").disabled = false;
        document.getElementById("startOver").innerHTML = 'Start Over';
    }
}

async function setWordHint(){
    getWordHint().then(() => {
        var wordAndHint = listWord[Number.parseInt(Math.random() * listWord.length)];
        word = wordAndHint.word.toUpperCase();
        hint = wordAndHint.hint;
  })
  
}

window.onload = function() {
    setWordHint();
    main();
}

function main() {
    for (let i = 0; i < height; i++){
        for (let j = 0; j < width; j++){
            let square = document.createElement("span");
            square.id = i.toString() + j.toString(); 
            square.classList.add("square");
            square.innerText = "";
            document.getElementById("game").appendChild(square);
        }
    }
    let currentSquare = document.getElementById('0' + '0');
    currentSquare.classList.add("current");

    document.addEventListener("keyup", (event) => {
        console.log(event);
        if ("KeyA" <= event.code && event.code <= "KeyZ") {
            
            if (column < width) {
                let currentSquare = document.getElementById(row.toString() + column.toString());
                if (column < width -1) {
                    let nextSquare = document.getElementById(row.toString() + (column + 1).toString());
                    nextSquare.classList.add("current");
                }
                
                if(currentSquare.innerText == ""){
                    currentSquare.innerText = event.code[3];
                    column += 1;
                    currentSquare.classList.remove("current");
                    
                }
            }
    
        }
        else if (event.code == "Backspace") {
            if (0 < column && column <= width) {
                column -= 1;
            }
            let currentSquare = document.getElementById(row.toString() + column.toString());
            if (column < width -1) {
                let nextSquare = document.getElementById(row.toString() + (column + 1).toString());
                nextSquare.classList.remove("current");
            }
            currentSquare.classList.add("current");
            currentSquare.innerText = "";
        }

        else if (event.code == "Enter") {
            if (column == width) {
                check();
                row += 1;
                column = 0;
                if (row < height && !end){
                    document.getElementById(row.toString() + column.toString()).classList.add("current");
                }
                
                
            }
            else {
                window.alert("You must complete the word first");
            }
        }

        if (!end && height == row) {
            end = true;
            fail();
        }
            
    })
}

function check() {
    let correct = 0;
    let presents = {};
    let letters = {};
    for (let a = 0; a < width; a++) {
        presents[word.charAt(a)] = 0;
        letters[word.charAt(a)] = (word.match(new RegExp(word.charAt(a), "g")) || []).length;
        
    }
    // Place all green squares
    for (let i = 0; i < width; i++) {
        let currentSquare = document.getElementById(row.toString() + i.toString());
        let letter = currentSquare.innerText;
        if (letter == word[i]) {
            currentSquare.classList.add("yes");
            correct += 1;
            presents[letter] += 1;
        } 
        
    }
    // Now place yellows and greys
    for (let j = 0; j < width; j++) {
        if (correct != width) {
            let currentSquare = document.getElementById(row.toString() + j.toString());
            let letter = currentSquare.innerText;
            if (word.includes(letter) && (letters[letter] > presents[letter]) && !currentSquare.classList.contains("yes")) {
                currentSquare.classList.add("present");
                presents[letter] += 1;
            }
            else {
                currentSquare.classList.add("no");
            }
        }
        

        if (correct == width) {
            end = true;
            success();
        } 

    }

}

function reset() {
    if (document.getElementById("game").classList.contains("square")) {
        for (let i = 0; i < height; i++){
            for (let j = 0; j < width; j++){
                let game = document.getElementById("game");
                game.removeChild(game.lastElementChild);
            }
        }
        row = 0;
        column = 0;
        for (let i = 0; i < height; i++){
            for (let j = 0; j < width; j++){
                let square = document.createElement("span");
                square.id = i.toString() + j.toString(); 
                square.classList.add("square");
                square.innerText = "";
                document.getElementById("game").appendChild(square);
            }
        }
    }
    else {
        document.getElementById("game").innerHTML = "";
        for (let i = 0; i < height; i++){
            for (let j = 0; j < width; j++){
                let square = document.createElement("span");
                square.id = i.toString() + j.toString(); 
                square.classList.add("square");
                square.innerText = "";
                document.getElementById("game").appendChild(square);
            }
        }
        row = 0;
        column = 0;
    }
    setWordHint();
    document.getElementById("bar").classList.remove("success");
    document.getElementById("bar").classList.remove("fail");
    document.getElementById("bar").classList.remove("getHint");
    document.getElementById("bar").innerText = "";
    end = false;
    let currentSquare = document.getElementById('0' + '0');
    currentSquare.classList.add("current");
}

function darkMode() {
    document.body.classList.toggle("darkMode");
}

function testhint() {
    if(!document.getElementById("bar").classList.contains("fail") && !document.getElementById("bar").classList.contains("success")) {
        document.getElementById("bar").classList.toggle("getHint");
        if (document.getElementById("bar").classList.contains("getHint")) {
            
            document.getElementById("bar").innerText = "Hint: " + hint;
        }
        else {
            document.getElementById("bar").innerText = "";
        }
        
    }
    
}

function fail() {
    document.getElementById("bar").classList.add("fail");
    document.getElementById("bar").innerText = "You missed the word " + word +" and lost!";
}

function success() {
    document.getElementById("bar").classList.add("success");
    document.getElementById("bar").innerText = "You guessed the word " + word + " correctly!";
    document.getElementById("game").innerHTML = "<img src=\"congrats.gif\" alt= \"Congratualation GIF\"\>";
}

function instr() {
    document.getElementById("middle").style.flexDirection = "row";
    document.getElementById("info").classList.toggle("infoToggle");
    if (document.getElementById("info").classList.contains("infoToggle")) {
        document.getElementById("info").innerHTML = "<h1> How To Play </h1>";
        document.getElementById("info").innerHTML += "<ul><li>Start typing. The letters will apear in the boxes</li> <li>Remove letters with backspace</li> <li>Hit Enter/Return to submit an answer</li> <li>Letters with green background are in the right spot</li> <li>Letters with yellow background exist in the word, but are in the wrong spots</li> <li>Letters with grey background do not exist in the word</li> <li>If you need a hint, click the &#63; icon</li></ul>";
        
    }
    else {
        document.getElementById("info").innerHTML = "";
    }
   
}


