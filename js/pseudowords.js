"use strict"

const pseudoProps = {
  "passId": document.getElementById('pseudo-pass'),
  "passLength": document.getElementById('pseudo-length'),
  "passEntropy": document.getElementById('pseudo-entropy'),
  "setSize": document.getElementById('pseudo-set-size'),
  "passCheck": document.getElementById('pseudo-check'),
  "entropyCheck": document.getElementById('pseudo-entropy-check')
}


/** Generate a pseudowords password. */
function generatePseudowords() {
  let ret = []
  let displayCheck = false
  const pseudo = document.getElementById('pseudo-options').value

  if (pseudo === 'Apple Keychain') {
    ret = generateApple()
    pseudoProps.setSize.innerHTML = "It's <a href='https://github.com/atoponce/webpassgen/blob/5598bb9dbc3658d33ec4b58b800a62d410571940/js/pseudowords.js#L65-L82'>complicated</a>"
  } else if (pseudo === 'Bubble Babble') {
    ret = generateBabble()
    displayCheck = true
    pseudoProps.setSize.innerText = "65,536 pseudowords"
  } else if (pseudo === 'Daefen') {
    ret = generateDaefen()
    pseudoProps.setSize.innerText = "3,456 syllables"
  } else if (pseudo === 'DIBELS') {
    ret = generateDibels()
    pseudoProps.setSize.innerText = pseudoDibels.length.toLocaleString() + " pseudowords"
  } else if (pseudo === 'Koremutake') {
    ret = generateKoremutake()
    pseudoProps.setSize.innerText = "128 syllables"
  } else if (pseudo === 'Lepron') {
    ret = generateLepron()
    pseudoProps.setSize.innerText = "362,797,056 pseudowords"
  } else if (pseudo === 'Letterblock Diceware') {
    ret = generateLetterblock()
    displayCheck = true
    pseudoProps.setSize.innerText = '1,679,616 blocks'
  } else if (pseudo === 'Munemo') {
    ret = generateMunemo()
    pseudoProps.setSize.innerText = "100 syllables"
  } else if (pseudo === 'Proquints') {
    ret = generateProquints()
    pseudoProps.setSize.innerText = "65,536 pseudowords"
  } else if (pseudo === 'Urbit') {
    ret = generateUrbit()
    pseudoProps.setSize.innerText = "65,536 pseudowords"
  }

  const pass = ret[0]
  const ent = ret[1]

  pseudoProps.passId.innerText = pass
  pseudoProps.passLength.innerText = pass.length + ' characters'
  pseudoProps.passEntropy.innerText = ent + ' bits'

  if (displayCheck) {
    pseudoProps.passCheck.innerText = 'Integrated checksum.'
  } else {
    pseudoProps.passCheck.innerText = ''
  }
}

/**
 * Generate a Keychain formatted password.
 * @return {Array} The password string, the length of the password, and the entropy of the password.
 */
