let letters = document.getElementById(`letters`)
let wordsButton = document.getElementById(`wordsButton`)
let showAllDiv = document.getElementById(`showAllDiv`)
let showAllCheckbox = document.getElementById(`showAllCheckbox`)
let box = document.getElementById(`box`)

let finding = false
let words

let dictionary = {}
fetchDictionary()

wordsButton.addEventListener(`click`, startFindWords)
showAllCheckbox.addEventListener(`change`, toggleShowAll)

letters.addEventListener(`keydown`, keyPressed)
letters.focus()

function startFindWords() {
  let lettersValue = letters.value.trim().toLowerCase()

  if (lettersValue != `` && !finding) {
    showAllCheckbox.checked = false
    let numWildcards = getNumWildcards(lettersValue)

    if (numWildcards > 5) {
      box.innerHTML = `Input cannot have more than 5 wildcards.`
      showHideCheckbox(numWildcards)
    }
    else {
      box.innerHTML = `Finding all combinations...`
      finding = true

      setTimeout(findWords, 10, lettersValue, numWildcards)
    }
  }

  letters.focus()
}

function toggleShowAll() {
  if (!finding) {
    if (showAllCheckbox.checked) {
      box.innerHTML = `Showing all combinations...`
      finding = true

      setTimeout(showWords, 10)
    }
    else {
      showWords()
    }
  }
}

function findWords(lettersValue, numWildcards) {
  words = [``]

  for (let character of lettersValue) {
    let combos = getCombos(character)
    let newWords = []

    for (let word of words) {
      for (let combo of combos) {
        newWords.push(`${word}${combo}`)
      }
    }

    words = newWords
  }

  showHideCheckbox(numWildcards)
  showWords()
}

function getCombos(character) {
  if (character == `?`) {
    let alphabet = []

    for (let i = 97; i <= 122; i++) {
      alphabet.push(String.fromCharCode(i))
    }

    return alphabet
  }
  else {
    return character
  }
}

function showHideCheckbox(numWildcards) {
  if (numWildcards <= 3) {
    showAllDiv.style.display = `inline-block`
  }
  else {
    showAllDiv.style.display = `none`
  }
}

function showWords() {
  box.innerHTML = ``
  let wordsFound = false

  for (let word of words) {
    if (dictionary[word] || showAllCheckbox.checked) {
      let wordDiv = makeWordDiv(word)

      if (dictionary[word]) {
        labelValid(wordDiv)
      }

      wordsFound = true
    }
  }

  if (!wordsFound) {
    box.innerHTML = `No words found.`
  }

  finding = false
}

function makeWordDiv(word) {
  let wordDiv = document.createElement(`div`)
  wordDiv.classList.add(`word`)
  wordDiv.innerHTML = word
  box.appendChild(wordDiv)

  return wordDiv
}

function labelValid(wordDiv) {
  wordDiv.classList.add(`valid`)
}

function getNumWildcards(lettersValue) {
  let numWildcards = 0

  for (let character of lettersValue) {
    if (character == `?`) {
      numWildcards++
    }
  }

  return numWildcards
}

function fetchDictionary() {
  let request = new XMLHttpRequest()
  request.addEventListener(`load`, makeDictionary)
  request.open(`GET`, `dictionary.txt`)
  request.send()
}

function makeDictionary() {
  let words = this.response.split(`\n`)

  for (let word of words) {
    dictionary[word] = true
  }
}

function keyPressed(event) {
  if (event.keyCode == 13) {
    startFindWords()
  }
}