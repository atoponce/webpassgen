// globals
const PAGECONTAINER = document.getElementsByTagName('body')[0]
const PREFERSDARKTHEME = window.matchMedia('(prefers-color-scheme: dark)')
const THEMESWITCHER = document.getElementById('theme_switcher')

function unicodeWarn() {
  if (localStorage.getItem('unicode_warned') === null) {
    document.getElementById('overlay').style.display = 'block'
    localStorage.setItem('unicode_warned', true)
  }
}

function setDarkTheme() {
  PAGECONTAINER.classList.add('dark-theme')
  localStorage.setItem('theme', 'dark')
  THEMESWITCHER.innerHTML = `
    <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='currentColor' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='feather feather-sun'>
      <circle cx='12' cy='12' r='5'></circle>
      <line x1='12' y1='1' x2='12' y2='3'></line>
      <line x1='12' y1='21' x2='12' y2='23'></line>
      <line x1='4.22' y1='4.22' x2='5.64' y2='5.64'></line>
      <line x1='18.36' y1='18.36' x2='19.78' y2='19.78'></line>
      <line x1='1' y1='12' x2='3' y2='12'></line>
      <line x1='21' y1='12' x2='23' y2='12'></line>
      <line x1='4.22' y1='19.78' x2='5.64' y2='18.36'></line>
      <line x1='18.36' y1='5.64' x2='19.78' y2='4.22'></line>
    </svg>
  `
}

function setLightTheme() {
  PAGECONTAINER.classList.remove('dark-theme')
  localStorage.setItem('theme', 'light')
  THEMESWITCHER.innerHTML = `
    <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='currentColor' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='feather feather-moon'>
      <path d='M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z'></path>
    </svg>
  `
}

function initTheme() {
  if (localStorage.getItem('theme') === 'dark') {
    // Dark Theme was set on page load because of previously set preference.
    setDarkTheme()
  } else if (
    // Dark Theme was set on page load because of OS preference.
    !localStorage.getItem('theme') &&
    PREFERSDARKTHEME &&
    PREFERSDARKTHEME.matches === true
  ) {
    setDarkTheme()
  } else {
    // Light Theme was assumed due to page default or user preference or OS preference.
    setLightTheme()
  }
}

function toggleTheme() {
  if (PAGECONTAINER.classList.contains('dark-theme')) {
    setLightTheme()
  } else {
    setDarkTheme()
  }
}

function getEntropy() {
  return parseInt(document.querySelector("input[name='entropy']:checked").value)
}

function getSourceList(source) {
  let sourceList

  if (source === 'diceware') {
    sourceList = document.getElementById('diceware-options').value
  } else if (source === 'eff') {
    sourceList = document.getElementById('eff-options').value
  } else if (source === 'alternate') {
    sourceList = document.getElementById('alt-options').value
  } else if (source === 'bitcoin') {
    sourceList = document.getElementById('bitcoin-options').value
  }

  return sourceList
}

function generatePassphrase(source) {
  const sourceList = getSourceList(source)

  if (source === 'diceware') {
    generateDiceware(sourceList)
  } else if (source === 'eff') {
    generateEff(sourceList)
  } else if (source === 'alternate') {
    generateAlternate(sourceList)
  } else if (source === 'bitcoin') {
    generateBitcoin(sourceList)
  }
}

function toggleEntropyVisibility() {
  const classes = document.getElementsByClassName('use-entropy')

  if (localStorage.hasOwnProperty('entropy')) {
    if (JSON.parse(localStorage.entropy).length > 0) {
      for (let i = 0; i < classes.length; i++) {
        classes[i].style.visibility = 'visible'
        classes[i].children[2].innerText = JSON.parse(localStorage.entropy).length
      }
    } else {
      for (let i = 0; i < classes.length; i++) {
        classes[i].style.visibility = 'hidden'
      }
    }
  }
}

