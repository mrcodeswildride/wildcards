var lettersInput = document.getElementById("letters");
var findWordsButton = document.getElementById("findWords");
var showAllDiv = document.getElementById("showAllDiv");
var showAllCheckbox = document.getElementById("showAll");
var messageParagraph = document.getElementById("message");
var wordsDiv = document.getElementById("words");

var dict = {};
var wordCombos;
var wordCount;

lettersInput.addEventListener("keydown", lettersInputKeydown);
findWordsButton.addEventListener("click", findWords);
showAllCheckbox.addEventListener("change", toggleCombos);

lettersInput.focus();
fetchDict();

function lettersInputKeydown(event) {
    if (event.keyCode == 13 && !findWordsButton.disabled) {
        findWords();
    }
}

function findWords() {
    let letters = lettersInput.value.trim().toLowerCase();

    if (letters != "") {
        let numWildcards = getNumWildcards(letters);

        showAllDiv.classList.add("hidden");
        wordsDiv.innerHTML = "";

        if (numWildcards <= 5) {
            findWordsButton.disabled = true;
            messageParagraph.innerHTML = "Finding all combinations...";

            setTimeout(function() {
                let startTime = Date.now();
                wordCombos = getWordCombos(letters);

                let noun = (wordCombos.length == 1) ? "combination" : "combinations";
                let seconds = (Date.now() - startTime) / 1000;
                messageParagraph.innerHTML = "Found " + wordCombos.length + " " + noun + " in " + seconds.toFixed(3) + " seconds, now finding actual words...";

                setTimeout(function() {
                    wordCount = 0;

                    for (let i = 0; i < wordCombos.length; i++) {
                        if (dict[wordCombos[i]]) {
                            let wordDiv = document.createElement("div");
                            wordDiv.classList.add("word");
                            wordDiv.classList.add("valid");
                            wordDiv.innerHTML = wordCombos[i];
                            wordsDiv.appendChild(wordDiv);
                            wordCount++;
                        }
                    }

                    findWordsButton.disabled = false;

                    if (numWildcards <= 3) {
                        showAllCheckbox.checked = false;
                        showAllDiv.classList.remove("hidden");
                    }

                    noun = (wordCount == 1) ? "word" : "words";
                    seconds = (Date.now() - startTime) / 1000;
                    messageParagraph.innerHTML = "Found " + wordCount + " " + noun + ". Total time: " + seconds.toFixed(3) + " seconds";
                }, 10);
            }, 10);
        }
        else {
            messageParagraph.innerHTML = "Input cannot have more than 5 wildcards.";
        }
    }
}

function toggleCombos() {
    findWordsButton.disabled = true;
    showAllCheckbox.disabled = true;
    wordsDiv.innerHTML = "";

    if (showAllCheckbox.checked) {
        messageParagraph.innerHTML = "Showing all combinations...";
    }
    else {
        messageParagraph.innerHTML = "Showing actual words only...";
    }

    setTimeout(function() {
        for (let i = 0; i < wordCombos.length; i++) {
            if (showAllCheckbox.checked || dict[wordCombos[i]]) {
                let wordDiv = document.createElement("div");
                wordDiv.classList.add("word");
                wordDiv.innerHTML = wordCombos[i];
                wordsDiv.appendChild(wordDiv);

                if (dict[wordCombos[i]]) {
                    wordDiv.classList.add("valid");
                }
            }
        }

        findWordsButton.disabled = false;
        showAllCheckbox.disabled = false;

        if (showAllCheckbox.checked) {
            let noun = (wordCombos.length == 1) ? "combination" : "combinations";
            messageParagraph.innerHTML = "Showing " + wordCombos.length + " " + noun + ".";
        }
        else {
            let noun = (wordCount == 1) ? "word" : "words";
            messageParagraph.innerHTML = "Showing " + wordCount + " " + noun + ".";
        }
    }, 10);
}

function getNumWildcards(letters) {
    var numWildcards = 0;

    for (var i = 0; i < letters.length; i++) {
        if (letters[i] == "?") {
            numWildcards++;
        }
    }

    return numWildcards;
}

function getWordCombos(input) {
    if (input.length == 1) {
        if (input != "?") {
            return [input];
        }
        else {
            var letters = [];

            for (var charCode = 97; charCode <= 122; charCode++) {
                var letter = String.fromCharCode(charCode);
                letters.push(letter);
            }

            return letters;
        }
    }
    else {
        var allButLastLetter = input.substring(0, input.length - 1);
        var lastLetter = input[input.length - 1];

        var subwords = getWordCombos(allButLastLetter);
        var combos = [];

        for (var i = 0; i < subwords.length; i++) {
            var subword = subwords[i];
            var combo;

            if (lastLetter != "?") {
                combo = subword + lastLetter;
                combos.push(combo);
            }
            else {
                var lastLetters = getWordCombos(lastLetter);

                for (var j = 0; j < lastLetters.length; j++) {
                    combo = subword + lastLetters[j];
                    combos.push(combo);
                }
            }
        }

        return combos;
    }
}

function fetchDict() {
    var request = new XMLHttpRequest();
    request.open("GET", "dictionary.txt");
    request.addEventListener("load", createDict);
    request.send();
}

function createDict() {
    var words = this.response.split("\n");

    for (var i = 0; i < words.length; i++) {
        dict[words[i]] = true;
    }
}