function generateApple() {
  /**
   * Calculate the entropy of an Apple password containing n-blocks.
   * @param {number} n - The number of blocks in the password.
   * @return {number} Entropy in bits.
   */
  var apple = function (n) {
    /*
      See https://web.archive.org/web/20210430183515/https://twitter.com/AaronToponce/status/1131406726069084160 for full analysis.

      For n ≥ 1 blocks, the entropy in bits per block is:
        log2(
          (6n - 1)      //  One lowercase alphabetic character is randomly capitalized
          * 19^(4n - 1) //  The total possible combinations of consonants
          * 6^(2n)      //  The total possible combinations of vowels
          * 10 * 2n     //  An 'edge' character is a random digit
        )

      E.G.:
        DVccvc:                      log2( 5 * 19^3  * 6^2 * 10 * 2) ~=  24.558 bits
        cvCcvD-cvccvc:               log2(11 * 19^7  * 6^4 * 10 * 4) ~=  48.857 bits
        cvcCvc-Dvccvc-cvccvc:        log2(17 * 19^11 * 6^6 * 10 * 6) ~=  72.231 bits
        cvccVc-cvccvD-cvccvc-cvccvc: log2(23 * 19^15 * 6^8 * 10 * 8) ~=  95.244 bits
        et cetera, et cetera, et cetera.
    */
    return Math.floor(Math.log2((6 * n - 1) * 19 ** (4 * n - 1) * 6 ** (2 * n) * 20 * n))
  }

  const pass = []
  const digits = '0123456789'
  const vowels = 'aeiouy'
  const consonants = 'bcdfghjkmnpqrstvwxz'
  const entropy = getEntropy()

  let n = 1 // number of blocks

  while (apple(n) < entropy) {
    n++
  }

  for (let i = 0; i < n; i++) {
    pass[6 * i] = generatePass(1, consonants, false, pseudoProps.entropyCheck.checked)
    pass[6 * i + 1] = generatePass(1, vowels, false, pseudoProps.entropyCheck.checked)
    pass[6 * i + 2] = generatePass(1, consonants, false, pseudoProps.entropyCheck.checked)
    pass[6 * i + 3] = generatePass(1, consonants, false, pseudoProps.entropyCheck.checked)
    pass[6 * i + 4] = generatePass(1, vowels, false, pseudoProps.entropyCheck.checked)
    pass[6 * i + 5] = generatePass(1, consonants, false, pseudoProps.entropyCheck.checked)
  }

  let digitLoc = 0
  let charLoc = 0
  const edge = secRand(2 * n, pseudoProps.entropyCheck.checked) // [0, 2n)
  const digit = generatePass(1, digits, false, pseudoProps.entropyCheck.checked)

  if (edge % 2 === 0) {
    digitLoc = 3 * edge
  } else {
    digitLoc = 3 * edge + 2
  }

  pass[digitLoc] = digit

  do {
    charLoc = secRand(pass.length, pseudoProps.entropyCheck.checked)
  } while (charLoc === digitLoc)

  pass[charLoc] = pass[charLoc].toUpperCase()

  for (let i = n - 1; i > 0; i--) {
    pass.splice(6 * i, 0, '-')
  }

  return [pass.join(''), apple(n)]
}

/**
 * Generate a Bubble Babble compliant password. Contains checksum.
 * @return {Array} The password string, the length of the password, and the entropy of the password.
 */
function generateBabble() {
  // Spec: https://web.mit.edu/kenta/www/one/bubblebabble/spec/jrtrjwzi/draft-huima-01.txt
  // Code based on https://github.com/kpalin/bubblepy
  const vowels = 'aeiouy'
  const consonants = 'bcdfghklmnprstvzx'
  const bytes = Math.ceil(getEntropy() / 8)
  const entropy = new Uint8Array(bytes)
  let pass = 'x'
  let checksum = 1

  for (let i = 0; i < entropy.length; i++) {
    entropy[i] = secRand(256, pseudoProps.entropyCheck.checked)
  }

  for (let i = 0; i <= entropy.length; i += 2) {
    if (i >= entropy.length) {
      pass += vowels[checksum % 6] + consonants[16] + vowels[Math.floor(checksum / 6)]
      break
    }

    const byte1 = entropy[i]
    pass += vowels[(((byte1 >> 6) & 3) + checksum) % 6]
    pass += consonants[(byte1 >> 2) & 15]
    pass += vowels[((byte1 & 3) + Math.floor(checksum / 6)) % 6]

    if (i + 1 >= entropy.length) {
      break
    }

    const byte2 = entropy[i + 1]
    pass += consonants[(byte2 >> 4) & 15]
    pass += '-'
    pass += consonants[byte2 & 15]

    checksum = (checksum * 5 + byte1 * 7 + byte2) % 36
  }

  pass += 'x'

  return [pass, entropy.length * 8]
}

/**
 * Generate a Daefen-compliant password.
 * @return {Array} An array containing the password, its length, and the entropy.
 */
