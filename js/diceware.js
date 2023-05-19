"use strict"

/**
 * Generate a Diceware passphrase based on the chosen language word list.
 * @param {string} selection - A Diceware language word list.
 */
function generateDiceware(selection) {
  let pass = ''
  let wordList = ''

  if (selection === 'Basque') {
    wordList = dicewareEU
  } else if (selection === 'Bulgarian') {
    wordList = dicewareBG
  } else if (selection === 'Catalan') {
    wordList = dicewareCA
  } else if (selection === 'Chinese') {
    wordList = dicewareCN
  } else if (selection === 'Czech') {
    wordList = dicewareCZ
  } else if (selection === 'Danish') {
    wordList = dicewareDA
  } else if (selection === 'Dutch') {
    wordList = dicewareNL
  } else if (selection === 'English') {
    wordList = dicewareEN
  } else if (selection === 'English (Beale)') {
    wordList = dicewareBeale
  } else if (selection === 'English (NLP)') {
    wordList = dicewareNLP
  } else if (selection === 'Esperanto') {
    wordList = dicewareEO
  } else if (selection === 'Estonian') {
    wordList = dicewareET
  } else if (selection === 'Finnish') {
    wordList = dicewareFI
  } else if (selection === 'French') {
    wordList = dicewareFR
  } else if (selection === 'German') {
    wordList = dicewareDE
  } else if (selection === 'Greek') {
    wordList = dicewareEL
  } else if (selection === 'Hebrew') {
    wordList = dicewareIW
  } else if (selection === 'Hungarian') {
    wordList = dicewareHU
  } else if (selection === 'Italian') {
    wordList = dicewareIT
  } else if (selection === 'Japanese') {
    wordList = dicewareJP
  } else if (selection === 'Latin') {
    wordList = dicewareLA
  } else if (selection === 'Maori') {
    wordList = dicewareMI
  } else if (selection === 'Norwegian') {
    wordList = dicewareNO
  } else if (selection === 'Polish') {
    wordList = dicewarePL
  } else if (selection === 'Portuguese') {
    wordList = dicewarePT
  } else if (selection === 'Romanian') {
    wordList = dicewareRO
  } else if (selection === 'Russian') {
    wordList = dicewareRU
  } else if (selection === 'Slovak') {
    wordList = dicewareSK
  } else if (selection === 'Slovenian') {
    wordList = dicewareSL
  } else if (selection === 'Spanish') {
    wordList = dicewareES
  } else if (selection === 'Swedish') {
    wordList = dicewareSV
  } else if (selection === 'Turkish') {
    wordList = dicewareTR
  }

  wordList = uniquesOnly(wordList)  // Force unique elements in array.

  const entropy = getEntropy()
  const passId = document.getElementById('diceware-pass')
  const passLength = document.getElementById('diceware-length')
  const passEntropy = document.getElementById('diceware-entropy')
  const entropyCheck = document.getElementById('diceware-entropy-check')

  let useEntropy = false

  if (entropyCheck.checked) {
    useEntropy = true
  }

  if (wordList.filter(Array.isArray).length === 2) {
    // We're working on the 'Natural Language Passwords' list
    const len = Math.ceil(entropy / Math.log2(wordList[0].length)) // adjectives
    const adjs = generatePass(len, wordList[0], true, useEntropy).split(' ')
    const nouns = generatePass(len, wordList[1], true, useEntropy).split(' ')

    let bits = 0
    let counter = 0

    // building up the password alternating: adj-noun-adj-noun-...
    while (bits <= entropy) {
      if (counter % 2 === 0) {
        pass += adjs[counter]
        bits += Math.log2(wordList[0].length)
      } else {
        pass += nouns[counter]
        bits += Math.log2(wordList[1].length)
      }

      pass += '-'
      counter++
    }

    pass = pass.replace(/-$/g, '')

    const tmpArr = pass.split('-')

    if (tmpArr.length % 2 === 1) {
      tmpArr.unshift(tmpArr.pop())
      pass = tmpArr.join('-')
    }

    passEntropy.innerText = Math.floor(bits) + ' bits,'
  } else {
    // Every other Diceware word list.
    const len = Math.ceil(entropy / Math.log2(wordList.length))

    pass = generatePass(len, wordList, true, useEntropy)
    pass = pass.replace(/ /g, '-')

    passEntropy.innerText = Math.floor(len * Math.log2(wordList.length)) + ' bits,'
  }

  passId.innerText = pass
  passLength.innerText = pass.length + ' characters.'
}

