"use strict"

const altProps = {
  "passId": document.getElementById('alt-pass'),
  "passLength": document.getElementById('alt-length'),
  "passEntropy": document.getElementById('alt-entropy'),
  "setSize": document.getElementById('alt-set-size'),
  "entropyCheck": document.getElementById('alt-entropy-check'),
}

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
  } else if (selection === 'Backronyms' || selection === 'Every Word List') {
    wordList = Object.keys(alternateColors)           //  1029 words
    wordList = wordList.concat(alternateEyeware)      //  8192 words
    wordList = wordList.concat(alternateObscure)      // 19392 words
    wordList = wordList.concat(alternatePgp)          //   512 words
    wordList = wordList.concat(alternatePokerware)    //  5304 words
    wordList = wordList.concat(alternateSimpsons)     //  5000 words
    wordList = wordList.concat(alternateSkey)         //  2048 words
    wordList = wordList.concat(alternateTrump)        //  8192 words
    wordList = wordList.concat(alternateVAN[0])       //   432 words
    wordList = wordList.concat(alternateVAN[1])       //   373 words
    wordList = wordList.concat(alternateVAN[2])       //   402 words
    wordList = wordList.concat(alternateWordle)       //  5790 words
    wordList = wordList.concat(alternateZxcvbn)       // 30000 words
    wordList = wordList.concat(bitcoinEN)             //  2048 words
    wordList = wordList.concat(dicewareEN)            //  8192 words
    wordList = wordList.concat(dicewareBeale)         //  7776 words
    wordList = wordList.concat(dicewareNLP[0])        //  1296 words
    wordList = wordList.concat(dicewareNLP[1])        //  7776 words
    wordList = wordList.concat(effDistant)            //  1296 words
    wordList = wordList.concat(effGameOfThrones)      //  4000 words
    wordList = wordList.concat(effHarryPotter)        //  4000 words
    wordList = wordList.concat(effLong)               //  7776 words
    wordList = wordList.concat(effShort)              //  1296 words
    wordList = wordList.concat(effStarTrek)           //  4000 words
    wordList = wordList.concat(effStarWars)           //  4000 words
    wordList = wordList.concat(moneroEN)              //  1626 words
    wordList = wordList.concat(pseudoDibels)          //  3215 words
    if (selection === 'Backronyms') {
      // Ensure only alphabetic characters.
      wordList = wordList.filter(element => /^[a-z]+$/gi.test(element))
    }
  } else if (selection === 'Common Words Only') {
    wordList = alternatePgp
    wordList = wordList.concat(alternatePokerware)
    wordList = wordList.concat(alternateVAN[0])
    wordList = wordList.concat(alternateVAN[1])
    wordList = wordList.concat(alternateVAN[2])
    wordList = wordList.concat(alternateWordle)
    wordList = wordList.concat(bitcoinEN)
    wordList = wordList.concat(dicewareNLP[0])
    wordList = wordList.concat(dicewareNLP[1])
    wordList = wordList.concat(effDistant)
    wordList = wordList.concat(effLong)
    wordList = wordList.concat(effShort)
    wordList = wordList.concat(moneroEN)
    wordList = wordList.map(v => v.toLowerCase()) // Lowercase every character.
  } else if (selection === 'Deseret Alphabet') {
    wordList = alternateDeseret
  } else if (selection === 'Shavian Alphabet') {
    wordList = alternateShavian
  } else if (selection === 'Klingon') {
    wordList = alternateKlingon
  } else if (selection === 'Lord of the Rings') {
    wordList = alternateEyeware
  } else if (selection === 'Mongolian') {
    wordList = alternateMN
  } else if (selection === 'Obscure') {
    wordList = alternateObscure
  } else if (selection === 'PGP') {
    wordList = alternatePgp
  } else if (selection === 'Pokerware') {
    wordList = alternatePokerware
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
  } else if (selection === 'Verb, Adjective, Noun') {
    return generateVAN()
  } else if (selection === 'Wordle') {
    wordList = alternateWordle
  } else if (selection === 'zxcvbn') {
    wordList = alternateZxcvbn
  }

  wordList = uniquesOnly(wordList)  // Force unique elements in array.

  const entropy = getEntropy()
  const len = Math.ceil(entropy / Math.log2(wordList.length))

  if (selection === 'Backronyms') {
    const results = generateBackronym(wordList, altProps.entropyCheck.checked)

    const backronym = results.backronym.split('').map(word => {
      return `<p>${word}</p>`;
    }).join('.') + '.';

    // Put generatePass() or generatePassphrase() in generateBackronym?
    pass = results.passphrase.map(word => { return `<p>${word}</p>`; }).join('-');

    altProps.passId.classList.add('backronym')
    altProps.passId.classList.remove('colors')
    altProps.passId.innerHTML = backronym + '<br/>' + pass
    altProps.passEntropy.innerText = results.security + ' bits'
    altProps.passLength.innerText = pass.replace(/<\/?span>/g, '').length + ' characters'
    altProps.setSize.innerText = wordList.length.toLocaleString() + ' words'
  } else {
    pass = generatePass(len, wordList, true, altProps.entropyCheck.checked).trim()
    pass = pass.replace(/ /g, '-')
    altProps.passId.classList.remove('backronym')
    altProps.passId.classList.remove('colors')
    altProps.passEntropy.innerText = Math.floor(len * Math.log2(wordList.length)) + ' bits'
    altProps.passId.innerText = pass
    altProps.passLength.innerText = [...pass].length + ' characters'
    altProps.setSize.innerText = wordList.length.toLocaleString() + ' words'
  }
}