function secRand(count, useEntropy) {
  let num = 0
  const min = 2 ** 16 % count
  const rand = new Uint16Array(1)

  if (useEntropy) {
    const entropy = JSON.parse(localStorage.entropy)

    if (entropy.length > 0) {
      num = entropy[0]
      entropy.shift()
      localStorage.entropy = JSON.stringify(entropy)
    }
  }

  do {
    num ^= crypto.getRandomValues(rand)[0]
  } while (num < min)

  toggleEntropyVisibility()

  return num % count
}

function uniquesOnly(list) {
  return [...new Set(list)] // enforce unique elements in array
}

function generatePass(len, set, spaces, useEntropy) {
  let pass = ''
  let passArr = ''

  if (typeof set === 'string') {
    passArr = set.split('')
  } else {
    passArr = set
  }

  for (let i = len; i > 0; i--) {
    if (useEntropy) {
      if (spaces) {
        pass += passArr[secRand(set.length, true)]
        pass += ' '
      } else {
        pass += passArr[secRand(set.length, true)]
      }
    } else {
      if (spaces) {
        pass += passArr[secRand(set.length, false)]
        pass += ' '
      } else {
        pass += passArr[secRand(set.length, false)]
      }
    }
  }

  return pass.trim()
}

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

  wordList = uniquesOnly(wordList)

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
    const len1 = Math.ceil(entropy / Math.log2(wordList[0].length)) // adjectives
    const len2 = Math.ceil(entropy / Math.log2(wordList[1].length)) // nouns
    const adjs = generatePass(len1, wordList[0], true, useEntropy).split(' ')
    const nouns = generatePass(len2, wordList[1], true, useEntropy).split(' ')

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

  wordList = uniquesOnly(wordList)

  const entropy = getEntropy()
  const len = Math.ceil(entropy / Math.log2(wordList.length))
  const passId = document.getElementById('eff-pass')
  const passLength = document.getElementById('eff-length')
  const passEntropy = document.getElementById('eff-entropy')
  const entropyCheck = document.getElementById('eff-entropy-check')

  let useEntropy = false

  if (entropyCheck.checked) {
    useEntropy = true
  }

  pass = generatePass(len, wordList, true, useEntropy)
  pass = pass.replace(/ /g, '-')
  passId.innerText = pass
  passLength.innerText = pass.length + ' characters.'
  passEntropy.innerText = Math.floor(len * Math.log2(wordList.length)) + ' bits,'
}

function generateAlternate(selection) {
  let pass = ''
  let wordList = ''

  if (selection === 'Colors') {
    return generateColors()
  } else if (selection === 'Elvish') {
    wordList = alternateElvish
  } else if (selection === 'English (All)') {
    wordList = Object.keys(alternateColors)           // 1029 words
    wordList = wordList.concat(alternatePgp)          //  512 words
    wordList = wordList.concat(alternatePokerware)    // 5304 words
    wordList = wordList.concat(alternateRockyou)      // 7776 words
    wordList = wordList.concat(alternateSimpsons)     // 5000 words
    wordList = wordList.concat(alternateSkey)         // 2048 words
    wordList = wordList.concat(alternateTrump)        // 8192 words
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
  } else if (selection === 'English (Deseret)') {
    wordList = alternateDeseret
  } else if (selection === 'English (Shavian)') {
    wordList = alternateShavian
  } else if (selection === 'Klingon') {
    wordList = alternateKlingon
  } else if (selection === 'PGP') {
    wordList = alternatePgp
  } else if (selection === 'Pokerware') {
    wordList = alternatePokerware
  } else if (selection === 'RockYou') {
    wordList = alternateRockyou
  } else if (selection === 'Simpsons') {
    wordList = alternateSimpsons
  } else if (selection === 'S/KEY') {
    wordList = alternateSkey
  } else if (selection === 'Trump') {
    wordList = alternateTrump
  }

  wordList = uniquesOnly(wordList)

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

  pass = generatePass(len, wordList, true, useEntropy)
  pass = pass.replace(/ /g, '-')
  passId.innerText = pass
  passLength.innerText = [...pass].length + ' characters.'
  passEntropy.innerText = Math.floor(len * Math.log2(wordList.length)) + ' bits,'
}

