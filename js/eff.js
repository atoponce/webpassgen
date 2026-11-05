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
  const effLists = {
    'Distant Words': effDistant,
    'Short Words': effShort,
    'Long Words': effLong,
    'Game of Thrones': effGameOfThrones,
    'Harry Potter': effHarryPotter,
    'Star Trek': effStarTrek,
    'Star Wars': effStarWars,
  }

  const wordList = uniquesOnly(effLists[selection])  // Force unique elements in array.
  const entropy = getEntropy()
  const len = Math.ceil(entropy / Math.log2(wordList.length))
  const pass = generatePass(len, wordList, true, effProps.entropyCheck.checked).trim().replace(/ /g, '-')

  effProps.passId.innerText = pass
  effProps.passLength.innerText = pass.length + ' characters'
  effProps.setSize.innerText = wordList.length.toLocaleString() + ' words'
  effProps.passEntropy.innerText = Math.floor(len * Math.log2(wordList.length)) + ' bits'
}