/**
 * Generate a passphrase built up from an acronym (a "backronym").
 * Rewritten taking ideas from https://github.com/Sc00bz/acronym-passphrase/,
 * who was inspired by my original approach.
 * @param {Array} wordList - A list of words to choose frome.
 * @param {Boolean} useEntropy - Boolean to use collected entropy.
 * @return {Object} - Dictionary containing the acronym, passphrase, and security.
 */
function generateBackronym(wordList, useEntropy) {
  wordList.sort();

  const _readWords = (words) => {
    // Break up the massive word list into 2 groups:
    // 1. by starting letter, ignoring case, "a" through "z".
    const byLetter = words.reduce((acc, word) => {
      const firstLetter = word[0].toLowerCase();
      (acc[firstLetter] = acc[firstLetter] || []).push(word);
      return acc;
    }, {});

    // 2. by word length, ordered ascending, 1 character to max
    const byLength = words.reduce((acc, word) => {
      const length = word.length;
      (acc[length] = acc[length] || []).push(word);
      return acc;
    }, {});

    // byLetter and byLength need to be iterable
    return [words.length, Object.values(byLetter), Object.values(byLength)];
  }

  const entropy = getEntropy();
  const wordStats = _readWords(wordList);

  const byLetter = wordStats[1];
  const maxChars = byLetter.length;
  const byLetterCount = new Array(maxChars);

  const byLength = wordStats[2];
  const byLengthKeySpace = [];

  // byLetterCount index = word length - 1
  for (let i = 0; i < maxChars; i++) {
    byLetterCount[i] = byLetter[i].length;
  }

  // byLength is a two-dimensional array of arrays
  // group is each individual nested array of increasing word length
  for (const group of byLength) {
    let sum = 0n; // BigInt
    const seen = new Set();

    // backronym is each word in an individual array (group)
    for (const backronym of group) {
      const word = backronym.toLowerCase();

      if (!seen.has(word)) { // track already processed case-insensitive words
        let keyspace = 1n; // BigInt

        seen.add(word);

        // char is each individual character in the word
        for (const char of backronym) {
          const charIndex = (char.charCodeAt(0) | 32) - 97;

          // keyspace is the total number of combinations for each n-character word
          // EG, "pass" = count("p") × count("a") × count("s") × count("s")
          keyspace *= BigInt(byLetterCount[charIndex]);
        }

        // sum is the total keyspace for each n-character word.
        // EG, for 4-char words: sum = keyspace("pass") + keyspace("past") + keyspace("pats") + ...
        sum += keyspace;
      }
    }

    // massive numbers, thus BigInt(n) as JavaScript only supports 53 bits
    byLengthKeySpace.push(sum);

    // no need to calculate further. save unnecessary cpu time
    if (Math.log2(Number(sum)) >= entropy) {
      break; // out of group of byLength completely
    }
  }

  let length;
  let security;

  // !!! WARNING !!!
  // the index of byLengthKeySpace tells us our word length
  // this assumes every index 0 through n is filled without gaps
  // so i need to be very familiar with my word list
  // maybe i'll fix this later, but i know what word lists i'm shipping and gaps
  // don't exist within the entropy contstraints of this project
  for (const value of byLengthKeySpace) {
    if (Math.log2(Number(value)) >= entropy) {
      length = byLengthKeySpace.indexOf(value);
      security = Math.floor(Math.log2(Number(value)));
      break;
    }
  }

  // !!! WARNING !!!
  // same as above. beware of gaps if you don't know your word list
  // pick a random backronym based on the previous length
  // we know which index to pick by identifying the index in byLengthKeySpace
  const random = secRand(byLength[length].length, useEntropy);
  const backronym = byLength[length][random];
  const passphrase = [];

  // build the passphrase from the chosen backronym
  // for each character, randomly select a word from the total word list that
  // starts with that character
  for (const char of backronym) {
    const letter = (char.charCodeAt(0) | 32) - 97; 
    const rand = secRand(byLetter[letter].length, useEntropy);
    passphrase.push(byLetter[letter][rand]);
  }

  return {backronym, passphrase, security};
}