function isTooDark(hex) {
  const rgb = parseInt(hex, 16)
  const r = (rgb >> 16) & 0xff
  const g = (rgb >> 8) & 0xff
  const b = (rgb >> 0) & 0xff
  const l = 0.299 * r + 0.587 * g + 0.114 * b

  if (l > 79) {
    return false
  }

  return true
}

function isTooLight(hex) {
  const rgb = parseInt(hex, 16)
  const r = (rgb >> 16) & 0xff
  const g = (rgb >> 8) & 0xff
  const b = (rgb >> 0) & 0xff
  const l = 0.299 * r + 0.587 * g + 0.114 * b

  if (l < 176) {
    return false
  }

  return true
}

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

function generateBitcoin(selection) {
  let pass = ''
  let wordList = ''

  if (selection === 'Chinese (Simp)') {
    wordList = bitcoinCNSimp
  } else if (selection === 'Chinese (Trad)') {
    wordList = bitcoinCNTrad
  } else if (selection === 'Czech') {
    wordList = bitcoinCZ
  } else if (selection === 'English') {
    wordList = bitcoinEN
  } else if (selection === 'French') {
    wordList = bitcoinFR
  } else if (selection === 'Italian') {
    wordList = bitcoinIT
  } else if (selection === 'Japanese') {
    wordList = bitcoinJP
  } else if (selection === 'Korean') {
    wordList = bitcoinKR
  } else if (selection === 'Portuguese') {
    wordList = bitcoinPT
  } else if (selection === 'Spanish') {
    wordList = bitcoinES
  }

  wordList = uniquesOnly(wordList)

  var bytesToBinary = function (bytes) {
    let total = 0n

    for (let i = 0; i < bytes.length; i++) {
      total |= BigInt(bytes[i] * 256 ** (bytes.length - i - 1))
    }

    return total.toString(2)
  }

  var sha256 = function (bytes) {
    const crypto = window.crypto || window.msCrypto

    return crypto.subtle.digest('SHA-256', bytes).then(function (hash) {
      return hash
    })
  }

  const entropy = getEntropy()
  const requiredEntropy = Math.ceil(entropy / 32) * 32 // Multiple of 32 bits, per the bip39 spec
  const entropyCheck = document.getElementById('btc-entropy-check')

  let useEntropy = false

  if (entropyCheck.checked) {
    useEntropy = true
  }

  const entropyBuffer = new Uint8Array(Math.ceil(requiredEntropy / 8))

  for (let i = 0; i < entropyBuffer.length; i++) {
    entropyBuffer[i] = secRand(256, useEntropy)
  }

  sha256(entropyBuffer).then(function (digest) {
    sha256Digest = new Uint8Array(digest)

    const entropyBits = bytesToBinary(entropyBuffer).padStart(requiredEntropy, '0')
    const checkBits = bytesToBinary(sha256Digest)
      .padStart(256, '0')
      .substr(0, 11 - (requiredEntropy % 11))
    const allBits = entropyBits + checkBits

    const bitWords = allBits.match(/(.{1,11})/g)
    const words = bitWords.map(function (binary) {
      const index = parseInt(binary, 2)
      return wordList[index]
    })

    const passId = document.getElementById('btc-pass')
    const passLength = document.getElementById('btc-length')
    const passEntropy = document.getElementById('btc-entropy')
    const passCheck = document.getElementById('btc-check')

    pass = words.join('-')
    passId.innerText = pass
    passLength.innerText = pass.length + ' characters.'
    passEntropy.innerText = requiredEntropy + ' bits,'
    passCheck.innerText = 'Integrated checksum.'
  })
}