function generateDaefen() {
  const syllables = []
  const consonants = 'bcdfghjklmnprstvwz'
  const vowels = 'aeiouy'
  const entropy = getEntropy()

  let pass = ''

  // taken from https://github.com/alexvandesande/Daefen/blob/master/index.js
  // vowel + consonant
  for (let i = 0; i < vowels.length; i++) {
    for (let j = 0; j < consonants.length; j++) {
      syllables.push(vowels[i] + consonants[j])
    }
  }

  // consonant + vowel
  for (let i = 0; i < consonants.length; i++) {
    for (let j = 0; j < vowels.length; j++) {
      syllables.push(consonants[i] + vowels[j])
    }
  }

  // consonant + vowel + vowel
  for (let i = 0; i < consonants.length; i++) {
    for (let j = 0; j < vowels.length; j++) {
      for (let k = 0; k < vowels.length; k++) {
        syllables.push(consonants[i] + vowels[j] + vowels[k])
      }
    }
  }

  // consonant + vowel + consonant
  for (let i = 0; i < consonants.length; i++) {
    for (let j = 0; j < vowels.length; j++) {
      for (let k = 0; k < consonants.length; k++) {
        syllables.push(consonants[i] + vowels[j] + consonants[k])
      }
    }
  }

  // vowel + consonant + vowel
  for (let i = 0; i < vowels.length; i++) {
    for (let j = 0; j < consonants.length; j++) {
      for (let k = 0; k < vowels.length; k++) {
        syllables.push(vowels[i] + consonants[j] + vowels[k])
      }
    }
  }

  const len = Math.ceil(entropy / Math.log2(syllables.length)) // 16 bits per "word"

  /**
   * Determine if the letter is a conosonant.
   * @param {string} letter - A letter to be added to the password.
   * @return True if the letter is a consonant, false if it is a vowel.
   */
  var isConsonant = function (letter) {
    return consonants.indexOf(letter) >= 0
  }

  for (let i = 0; i < len; i ++) {
    let n = secRand(syllables.length, pseudoProps.entropyCheck.checked)
    let lastWord = pass.split('-').slice(-1)[0]

    if (
      pass === '' || lastWord.length === syllables[n].length ||
      (
        lastWord.length < 5 &&
        isConsonant(lastWord.slice(-1)) &&
        isConsonant(syllables[n].slice(0, 1))
      )) {
      pass += syllables[n]
    } else {
      pass += '-' + syllables[n]
    }
  }

  pass = pass.replace(/\b[a-z]/g, function(f) {
    return f.toUpperCase()
  })

  return [pass, Math.floor(len * Math.log2(syllables.length))]
}

/**
 * Generate a DIBELS password.
 * @return {Array} The password string, the length of the password, and the entropy of the password.
 */
function generateDibels() {
  // Word lists taken from:
  //   - 6th edition progress monitoring materials: https://web.archive.org/web/20191102033345/https://dibels.uoregon.edu/assessment/index/materialdownload?agree=true#dibels
  //   - 8th edition benchmark materials: https://dibels.uoregon.edu/materials/dibels#materials
  //   - 8th edition progress monitoring materials: https://dibels.uoregon.edu/materials/dibels#progress
  //   - Acadia Learning (formerly DIBELS Next): https://acadiencelearning.org/acadience-learning-online-materials-download/
  // Only grades K-3 contain Nonsense Word Fluency (NWF) words
  const wordList = uniquesOnly(pseudoDibels)
  const entropy = getEntropy()
  const wordCount = Math.ceil(entropy / Math.log2(wordList.length))

  let pass = generatePass(wordCount, wordList, true, pseudoProps.entropyCheck.checked).trim()
  pass = pass.replace(/ /g, '-')

  return [pass, Math.floor(wordCount * Math.log2(wordList.length))]
}

/**
 * Generate a Munemo password.
 * @return {Array} The password string, the length of the password, and the entropy of the password.
 */
