"use strict"

const effProps = {
  "passId": document.getElementById('eff-pass'),
  "passLength": document.getElementById('eff-length'),
  "passEntropy": document.getElementById('eff-entropy'),
  "setSize": document.getElementById('eff-set-size'),
  "entropyCheck": document.getElementById('eff-entropy-check'),
}

/**
 * Generate an EFF passphrase based on the chosen word list.
 * @param {string} selection - An EFF word list.
 */
function generateEff(selection) {
  let pass = ''
  let wordList = ''

  if (selection === 'Distant Words') {
    wordList = effDistant
  } else if (selection === 'Short Words') {
    wordList = effShort
  } else if (selection === 'Long Words') {
    wordList = effLong
  } else if (selection === 'Game of Thrones') {
    wordList = effGameOfThrones
  } else if (selection === 'Harry Potter') {
    wordList = effHarryPotter
  } else if (selection === 'Star Trek') {
    wordList = effStarTrek
  } else if (selection === 'Star Wars') {
    wordList = effStarWars
  }

  wordList = uniquesOnly(wordList)  // Force unique elements in array.

  const entropy = getEntropy()
  const len = Math.ceil(entropy / Math.log2(wordList.length))

  pass = generatePass(len, wordList, true, effProps.entropyCheck.checked).trim()
  pass = pass.replace(/ /g, '-')
  effProps.passId.innerText = pass
  effProps.passLength.innerText = pass.length + ' characters'
  effProps.setSize.innerText = wordList.length.toLocaleString() + ' words'
  effProps.passEntropy.innerText = Math.floor(len * Math.log2(wordList.length)) + ' bits'
}