function generateApple() {
  var apple = function (n) {
    /*
      See https://twitter.com/AaronToponce/status/1131406726069084160 for full analysis.

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
  const entropyCheck = document.getElementById('pseudo-entropy-check')

  let useEntropy = false

  if (entropyCheck.checked) {
    useEntropy = true
  }

  let n = 1 // number of blocks

  while (apple(n) <= entropy) {
    n++
  }

  for (let i = 0; i < n; i++) {
    pass[6 * i] = generatePass(1, consonants, false, useEntropy)
    pass[6 * i + 1] = generatePass(1, vowels, false, useEntropy)
    pass[6 * i + 2] = generatePass(1, consonants, false, useEntropy)
    pass[6 * i + 3] = generatePass(1, consonants, false, useEntropy)
    pass[6 * i + 4] = generatePass(1, vowels, false, useEntropy)
    pass[6 * i + 5] = generatePass(1, consonants, false, useEntropy)
  }

  let digitLoc = 0
  let charLoc = 0
  const edge = secRand(2 * n, useEntropy) // [0, 2n)
  const digit = generatePass(1, digits, false, useEntropy)

  if (edge % 2 === 0) {
    digitLoc = 3 * edge
  } else {
    digitLoc = 3 * edge + 2
  }

  pass[digitLoc] = digit

  do {
    charLoc = secRand(pass.length, useEntropy)
  } while (charLoc === digitLoc)

  pass[charLoc] = pass[charLoc].toUpperCase()

  for (let i = n - 1; i > 0; i--) {
    pass.splice(6 * i, 0, '-')
  }

  return [pass.join(''), pass.length, apple(n)]
}

function generateBabble() {
  // Spec: https://web.mit.edu/kenta/www/one/bubblebabble/spec/jrtrjwzi/draft-huima-01.txt
  // Code based on https://github.com/kpalin/bubblepy
  const vowels = 'aeiouy'
  const consonants = 'bcdfghklmnprstvzx'
  const bytes = Math.ceil(getEntropy() / 8)
  const entropy = new Uint8Array(bytes)
  const entropyCheck = document.getElementById('pseudo-entropy-check')
  let pass = 'x'
  let checksum = 1

  let useEntropy = false

  if (entropyCheck.checked) {
    useEntropy = true
  }

  for (let i = 0; i < entropy.length; i++) {
    entropy[i] = secRand(256, useEntropy)
  }

  for (let i = 0; i <= entropy.length; i += 2) {
    if (i >= entropy.length) {
      pass += vowels[checksum % 6] + consonants[16] + vowels[Math.floor(checksum / 6)]
      break
    }

    byte1 = entropy[i]
    pass += vowels[(((byte1 >> 6) & 3) + checksum) % 6]
    pass += consonants[(byte1 >> 2) & 15]
    pass += vowels[((byte1 & 3) + Math.floor(checksum / 6)) % 6]

    if (i + 1 >= entropy.length) {
      break
    }

    byte2 = entropy[i + 1]
    pass += consonants[(byte2 >> 4) & 15]
    pass += '-'
    pass += consonants[byte2 & 15]

    checksum = (checksum * 5 + byte1 * 7 + byte2) % 36
  }

  pass += 'x'

  return [pass, pass.length, entropy.length * 8]
}

function generateMunemo() {
  // https://github.com/jmettraux/munemo
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

    mod = num % 100n
    rem = num / 100n
    str = munemo[mod] + str

    if (rem > 0) {
      return tos(rem, str)
    }

    return str
  }

  const entropyCheck = document.getElementById('pseudo-entropy-check')

  let useEntropy = false

  if (entropyCheck.checked) {
    useEntropy = true
  }

  const minEntropy = getEntropy()
  const isNegative = secRand(2, useEntropy)
  let num = 0n

  // Half the key space is negative, half is non-negative
  for (let i = 0; i < minEntropy - 1; i++) {
    num += BigInt(secRand(2, useEntropy) * 2 ** i)
  }

  let pass = tos(num, '')

  if (isNegative) {
    // 'xa' = -1 * num:
    //    fowohazehikorawihomeho =  1989259826396086294829
    //  xafowohazehikorawihomeho = -1989259826396086294829
    pass = 'xa' + pass
  }

  return [pass, pass.length, minEntropy]
}

function generateProquints() {
  // https://arxiv.org/html/0901.4016
  const vowels = 'aiou'
  const consonants = 'bdfghjklmnprstvz'
  const entropy = getEntropy()
  const len = Math.ceil(entropy / 16)
  const entropyCheck = document.getElementById('pseudo-entropy-check')

  let useEntropy = false

  if (entropyCheck.checked) {
    useEntropy = true
  }

  let pass = consonants[secRand(16, useEntropy)]

  for (let i = len; i > 0; i--) {
    pass += vowels[secRand(4, useEntropy)]
    pass += consonants[secRand(16, useEntropy)]
    pass += vowels[secRand(4, useEntropy)]

    if (i === 1) {
      break
    }

    pass += consonants[secRand(16, useEntropy)]
    pass += '-'
    pass += consonants[secRand(16, useEntropy)]
  }

  pass += consonants[secRand(16, useEntropy)]

  return [pass, pass.length, len * 16]
}

function generateLetterblock() {
  // https://www.draketo.de/software/letterblock-diceware
  // Diverged from above with:
  //  - '$' and '%' appended to make the checksum delimiters 6 characters
  //  - Treating digits as leet-speak
  var isDigit = function (str) {
    return str.length === 1 && str.match(/[0-9]/)
  }

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

  var getCombos = function (arr, res, ctr) {
    const ptr0 = ctr.toString(2).padStart(4, '0')[0]
    const ptr1 = ctr.toString(2).padStart(4, '0')[1]
    const ptr2 = ctr.toString(2).padStart(4, '0')[2]
    const ptr3 = ctr.toString(2).padStart(4, '0')[3]

    if (
      arr[0][ptr0] !== undefined &&
      arr[1][ptr1] !== undefined &&
      arr[2][ptr2] !== undefined &&
      arr[3][ptr3] !== undefined
    ) {
      res.push(arr[0][ptr0] + arr[1][ptr1] + arr[2][ptr2] + arr[3][ptr3])
    }

    ctr++

    if (ctr < 16) {
      getCombos(arr, res, ctr)
    }
  }

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
  const blockEntropy = 4 * Math.floor(Math.log2(36))
  const totalEntropy = Math.ceil(entropy / blockEntropy) * blockEntropy
  const numBlocks = totalEntropy / blockEntropy
  const blocks = []
  const checks = []
  const entropyCheck = document.getElementById('pseudo-entropy-check')

  let useEntropy = false

  if (entropyCheck.checked) {
    useEntropy = true
  }

  let pw = ''

  for (let i = 0; i < numBlocks; i++) {
    const jail = []
    const combos = []
    let block = ''
    let check = 0

    for (let j = 0; j < 4; j++) {
      const randNum = secRand(36, useEntropy)
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
    pw += blocks[i]

    if (checks[i + 1] !== undefined) {
      pw += delimiters[(checks[i] + checks[i + 1]) % 6]
    }
  }

  return [pw, pw.length, totalEntropy]
}

function generateDaefen() {
  const syllables = []
  const consonants = 'bcdfghjklmnprstvwz'
  const vowels = 'aeiouy'
  const entropy = getEntropy()
  const entropyCheck = document.getElementById('pseudo-entropy-check')

  let pass = ''
  let useEntropy = false

  if (entropyCheck.checked) {
    useEntropy = true
  }

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

  var isConsonant = function (letter) {
    return consonants.indexOf(letter) >= 0
  }

  for (let i = 0; i < len; i ++) {
    let n = secRand(syllables.length, useEntropy)
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

  return [pass, pass.length, Math.floor(len * Math.log2(syllables.length))]
}

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
  const entropyCheck = document.getElementById('pseudo-entropy-check')

  let useEntropy = false

  if (entropyCheck.checked) {
    useEntropy = true
  }

  let pass = '~'

  for (let i = len; i > 0; i--) {
    pass += prefixes[secRand(256, useEntropy)] + suffixes[secRand(256, useEntropy)]

    if (i > 1) {
      pass += '-'
    }
  }

  return [pass, pass.length, len * 16]
}

function generateSKey() {
  const wordList = uniquesOnly(pseudoSKey)
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

function generatePseudowords() {
  let ret = []
  let displayCheck = false
  const pseudo = document.getElementById('pseudo-options').value

  if (pseudo === 'Apple, Inc.') {
    ret = generateApple()
  } else if (pseudo === 'Bubble Babble') {
    ret = generateBabble()
    displayCheck = true
  } else if (pseudo === 'Daefen') {
    ret = generateDaefen()
  } else if (pseudo === 'Letterblock Diceware') {
    ret = generateLetterblock()
    displayCheck = true
  } else if (pseudo === 'Munemo') {
    ret = generateMunemo()
  } else if (pseudo === 'Proquints') {
    ret = generateProquints()
  } else if (pseudo === 'Urbit') {
    ret = generateUrbit()
  }

  const pass = ret[0]
  const ent = ret[2]
  const passId = document.getElementById('pseudo-pass')
  const passLength = document.getElementById('pseudo-length')
  const passEntropy = document.getElementById('pseudo-entropy')
  const passCheck = document.getElementById('pseudo-check')

  passId.innerText = pass
  passLength.innerText = pass.length + ' characters.'
  passEntropy.innerText = ent + ' bits,'

  if (displayCheck) {
    passCheck.innerText = 'Integrated checksum.'
  } else {
    passCheck.innerText = ''
  }
}

function generateRandom() {
  let s = ''
  let check = ''
  let displayCheck = false
  const entropy = getEntropy()
  const passId = document.getElementById('random-pass')
  const passLength = document.getElementById('random-length')
  const passEntropy = document.getElementById('random-entropy')
  const passCheck = document.getElementById('random-check')
  const option = document.getElementById('random-options').value

  // ASCII optgroup
  if (option === 'Base94') {
    for (let i = 0; i < 94; i++) {
      s += String.fromCharCode(33 + i)
    }
  } else if (option === 'Base85') {
    s = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!#$%&()*+-;<=>?@^_`{|}~'
  } else if (option === 'Base64') {
    s = '`!"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_'
  } else if (option === 'Base62') {
    s = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  } else if (option === 'Base58') {
    s = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
  } else if (option === 'Base52') {
    s = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  } else if (option === 'Base45') {
    s = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_$%*+-./:'
  } else if (option === 'Base36') {
    s = '0123456789abcdefghijklmnopqrstuvwxyz'
  } else if (option === 'Base32') {
    // Crockford's base32
    s = '0123456789abcdefghjkmnpqrstvwxyz'
  } else if (option === 'Base26') {
    s = 'abcdefghijklmnopqrstuvwxyz'
  } else if (option === 'Base16') {
    s = '0123456789abcdef'
  } else if (option === 'Base10') {
    s = '0123456789'
  } else if (option === 'Base8') {
    s = '01234567'
  } else if (option === 'Base4') {
    s = 'ACGT'
  } else if (option === 'Base2') {
    s = '01'
  }
  // Unicode optgroup
  else if (option === 'Emoji') {
    return generateEmoji()
  } else if (option === 'ISO 8859-1') {
    // Base188
    unicodeWarn()
    for (let i = 0; i < 94; i++) {
      // Standard ASCII
      s += String.fromCharCode(33 + i)
    }
    for (let i = 0; i < 95; i++) {
      s += String.fromCharCode(161 + i)
    }
    s = s.replace(String.fromCharCode(173), '') // soft-hyphen isn't graphical
  } else if (option === 'Latin Extended') {
    // Base256
    unicodeWarn()
    s = 'ḀḁḂḃḄḅḆḇḈḉḊḋḌḍḎḏḐḑḒḓḔḕḖḗḘḙḚḛḜḝḞḟḠḡḢḣḤḥḦḧḨḩḪḫḬḭḮḯḰḱḲḳḴḵḶḷḸḹḺḻḼḽḾḿ'
    s += 'ṀṁṂṃṄṅṆṇṈṉṊṋṌṍṎṏṐṑṒṓṔṕṖṗṘṙṚṛṜṝṞṟṠṡṢṣṤṥṦṧṨṩṪṫṬṭṮṯṰṱṲṳṴṵṶṷṸṹṺṻṼṽṾṿ'
    s += 'ẀẁẂẃẄẅẆẇẈẉẊẋẌẍẎẏẐẑẒẓẔẕẖẗẘẙẚẛẜẝẞẟẠạẢảẤấẦầẨẩẪẫẬậẮắẰằẲẳẴẵẶặẸẹẺẻẼẽẾế'
    s += 'ỀềỂểỄễỆệỈỉỊịỌọỎỏỐốỒồỔổỖỗỘộỚớỜờỞởỠỡỢợỤụỦủỨứỪừỬửỮữỰựỲỳỴỵỶỷỸỹỺỻỼỽỾỿ'
  } else if (option === 'Mac OS Roman') {
    // Base220
    unicodeWarn()
    for (let i = 0; i < 94; i++) {
      // Standard ASCII
      s += String.fromCharCode(33 + i)
    }
    // Excludes Unicode U+F8FF in the Corporate Private Use Area for the Apple logo
    s += 'ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®©™´¨≠ÆØ∞±≤≥¥µ∂∑∏π∫ªºΩæ'
    s += 'ø¿¡¬√ƒ≈∆«»…ÀÃÕŒœ–—“”‘’÷◊ÿŸ⁄€‹›ﬁﬂ‡·‚„‰ÂÊÁËÈÍÎÏÌÓÔÒÚÛÙıˆ˜¯˘˙˚¸˝˛ˇ'
  }

  const len = Math.ceil(entropy / Math.log2(s.length))
  const entropyCheck = document.getElementById('random-entropy-check')

  let useEntropy = false

  if (entropyCheck.checked) {
    useEntropy = true
  }

  pass = generatePass(len, s, false, useEntropy)

  if (option === 'Base32') {
    // Add Crockford's modulo 37 checksum
    let res = 0n
    const check = s + '*~$=u'
    displayCheck = true

    for (let i = 0; i < pass.length; i++) {
      res += BigInt(s.indexOf(pass[i]) * 32 ** (pass.length - i - 1))
    }

    pass += check[res % 37n]
  }

  passLength.innerText = pass.length + ' characters.'
  passId.removeAttribute('style') // from emoji
  passId.innerText = pass
  passEntropy.innerText = Math.floor(len * Math.log2(s.length)) + ' bits,'

  if (displayCheck) {
    passCheck.innerText = 'Integrated checksum.'
  } else {
    passCheck.innerText = ''
  }
}

function generateEmoji() {
  unicodeWarn()

  const entropy = getEntropy()
  const passId = document.getElementById('random-pass')
  const passLength = document.getElementById('random-length')
  const passEntropy = document.getElementById('random-entropy')
  const len = Math.ceil(entropy / Math.log2(randomEmoji.length))
  const entropyCheck = document.getElementById('random-entropy-check')

  let useEntropy = false
  if (entropyCheck.checked) {
    useEntropy = true
  }

  const pass = generatePass(len, randomEmoji, false, useEntropy)

  passLength.innerText = len + ' characters.'
  passId.style.fontFamily = 'Twemoji Mozilla'
  passId.innerText = pass
  passEntropy.innerText = Math.floor(len * Math.log2(randomEmoji.length)) + ' bits,'
}