function generateMunemo() {
  // https://github.com/jmettraux/munemo
  /**
   * Recursive function to build an encoded string from a given number.
   * @param {number} num - The number to encode.
   * @param {string} str - The encoded string.
   * @return {string} The encoded string.
   */
  var tos = function (num, str) {
    const munemo = [
      'ba',  'bi',  'bu',  'be',  'bo',  'cha', 'chi', 'chu', 'che', 'cho',
      'da',  'di',  'du',  'de',  'do',  'fa',  'fi',  'fu',  'fe',  'fo',
      'ga',  'gi',  'gu',  'ge',  'go',  'ha',  'hi',  'hu',  'he',  'ho',
      'ja',  'ji',  'ju',  'je',  'jo',  'ka',  'ki',  'ku',  'ke',  'ko',
      'la',  'li',  'lu',  'le',  'lo',  'ma',  'mi',  'mu',  'me',  'mo',
      'na',  'ni',  'nu',  'ne',  'no',  'pa',  'pi',  'pu',  'pe',  'po',
      'ra',  'ri',  'ru',  're',  'ro',  'sa',  'si',  'su',  'se',  'so',
      'sha', 'shi', 'shu', 'she', 'sho', 'ta',  'ti',  'tu',  'te',  'to',
      'tsa', 'tsi', 'tsu', 'tse', 'tso', 'wa',  'wi',  'wu',  'we',  'wo',
      'ya',  'yi',  'yu',  'ye',  'yo',  'za',  'zi',  'zu',  'ze',  'zo'
    ]

    const mod = num % 100n
    const rem = num / 100n
    str += munemo[mod]

    if (rem > 0) {
      return tos(rem, str)
    }

    return str
  }

  const minEntropy = getEntropy()
  const isNegative = secRand(2, pseudoProps.entropyCheck.checked)
  let num = 0n

  // Half the key space is negative, half is non-negative
  for (let i = 0; i < minEntropy - 1; i++) {
    num += BigInt(secRand(2, pseudoProps.entropyCheck.checked) * 2 ** i)
  }

  let pass = tos(num, '')

  if (isNegative) {
    // 'xa' = -1 * num:
    //    fowohazehikorawihomeho =  1989259826396086294829
    //  xafowohazehikorawihomeho = -1989259826396086294829
    pass = 'xa' + pass
  }

  return [pass, minEntropy]
}

/**
 * Generate a Koremutake password.
 * @return {Array} The password string, the length of the password, and the entropy of the password.
 */
function generateKoremutake() {
  // https://shorl.com/koremutake.php
  /**
   * Recursive function to build an encoded string from a given number.
   * @param {number} num - The number to encode.
   * @param {string} str - The encoded string.
   * @return {string} The encoded string.
   */
  var tos = function (num, str) {
    const koremutake = [
      'ba',  'be',  'bi',  'bo',  'bu',  'by',  'da',  'de',
      'di',  'do',  'du',  'dy',  'fa',  'fe',  'fi',  'fo',
      'fu',  'fy',  'ga',  'ge',  'gi',  'go',  'gu',  'gy',
      'ha',  'he',  'hi',  'ho',  'hu',  'hy',  'ja',  'je',
      'ji',  'jo',  'ju',  'jy',  'ka',  'ke',  'ki',  'ko',
      'ku',  'ky',  'la',  'le',  'li',  'lo',  'lu',  'ly',
      'ma',  'me',  'mi',  'mo',  'mu',  'my',  'na',  'ne',
      'ni',  'no',  'nu',  'ny',  'pa',  'pe',  'pi',  'po',
      'pu',  'py',  'ra',  're',  'ri',  'ro',  'ru',  'ry',
      'sa',  'se',  'si',  'so',  'su',  'sy',  'ta',  'te',
      'ti',  'to',  'tu',  'ty',  'va',  've',  'vi',  'vo',
      'vu',  'vy',  'bra', 'bre', 'bri', 'bro', 'bru', 'bry',
      'dra', 'dre', 'dri', 'dro', 'dru', 'dry', 'fra', 'fre',
      'fri', 'fro', 'fru', 'fry', 'gra', 'gre', 'gri', 'gro',
      'gru', 'gry', 'pra', 'pre', 'pri', 'pro', 'pru', 'pry',
      'sta', 'ste', 'sti', 'sto', 'stu', 'sty', 'tra', 'tre'
    ]

    const mod = num % 128n
    const rem = num / 128n
    str += koremutake[mod]

    if (rem > 0) {
      return tos(rem, str)
    }

    return str
  }

  const minEntropy = getEntropy()
  let num = 0n

  // Unlike Munemo, Koremutake encodes unsigned integers.
  for (let i = 0; i < minEntropy; i++) {
    num += BigInt(secRand(2, pseudoProps.entropyCheck.checked) * 2 ** i)
  }

  let pass = tos(num, '')

  return [pass, minEntropy]
}

/**
 * Generate a Lepron pseudoword password.
 * @return {Array} The password string, the length of the password, and the entropy of the password.
 */
