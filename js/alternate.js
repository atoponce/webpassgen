/**
 * Generate an Alternate passphrase based on the chosen word list.
 * @param {string} selection - An Alternate word list.
 */
function generateAlternate(selection) {
  let pass = ''
  let wordList = ''

  if (selection === 'Afrikaans') {
    wordList = alternateAF
  } else if (selection === 'Belarusian') {
    wordList = alternateBE
  } else if (selection === 'Colors') {
    return generateColors()
  } else if (selection === 'Croatian') {
    wordList = alternateHR
  } else if (selection === 'Elvish') {
    wordList = alternateElvish
  } else if (selection === 'Acronyms' || selection === 'Every Word List') {
    wordList = Object.keys(alternateColors)           // 1029 words
    wordList = wordList.concat(alternatePgp)          //  512 words
    wordList = wordList.concat(alternatePokerware)    // 5304 words
    wordList = wordList.concat(alternateRockyou)      // 7776 words
    wordList = wordList.concat(alternateSimpsons)     // 5000 words
    wordList = wordList.concat(alternateSkey)         // 2048 words
    wordList = wordList.concat(alternateTrump)        // 8192 words
    wordList = wordList.concat(alternateWordle)       // 5790 words
    wordList = wordList.concat(bitcoinEN)             // 2048 words
    wordList = wordList.concat(dicewareEN)            // 8192 words
    wordList = wordList.concat(dicewareBeale)         // 7776 words
    wordList = wordList.concat(dicewareNLP[0])        // 1296 words
    wordList = wordList.concat(dicewareNLP[1])        // 7776 words
    wordList = wordList.concat(effDistant)            // 1296 words
    wordList = wordList.concat(effGameOfThrones)      // 4000 words
    wordList = wordList.concat(effHarryPotter)        // 4000 words
    wordList = wordList.concat(effLong)               // 7776 words
    wordList = wordList.concat(effShort)              // 1296 words
    wordList = wordList.concat(effStarTrek)           // 4000 words
    wordList = wordList.concat(effStarWars)           // 4000 words
    wordList = wordList.concat(moneroEN)              // 1626 words
    if (selection === 'Acronyms') {
      wordList = wordList.filter(element => /^[a-z]+$/gi.test(element))
    }
  } else if (selection === 'Common Words Only') {
    wordList = alternatePgp
    wordList = wordList.concat(alternatePokerware)
    wordList = wordList.concat(alternateWordle)
    wordList = wordList.concat(bitcoinEN)
    wordList = wordList.concat(dicewareNLP[0])
    wordList = wordList.concat(dicewareNLP[1])
    wordList = wordList.concat(effDistant)
    wordList = wordList.concat(effLong)
    wordList = wordList.concat(effShort)
    wordList = wordList.concat(moneroEN)
  } else if (selection === 'Deseret Alphabet') {
    wordList = alternateDeseret
  } else if (selection === 'Shavian Alphabet') {
    wordList = alternateShavian
  } else if (selection === 'Klingon') {
    wordList = alternateKlingon
  } else if (selection === 'Mongolian') {
    wordList = alternateMN
  } else if (selection === 'PGP') {
    wordList = alternatePgp
  } else if (selection === 'Pokerware') {
    wordList = alternatePokerware
  } else if (selection === 'RockYou') {
    wordList = alternateRockyou
  } else if (selection === 'Simpsons') {
    wordList = alternateSimpsons
  } else if (selection === 'Serbian') {
    wordList = alternateSR
  } else if (selection === 'S/KEY') {
    wordList = alternateSkey
  } else if (selection === 'Trump') {
    wordList = alternateTrump
  } else if (selection === 'Ukranian') {
    wordList = alternateUK
  } else if (selection === 'Wordle') {
    wordList = alternateWordle
  }

  wordList = uniquesOnly(wordList)  // Force unique elements in array.

  const entropy = getEntropy()
  const len = Math.ceil(entropy / Math.log2(wordList.length))
  const passId = document.getElementById('alt-pass')
  const passLength = document.getElementById('alt-length')
  const passEntropy = document.getElementById('alt-entropy')
  const entropyCheck = document.getElementById('alt-entropy-check')

  let useEntropy = false

  if (entropyCheck.checked) {
    useEntropy = true
  }

  if (selection === 'Acronyms') {
    let counter = 2
    let results

    do {
      results = generateAcronym(counter, wordList, useEntropy)
      counter++
    } while (results.security < entropy)

    pass = results.passphrase
    passId.classList.add('acronym')
    passId.innerHTML = pass
    passEntropy.innerText = results.security + ' bits,'
  } else {
    pass = generatePass(len, wordList, true, useEntropy)
    pass = pass.replace(/ /g, '-')
    passId.classList.remove('acronym')
    passId.innerText = pass
    passEntropy.innerText = Math.floor(len * Math.log2(wordList.length)) + ' bits,'
  }

  passLength.innerText = [...pass].length + ' characters.'
}

