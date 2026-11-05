"use strict"

const altProps = {
  "passId": document.getElementById('alt-pass'),
  "passLength": document.getElementById('alt-length'),
  "passEntropy": document.getElementById('alt-entropy'),
  "setSize": document.getElementById('alt-set-size'),
  "entropyCheck": document.getElementById('alt-entropy-check'),
  "passCheck": document.getElementById('alt-check'),
}

/**
 * Generate an Alternate passphrase based on the chosen word list.
 * @param {string} selection - An Alternate word list.
 */
function generateAlternate(selection) {
  const commonWordLists = () => [
    ...alternatePgp,          //  512 words
    ...alternateMnemonikey,   // 4096 words
    ...alternateOrchardAlpha, // 1296 words
    ...alternateOrchardQWERTY,// 1296 words
    ...alternatePokerware,    // 5304 words
    ...alternateVAN[0],       //  432 words
    ...alternateVAN[1],       //  373 words
    ...alternateVAN[2],       //  402 words
    ...alternateWordle,       // 5790 words
    ...bitcoinEN,             // 2048 words
    ...dicewareNLP[0],        // 1296 words
    ...dicewareNLP[1],        // 7776 words
    ...effDistant,            // 1296 words
    ...effLong,               // 7776 words
    ...effShort,              // 1296 words
    ...moneroEN,              // 1626 words
  ]

  const obscureWordLists = () => [
    ...Object.keys(alternateColors), //  1029 words
    ...alternateEyeware,             //  8192 words
    ...alternateObscure,             // 19392 words
    ...alternateSimpsons,            //  5000 words
    ...alternateSkey,                //  2048 words
    ...alternateTrump,               //  8192 words
    ...alternateZxcvbn,              // 30000 words
    ...dicewareEN,                   //  8192 words
    ...dicewareBeale,                //  7776 words
    ...effGameOfThrones,             //  4000 words
    ...effHarryPotter,               //  4000 words
    ...effStarTrek,                  //  4000 words
    ...effStarWars,                  //  4000 words
    ...pseudoDibels,                 //  3215 words
  ]

  const everyWordList = () => [
    ...commonWordLists(),
    ...obscureWordLists(),
  ]

  const alternateWordLists = {
    'Afrikaans':              alternateAF,
    'Belarusian':             alternateBE,
    'Croatian':               alternateHR,
    'Elvish':                 alternateElvish,
    'Backronyms':             everyWordList().filter(word => /^[a-z]+$/i.test(word)),
    'Common Words Only':      commonWordLists().map(word => word.toLowerCase()),
    'Deseret Alphabet':       alternateDeseret,
    'Every Word List':        everyWordList(),
    'Shavian Alphabet':       alternateShavian,
    'Klingon':                alternateKlingon,
    'Lord of the Rings':      alternateEyeware,
    'Mongolian':              alternateMN,
    'Obscure':                alternateObscure,
    'Orchard Street Alpha':   alternateOrchardAlpha,
    'Orchard Street QWERTY':  alternateOrchardQWERTY,
    'PGP':                    alternatePgp,
    'Pokerware':              alternatePokerware,
    'Simpsons':               alternateSimpsons,
    'Serbian':                alternateSR,
    'S/KEY':                  alternateSkey,
    'Trump':                  alternateTrump,
    'Ukranian':               alternateUK,
    'Verb, Adjective, Noun':  generateVAN(),
    'Wordle':                 alternateWordle,
    'zxcvbn':                 alternateZxcvbn,
  }

  if (selection === 'Colors') return generateColors()
  if (selection === 'Mnemonikey') return generateMnemonikey()
  if (selection === 'Verb, Adjective, Noun') return generateVAN()

  const wordList = uniquesOnly(alternateWordLists[selection]) // Force unique elements in array.
  const entropy = getEntropy()
  const len = Math.ceil(entropy / Math.log2(wordList.length))

  altProps.passCheck.innerText = '';

  if (selection === 'Backronyms') {
    const results = generateBackronym(wordList, altProps.entropyCheck.checked)

    const backronym = results.backronym.split('').map(word => {
      return `<p>${word}</p>`;
    }).join('.') + '.';

    // Put generatePass() or generatePassphrase() in generateBackronym?
    const pass = results.passphrase.map(word => { return `<p>${word}</p>`; }).join('-');

    altProps.passId.classList.add('backronym')
    altProps.passId.classList.remove('colors')
    altProps.passId.innerHTML = backronym + '<br/>' + pass
    altProps.passEntropy.innerText = results.security + ' bits'
    altProps.passLength.innerText = pass.replace(/<\/?span>/g, '').length + ' characters'
    altProps.setSize.innerText = wordList.length.toLocaleString() + ' words'
  } else {
    const pass = generatePass(len, wordList, true, altProps.entropyCheck.checked).trim().replace(/ /g, '-')

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
  altProps.passCheck.innerText = '';
}

/**
 * Generate a Mnemonikey passphrase.
 */
function generateMnemonikey() {
  const crc_table = (() => {
    const table = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      table[n] = c;
    }
    return table;
  })();

  // CRC-32 (IEEE), same as Go's crc32.ChecksumIEEE / zlib.crc32
  const crc32 = (bytes) => {
    let c = 0xffffffff;
    for (const b of bytes) c = crc_table[(c ^ b) & 0xff] ^ (c >>> 8);
    return (c ^ 0xffffffff) >>> 0;
  };

  const randomBits = () => {
    const bits = 128; // Seed phrases are 128 bits
    const buf = new Uint8Array(Math.ceil(bits / 8));
    crypto.getRandomValues(buf);
    let n = 0n;
    for (const b of buf) n = (n << 8n) | BigInt(b);
    return n & ((1n << BigInt(bits)) - 1n);
  };

  // big-endian, left-padded wiht zero bits
  const toBytes = (n, len) => {
    const out = new Uint8Array(len);
    for (let i = len - 1; i >= 0; i--) { out[i] = Number(n & 0xFFn); n >>= 8n; }
    return out;
  };

  const words = [];
  const wordList = uniquesOnly(alternateMnemonikey); // Force unique elements in array.
  const len = 13; // Seed phrases are static at 13 words + 1 checksum word
  const epoch = 1672531200; // 2023-01-01T00:00:00Z
  const creationOffset = secRand(Math.floor(Date.now() / 1000) - epoch + 1);
  const version = 0n;
  const seed = randomBits();
  let payload = (version << 159n) | (seed << 31n) | BigInt(creationOffset);
  const checksum = BigInt(crc32(toBytes(payload, 21)) & 0x1f);

  payload = (payload << 5n) | checksum;

  for (let i = 13; i >= 0; i--) words.push(alternateMnemonikey[Number((payload >> BigInt(12 * i)) & 0xfffn)]);

  const pass = words.join('-');
  altProps.passId.innerText = pass;
  altProps.passEntropy.innerText = Math.floor(len * Math.log2(wordList.length)) + ' bits';
  altProps.setSize.innerText = wordList.length + ' words';
  altProps.passLength.innerText = pass.length + ' characters';
  altProps.passCheck.innerText = 'Integrated checksum.';
}

/**
 * Generate an SKEY passphrase.
 * @return {Array} An array containing the passphrase, its length, and the entropy.
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
  altProps.passCheck.innerText = '';
}