function generateLepron() {
  // https://www.cambridgeclarion.org/34.html
  const start = [
   ['c','cp'], ['b','bh'], ['p','xm'], ['d','bs'], ['r','ts'], ['s','chl'],
   ['m','kh'], ['l','dw'], ['t','kl'], ['h','kr'], ['f','chr'], ['g','ps'],
   ['n','x'], ['w','sch'], ['v','gn'], ['j','gh'], ['pr','spl'], ['st','shr'],
   ['tr','spr'], ['ch','sk'], ['br','kn'], ['fl','squ'], ['cr','thr'], ['gr','tw'],
   ['k','rh'], ['sh','scr'], ['qu','sm'], ['fr','ph'], ['bl','wr'], ['sp','str'],
   ['cl','sn'], ['dr','sw'], ['sl','z'], ['pl','th'], ['y','sc'], ['gl','wh'],
  ]

  const vowel = [
    ['a'], ['e'], ['i'], ['o'], ['u', 'oi'], ['ee', 'ea', 'au', 'ua', 'ya', 'y', 'oo', 'ai', 'io']
  ]

  const middle = [
    ['t', 'mpl'], ['l', 'nf'], ['r', 'gg'], ['n', 'nv'], ['m', 'lt'], ['v', 'dd'],
    ['c', 'rb'], ['d', 'bb'], ['s', 'ch'], ['g', 'rl'], ['p', 'pl'], ['b', 'pr'],
    ['st', 'sp'], ['ll', 'sh'], ['nt', 'bl'], ['nd', 'str'], ['ss', 'rs'], ['rr', 'br'],
    ['w', 'gn'], ['f', 'rg'], ['mp', 'tr'], ['ct', 'j'], ['rt', 'cr'], ['tt', 'cc'],
    ['mb', 'y'], ['ff', 'rc'], ['x', 'gr'], ['h', 'rd'], ['th', 'pt'], ['nn', 'nc'],
    ['qu', 'ph'], ['rm', 'pp'], ['sc', 'k'], ['ns', 'rn'], ['mm', 'ng'], ['z', 'ck'],
  ]

  const end = [
    ['r', 'rry'], ['n', 'gh'], ['t', 'wl'], ['l', 'lk'], ['te', 'nge'], ['nt', 'ft'],
    ['m', 'sk'], ['d', 'wn'], ['s', 'na'], ['re', 'be'], ['ne', 'gy'], ['p', 'rm'],
    ['st', 'ny'], ['y', 'cs'], ['w', 'sm'], ['se', 'nch'], ['ck', 'f'], ['nd', 'ld'],
    ['ll', 'dge'], ['ry', 'ght'], ['de', 'rk'], ['ss', 'ze'], ['c', 'th'], ['ve', 'ff'],
    ['g', 'ch'], ['le', 'ble'], ['nce', 'rn'], ['sh', 'tch'], ['ty', 'mp'], ['ce', 'lt'],
    ['ge', 'pe'], ['ng', 'nk'], ['ct', 'k'], ['b', 'ke'], ['me', 'rd'], ['rt', 'x'],
  ]

  const entropy = getEntropy()
  const minEntropy = Math.log2(36 ** 4 * 6 ** 3)

  // <start><vowel><middle><vowel><middle><vowel><end>
  const len = Math.ceil(entropy / minEntropy)

  let pass = []

  // There is probably a cleaner way to do this, but at least it's readable.
  for (let i = 0; i < len; i++) {
    let idx1 = secRand(start.length, pseudoProps.entropyCheck.checked)
    let idx2 = secRand(start[idx1].length, pseudoProps.entropyCheck.checked)
    let tmp = start[idx1][idx2]

    idx1 = secRand(vowel.length, pseudoProps.entropyCheck.checked)
    idx2 = secRand(vowel[idx1].length, pseudoProps.entropyCheck.checked)
    tmp += vowel[idx1][idx2]

    idx1 = secRand(middle.length, pseudoProps.entropyCheck.checked)
    idx2 = secRand(middle[idx1].length, pseudoProps.entropyCheck.checked)
    tmp += middle[idx1][idx2]

    idx1 = secRand(vowel.length, pseudoProps.entropyCheck.checked)
    idx2 = secRand(vowel[idx1].length, pseudoProps.entropyCheck.checked)
    tmp += vowel[idx1][idx2]

    idx1 = secRand(middle.length, pseudoProps.entropyCheck.checked)
    idx2 = secRand(middle[idx1].length, pseudoProps.entropyCheck.checked)
    tmp += middle[idx1][idx2]

    idx1 = secRand(vowel.length, pseudoProps.entropyCheck.checked)
    idx2 = secRand(vowel[idx1].length, pseudoProps.entropyCheck.checked)
    tmp += vowel[idx1][idx2]

    idx1 = secRand(end.length, pseudoProps.entropyCheck.checked)
    idx2 = secRand(end[idx1].length, pseudoProps.entropyCheck.checked)
    tmp += end[idx1][idx2]

    pass.push(tmp)
  }

  pass = pass.join('-')

  return [pass, Math.floor(len * minEntropy)]
}

