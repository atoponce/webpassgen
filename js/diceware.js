"use strict"

const dicewareProps = {
  "passId": document.getElementById('diceware-pass'),
  "passLength": document.getElementById('diceware-length'),
  "passEntropy": document.getElementById('diceware-entropy'),
  "setSize": document.getElementById('diceware-set-size'),
  "entropyCheck": document.getElementById('diceware-entropy-check'),
}

/**
 * Generate a Diceware Natural Language Passphrase, alternating adj./noun.
 * @param {Array} wordList - A 2-dimensional array of adjectives and nouns.
 * @param {Boolean} useEntropy - Boolean to use collected entropy.
 * @return {String} - The generated password as a hyphenated string.
 */
function generateNLP(wordList, useEntropy) {
  const entropy = getEntropy()
  const len = Math.ceil(entropy / Math.log2(wordList[0].length)) // adjectives
  const adjs = generatePass(len, wordList[0], true, useEntropy).split(' ')
  const nouns = generatePass(len, wordList[1], true, useEntropy).split(' ')
  const wordCount = wordList[0].length + wordList[1].length

  let pass = []
  let bits = 0
  let counter = 0

  // building up the password alternating: adj-noun-adj-noun-...
  while (bits <= entropy) {
    if (counter % 2 === 0) {
      pass.push(adjs[counter])
      bits += Math.log2(wordList[0].length)
    } else {
      pass.push(nouns[counter])
      bits += Math.log2(wordList[1].length)
    }

    counter++
  }

  if (pass.length % 2 === 1) { // adj_1, noun_1, ..., adj_n
    pass.unshift(pass.pop())   // adj_n, adj_1, noun_1, ...
  }

  dicewareProps.passEntropy.innerText = Math.floor(bits) + ' bits'
  dicewareProps.setSize.innerText = wordCount.toLocaleString() + ' words'

  return pass.join('-')
}

/**
 * Generate a Diceware passphrase based on the chosen language word list.
 * @param {string} selection - A Diceware language word list.
 */
function generateDiceware(selection) {
  const dicewareLists = {
    'Basque'         : dicewareEU,
    'Bulgarian'      : dicewareBG,
    'Catalan'        : dicewareCA,
    'Chinese'        : dicewareCN,
    'Czech'          : dicewareCZ,
    'Danish'         : dicewareDA,
    'Dutch'          : dicewareNL,
    'English'        : dicewareEN,
    'English (Beale)': dicewareBeale,
    'English (NLP)'  : dicewareNLP,
    'Esperanto'      : dicewareEO,
    'Estonian'       : dicewareET,
    'Finnish'        : dicewareFI,
    'French'         : dicewareFR,
    'German'         : dicewareDE,
    'Greek'          : dicewareEL,
    'Hebrew'         : dicewareIW,
    'Hungarian'      : dicewareHU,
    'Italian'        : dicewareIT,
    'Japanese'       : dicewareJP,
    'Latin'          : dicewareLA,
    'Maori'          : dicewareMI,
    'Norwegian'      : dicewareNO,
    'Polish'         : dicewarePL,
    'Portuguese'     : dicewarePT,
    'Romanian'       : dicewareRO,
    'Russian'        : dicewareRU,
    'Slovak'         : dicewareSK,
    'Slovenian'      : dicewareSL,
    'Spanish'        : dicewareES,
    'Swedish'        : dicewareSV,
    'Turkish'        : dicewareTR,
    'Ukranian'       : dicewareUK,
  }

  let pass
  const wordList = uniquesOnly(dicewareLists[selection])  // Force unique elements in array.
  const entropy = getEntropy()

  if (selection === 'English (NLP)') {
    pass = generateNLP(wordList, dicewareProps.entropyCheck.checked)
  } else {
    // Every other Diceware word list.
    const len = Math.ceil(entropy / Math.log2(wordList.length))

    pass = generatePass(len, wordList, true, dicewareProps.entropyCheck.checked).trim().replace(/ /g, '-')
    dicewareProps.passEntropy.innerText = Math.floor(len * Math.log2(wordList.length)) + ' bits'
    dicewareProps.setSize.innerText = wordList.length.toLocaleString() + ' words'
  }

  dicewareProps.passId.innerText = pass
  dicewareProps.passLength.innerText = pass.length + ' characters'
}