/** Generate a passphrase based on an acronym */
function generateAcronym(wordCount, wordList, useEntropy) {
  var getSecurity = function (entropyList) {
    let total = 0

    for (let i = 0; i < entropyList.length; i++) {
      total += Math.log2(entropyList[i])
    }

    return Math.floor(total)
  }

  const candidates = []

  for (let i = 0; i < wordList.length; i++) {
    if (wordList[i].length === wordCount) {
      candidates.push(wordList[i])
    }
  }

  const num = secRand(candidates.length, useEntropy)
  const acronym = candidates[num]
  const initEntropy = candidates.length
  const entropies = [initEntropy]
  const passphraseWords = []

  for (let i = 0; i < acronym.length; i++) {
    const candidates = []

    for (let j = 0; j < wordList.length; j++) {
      if (wordList[j].charAt(0).toLowerCase() === acronym[i].charAt(0).toLowerCase()) {
        candidates.push("<span>" + wordList[j] + "</span>")
      }
    }

    const word = candidates[secRand(candidates.length, useEntropy)]
    passphraseWords.push(word)
    entropies.push(candidates.length)
  }

  const security = getSecurity(entropies)
  const passphrase = passphraseWords.join('-');

  return {passphrase, security}
}

/** Generate a color passphrase */
function generateColors() {
  let tmp = ''
  const colorKeys = Object.keys(alternateColors)
  const entropy = getEntropy()
  const len = Math.ceil(entropy / Math.log2(colorKeys.length))
  const passId = document.getElementById('alt-pass')
  const passLength = document.getElementById('alt-length')
  const passEntropy = document.getElementById('alt-entropy')
  const entropyCheck = document.getElementById('alt-entropy-check')

  let useEntropy = false

  if (entropyCheck.checked) {
    useEntropy = true
  }

  let pass = generatePass(len, colorKeys, true, useEntropy).split(' ')
  const chosenTheme = localStorage.theme

  for (let i = 0; i < len; i++) {
    const hex = alternateColors[pass[i]]

    if (chosenTheme === undefined || chosenTheme === 'light') {
      if (isTooLight(hex)) {
        tmp +=
          "<span class='bold light_contrast' style='color:#" + hex + ";'>" + pass[i] + '</span> '
      } else {
        tmp += "<span class='bold' style='color:#" + hex + ";'>" + pass[i] + '</span> '
      }
    } else if (chosenTheme === 'dark') {
      if (isTooDark(hex)) {
        tmp +=
          "<span class='bold dark_contrast' style='color:#" + hex + ";'>" + pass[i] + '</span> '
      } else {
        tmp += "<span class='bold' style='color:#" + hex + ";'>" + pass[i] + '</span> '
      }
    }
  }

  passId.innerHTML = tmp.replace(/> </g, '>-<').trim()
  tmp = ''

  for (let i = 0; i < len; i++) {
    tmp += pass[i]
  }

  pass = tmp
  const totalLen = pass.length + (len - 1)
  passLength.innerText = totalLen + ' characters.'
  passEntropy.innerText = Math.floor(len * Math.log2(colorKeys.length)) + ' bits,'
}

/**
 * Generate an SKEY passphrase.
 * @returns {Array} An array containing the password, its length and the entropy.
 */
function generateSKey() {
  const wordList = uniquesOnly(pseudoSKey)  // Force unique elements in array.
  const entropy = getEntropy()
  const len = Math.ceil(entropy / Math.log2(wordList.length))
  const entropyCheck = document.getElementById('alt-entropy-check')

  let useEntropy = false

  if (entropyCheck.checked) {
    useEntropy = true
  }

  let pass = ''

  for (let i = 0; i < len; i++) {
    pass += wordList[secRand(wordList.length, useEntropy)]
    if (i !== len - 1) {
      pass += '-'
    }
  }

  return [pass, wordList.length, Math.floor(len * Math.log2(wordList.length))]
}