/**
 * Generate a Letterblock password. Contains checksum.
 * @return {Array} The password string, the length of the password, and the entropy of the password.
 */
function generateLetterblock() {
  // https://www.draketo.de/software/letterblock-diceware
  // Diverged from above with:
  //  - '$' and '%' appended to make the checksum delimiters 6 characters
  //  - Treating digits as leet-speak
  /**
   * Determines if the string is a digit.
   * @param {string} str - The string to check.
   * @return True if the string is a digit, false otherwise.
   */
  var isDigit = function (str) {
    return str.length === 1 && str.match(/[0-9]/)
  }

  /**
   * Replace a string with a leet-speak version.
   * @param {string} str - A stringified number.
   * @return A leet-speak version of the number.
   */
  var replaceDigit = function (str) {
    if (str === '0') {
      return 'o'
    } else if (str === '1') {
      return 'l'
    } else if (str === '2') {
      return 'z'
    } else if (str === '3') {
      return 'e'
    } else if (str === '4') {
      return 'a'
    } else if (str === '5') {
      return 's'
    } else if (str === '6') {
      return 'b'
    } else if (str === '7') {
      return 't'
    } else if (str === '8') {
      return 'b'
    } else if (str === '9') {
      return 'g'
    }
  }

  /**
   * A recursive function to build a cross-product array of strings based on the contents of "arr".
   * @param {Array} arr - An array of four random strings from the "letters" multi-dimensional array.
   * @param {Array} res - The cross-product of the elements on "arr".
   * @param {number} ctr - A counter to keep track of the number of digits in the string.
   */
  var getCombos = function (arr, res, ctr) {
    const ptr0 = ctr.toString(2).padStart(4, '0')[0]  // most significant bit in bin(ctr)
    const ptr1 = ctr.toString(2).padStart(4, '0')[1]
    const ptr2 = ctr.toString(2).padStart(4, '0')[2]
    const ptr3 = ctr.toString(2).padStart(4, '0')[3]  // least significant bit in bin(ctr)

    if (
      arr[0][ptr0] !== undefined &&
      arr[1][ptr1] !== undefined &&
      arr[2][ptr2] !== undefined &&
      arr[3][ptr3] !== undefined
    ) {
      res.push(arr[0][ptr0] + arr[1][ptr1] + arr[2][ptr2] + arr[3][ptr3]) // the cross-product of "arr"
    }

    ctr++

    if (ctr < 16) { // 0 ('0000') through 15 ('1111')
      getCombos(arr, res, ctr)
    }
  }

  /**
   * Get the highest weighted bigram in the array.
   * @param {Array} arr - An array of bigram candidates.
   * @return The highest weighted bigram.
   */
  var calculateScores = function (arr) {
    let results = {}

    for (let i = 0; i < arr.length; i++) {
      let str = arr[i]
      let score = 0

      for (let j = 0; j < str.length - 1; j++) {
        if (isDigit(str[j])) {
          score += bigrams[replaceDigit(str[j]) + str[j + 1].toLowerCase()]
        } else if (isDigit(str[j + 1])) {
          score += bigrams[str[j].toLowerCase() + replaceDigit(str[j + 1])]
        } else {
          score += bigrams[str[j].toLowerCase() + str[j + 1].toLowerCase()]
        }
      }

      results[str] = score
    }

    return Object.keys(results).reduce(function (a, b) {
      if (results[a] > results[b]) {
        return a
      }

      return b
    })
  }

  const entropy = getEntropy()
  const letters = [
    ['1',  'A',  'J',  'a',  'h', 'px'],
    ['26', 'BC', 'LR', 'bc', 'i', 'r'],
    ['37', 'DH', 'N',  'd',  'j', 't'],
    ['48', 'E',  'PX', 'e',  'k', 'u'],
    ['59', 'FK', 'U',  'f',  'm', 'v'],
    ['0',  'QM', 'VW', 'gq', 'o', 'w']
  ]
  const delimiters = '.+-=@%'
  const blockEntropy = Math.log2(36 ** 4)
  const numBlocks = Math.ceil(entropy / blockEntropy)
  const totalEntropy = Math.floor(numBlocks * blockEntropy)
  const blocks = []
  const checks = []

  let pass = ''

  for (let i = 0; i < numBlocks; i++) {
    const jail = []
    const combos = []
    let block = ''
    let check = 0

    for (let j = 0; j < 4; j++) {
      const randNum = secRand(36, pseudoProps.entropyCheck.checked)
      const row = Math.floor(randNum / 6)
      const col = randNum % 6

      let cell = letters[row][col]
      jail.push(cell)

      check += row + 1 // Indexed at 1 per the original proposal
    }

    getCombos(jail, combos, 0)

    let winner = calculateScores(combos)

    blocks.push(winner)
    checks.push(check)
  }

  for (let i = 0; i < blocks.length; i++) {
    pass += blocks[i]

    if (checks[i + 1] !== undefined) {
      pass += delimiters[(checks[i] + checks[i + 1]) % 6]
    }
  }

  return [pass, totalEntropy]
}