/** Generate a color passphrase */
function generateColors() {
  let tmp = ''
  const colorKeys = Object.keys(alternateColors)
  const entropy = getEntropy()
  const len = Math.ceil(entropy / Math.log2(colorKeys.length))

  altProps.passId.classList.remove("backronym") // Ensure leading word character is not red
  altProps.passId.classList.add("colors")

  let pass = generatePass(len, colorKeys, true, altProps.entropyCheck.checked).split(' ')
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

  altProps.passId.innerHTML = tmp.replace(/> </g, '>-<').trim()
  tmp = ''

  for (let i = 0; i < len; i++) {
    tmp += pass[i]
  }

  pass = tmp
  const totalLen = pass.length + (len - 1)
  altProps.passLength.innerText = totalLen + ' characters'
  altProps.setSize.innerText = colorKeys.length.toLocaleString() + ' words'
  altProps.passEntropy.innerText = Math.floor(len * Math.log2(colorKeys.length)) + ' bits'
}

/**
 * Generate an SKEY passphrase.
 * @return {Array} An array containing the password, its length and the entropy.
 */
function generateSKey() {
  const wordList = uniquesOnly(pseudoSKey)  // Force unique elements in array.
  const entropy = getEntropy()
  const len = Math.ceil(entropy / Math.log2(wordList.length))

  let pass = ''

  for (let i = 0; i < len; i++) {
    pass += wordList[secRand(wordList.length, altProps.entropyCheck.checked)]
    if (i !== len - 1) {
      pass += '-'
    }
  }

  return [pass, wordList.length, Math.floor(len * Math.log2(wordList.length))]
}

/** Generate a Verbs/Adjectives/Nouns passphrase */
function generateVAN() {
  const entropy = getEntropy()
  const wordCount = alternateVAN[0].length + alternateVAN[1].length + alternateVAN[2].length
  const vanEntropy = Math.log2(alternateVAN[0].length * alternateVAN[1].length * alternateVAN[2].length)
  const len = Math.ceil(entropy / vanEntropy)


  let pass
  let vans = []

  for (let i = 0; i < len; i++) {
    vans[i]  = generatePass(1, alternateVAN[0], false, altProps.entropyCheck.checked)
    vans[i] += generatePass(1, alternateVAN[1], false, altProps.entropyCheck.checked)
    vans[i] += generatePass(1, alternateVAN[2], false, altProps.entropyCheck.checked)
  }

  pass = vans.join("-")
  altProps.passId.innerText = pass
  altProps.passEntropy.innerText = Math.floor(len * vanEntropy) + ' bits'
  altProps.setSize.innerText = wordCount.toLocaleString() + ' words'
  altProps.passLength.innerText = pass.length + ' characters'
}