/**
 * Generate a Proquints-compliant password.
 * @return {Array} The password string, the length of the password, and the entropy of the password.
 */
function generateProquints() {
  // https://arxiv.org/html/0901.4016
  const vowels = 'aiou'
  const consonants = 'bdfghjklmnprstvz'
  const entropy = getEntropy()
  const len = Math.ceil(entropy / 16)

  let pass = consonants[secRand(16, pseudoProps.entropyCheck.checked)]

  for (let i = len; i > 0; i--) {
    pass += vowels[secRand(4, pseudoProps.entropyCheck.checked)]
    pass += consonants[secRand(16, pseudoProps.entropyCheck.checked)]
    pass += vowels[secRand(4, pseudoProps.entropyCheck.checked)]

    if (i === 1) {
      break
    }

    pass += consonants[secRand(16, pseudoProps.entropyCheck.checked)]
    pass += '-'
    pass += consonants[secRand(16, pseudoProps.entropyCheck.checked)]
  }

  pass += consonants[secRand(16, pseudoProps.entropyCheck.checked)]

  return [pass, len * 16]
}

/**
 * Generate an Urbit phonetic password.
 * @return {Array} An array containing the password, its length, and the entropy.
 */
function generateUrbit() {
  const prefixes = [
    "doz", "mar", "bin", "wan", "sam", "lit", "sig", "hid", "fid", "lis", "sog", "dir", "wac", "sab", "wis", "sib",
    "rig", "sol", "dop", "mod", "fog", "lid", "hop", "dar", "dor", "lor", "hod", "fol", "rin", "tog", "sil", "mir",
    "hol", "pas", "lac", "rov", "liv", "dal", "sat", "lib", "tab", "han", "tic", "pid", "tor", "bol", "fos", "dot",
    "los", "dil", "for", "pil", "ram", "tir", "win", "tad", "bic", "dif", "roc", "wid", "bis", "das", "mid", "lop",
    "ril", "nar", "dap", "mol", "san", "loc", "nov", "sit", "nid", "tip", "sic", "rop", "wit", "nat", "pan", "min",
    "rit", "pod", "mot", "tam", "tol", "sav", "pos", "nap", "nop", "som", "fin", "fon", "ban", "mor", "wor", "sip",
    "ron", "nor", "bot", "wic", "soc", "wat", "dol", "mag", "pic", "dav", "bid", "bal", "tim", "tas", "mal", "lig",
    "siv", "tag", "pad", "sal", "div", "dac", "tan", "sid", "fab", "tar", "mon", "ran", "nis", "wol", "mis", "pal",
    "las", "dis", "map", "rab", "tob", "rol", "lat", "lon", "nod", "nav", "fig", "nom", "nib", "pag", "sop", "ral",
    "bil", "had", "doc", "rid", "moc", "pac", "rav", "rip", "fal", "tod", "til", "tin", "hap", "mic", "fan", "pat",
    "tac", "lab", "mog", "sim", "son", "pin", "lom", "ric", "tap", "fir", "has", "bos", "bat", "poc", "hac", "tid",
    "hav", "sap", "lin", "dib", "hos", "dab", "bit", "bar", "rac", "par", "lod", "dos", "bor", "toc", "hil", "mac",
    "tom", "dig", "fil", "fas", "mit", "hob", "har", "mig", "hin", "rad", "mas", "hal", "rag", "lag", "fad", "top",
    "mop", "hab", "nil", "nos", "mil", "fop", "fam", "dat", "nol", "din", "hat", "nac", "ris", "fot", "rib", "hoc",
    "nim", "lar", "fit", "wal", "rap", "sar", "nal", "mos", "lan", "don", "dan", "lad", "dov", "riv", "bac", "pol",
    "lap", "tal", "pit", "nam", "bon", "ros", "ton", "fod", "pon", "sov", "noc", "sor", "lav", "mat", "mip", "fip"]
  const suffixes = [
    "zod", "nec", "bud", "wes", "sev", "per", "sut", "let", "ful", "pen", "syt", "dur", "wep", "ser", "wyl", "sun",
    "ryp", "syx", "dyr", "nup", "heb", "peg", "lup", "dep", "dys", "put", "lug", "hec", "ryt", "tyv", "syd", "nex",
    "lun", "mep", "lut", "sep", "pes", "del", "sul", "ped", "tem", "led", "tul", "met", "wen", "byn", "hex", "feb",
    "pyl", "dul", "het", "mev", "rut", "tyl", "wyd", "tep", "bes", "dex", "sef", "wyc", "bur", "der", "nep", "pur",
    "rys", "reb", "den", "nut", "sub", "pet", "rul", "syn", "reg", "tyd", "sup", "sem", "wyn", "rec", "meg", "net",
    "sec", "mul", "nym", "tev", "web", "sum", "mut", "nyx", "rex", "teb", "fus", "hep", "ben", "mus", "wyx", "sym",
    "sel", "ruc", "dec", "wex", "syr", "wet", "dyl", "myn", "mes", "det", "bet", "bel", "tux", "tug", "myr", "pel",
    "syp", "ter", "meb", "set", "dut", "deg", "tex", "sur", "fel", "tud", "nux", "rux", "ren", "wyt", "nub", "med",
    "lyt", "dus", "neb", "rum", "tyn", "seg", "lyx", "pun", "res", "red", "fun", "rev", "ref", "mec", "ted", "rus",
    "bex", "leb", "dux", "ryn", "num", "pyx", "ryg", "ryx", "fep", "tyr", "tus", "tyc", "leg", "nem", "fer", "mer",
    "ten", "lus", "nus", "syl", "tec", "mex", "pub", "rym", "tuc", "fyl", "lep", "deb", "ber", "mug", "hut", "tun",
    "byl", "sud", "pem", "dev", "lur", "def", "bus", "bep", "run", "mel", "pex", "dyt", "byt", "typ", "lev", "myl",
    "wed", "duc", "fur", "fex", "nul", "luc", "len", "ner", "lex", "rup", "ned", "lec", "ryd", "lyd", "fen", "wel",
    "nyd", "hus", "rel", "rud", "nes", "hes", "fet", "des", "ret", "dun", "ler", "nyr", "seb", "hul", "ryl", "lud",
    "rem", "lys", "fyn", "wer", "ryc", "sug", "nys", "nyl", "lyn", "dyn", "dem", "lux", "fed", "sed", "bec", "mun",
    "lyr", "tes", "mud", "nyt", "byr", "sen", "weg", "fyr", "mur", "tel", "rep", "teg", "pec", "nel", "nev", "fes"]
  const entropy = getEntropy()
  const len = Math.ceil(entropy / 16) // 16 bits per "word"

  let pass = '~'

  for (let i = len; i > 0; i--) {
    pass += prefixes[secRand(256, pseudoProps.entropyCheck.checked)] + suffixes[secRand(256, pseudoProps.entropyCheck.checked)]

    if (i > 1) {
      pass += '-'
    }
  }

  return [pass, len * 16]
}