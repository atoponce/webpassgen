// globals
const PAGECONTAINER = document.getElementsByTagName('body')[0]
const PREFERSDARKTHEME = window.matchMedia('(prefers-color-scheme: dark)')
const THEMESWITCHER = document.getElementById('theme_switcher')

function unicodeWarn () {
  if (localStorage.getItem('unicode_warned') === null) {
    document.getElementById('overlay').style.display = 'block'
    localStorage.setItem('unicode_warned', true)
  }
}

function setDarkTheme () {
  PAGECONTAINER.classList.add('dark-theme')
  localStorage.setItem('theme', 'dark')
  THEMESWITCHER.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-sun">
      <circle cx="12" cy="12" r="5"></circle>
      <line x1="12" y1="1" x2="12" y2="3"></line>
      <line x1="12" y1="21" x2="12" y2="23"></line>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
      <line x1="1" y1="12" x2="3" y2="12"></line>
      <line x1="21" y1="12" x2="23" y2="12"></line>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
    </svg>
  `
}

function setLightTheme () {
  PAGECONTAINER.classList.remove('dark-theme')
  localStorage.setItem('theme', 'light')
  THEMESWITCHER.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-moon">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
    </svg>
  `
}

function initTheme () {
  // Dark Theme was set on page load because of previously set preference.
  if (localStorage.getItem('theme') === 'dark') setDarkTheme()
  // Dark Theme was set on page load because of OS preference.
  else if (!localStorage.getItem('theme') && PREFERSDARKTHEME && PREFERSDARKTHEME.matches === true) setDarkTheme()
  // Light Theme was assumed due to page default or user preference or OS preference.
  else setLightTheme()
}

function toggleTheme () {
  if (PAGECONTAINER.classList.contains('dark-theme')) setLightTheme()
  else setDarkTheme()
}

function getEntropy () {
  return parseInt(document.querySelector("input[name='entropy']:checked").value)
}

function getSourceList (source) {
  let sourceList

  switch (source) {
    case 'diceware':
      sourceList = document.getElementById('diceware-options').value
      break
    case 'eff':
      sourceList = document.getElementById('eff-options').value
      break
    case 'alternate':
      sourceList = document.getElementById('alt-options').value
      break
    case 'bitcoin':
      sourceList = document.getElementById('bitcoin-options').value
      break
  }

  return sourceList
}

function generatePassphrase (source) {
  const sourceList = getSourceList(source)

  switch (source) {
    case 'diceware':
      generateDiceware(sourceList)
      break
    case 'eff':
      generateEff(sourceList)
      break
    case 'alternate':
      generateAlternate(sourceList)
      break
    case 'bitcoin':
      generateBitcoin(sourceList)
      break
  }
}

function toggleEntropyVisibility () {
  const classes = document.getElementsByClassName('use-entropy')

  if (localStorage.hasOwnProperty('entropy')) {
    if (JSON.parse(localStorage.entropy).length > 0) {
      for (let i = 0; i < classes.length; i++) {
        classes[i].style.visibility = 'visible'
        classes[i].children[2].innerText = JSON.parse(localStorage.entropy).length
      }
    } else {
      for (let i = 0; i < classes.length; i++) classes[i].style.visibility = 'hidden'
    }
  }

}

function secRand (count, useEntropy) {
  let num = 0
  const min = 2**16 % count
  const rand = new Uint16Array(1)

  if (useEntropy) {
    const entropy = JSON.parse(localStorage.entropy)

    if (entropy.length > 0) {
      num = entropy[0]
      entropy.shift()
      localStorage.entropy = JSON.stringify(entropy)
    }
  }

  do num ^= crypto.getRandomValues(rand)[0]
  while (num < min)

  toggleEntropyVisibility()

  return num % count
}

function uniquesOnly (list) {
  return [...new Set(list)] // enforce unique elements in array
}

function generatePass (len, set, spaces, useEntropy) {
  let pass = ''
  let passArr = ''

  if (typeof set === 'string') passArr = set.split('')
  else passArr = set

  for (let i = len; i > 0; i--) {
    if (useEntropy) {
      if (spaces) {
        pass += passArr[secRand(set.length, true)]
        pass += ' '
      } else pass += passArr[secRand(set.length, true)]
    } else {
      if (spaces) {
        pass += passArr[secRand(set.length, false)]
        pass += ' '
      } else pass += passArr[secRand(set.length, false)]
    }
  }

  return pass.trim()
}

function generateDiceware (selection) {
  let pass = ''
  let wordList = ''

  switch (selection) {
    case 'Basque':
      wordList = dicewareEU
      break
    case 'Bulgarian':
      wordList = dicewareBG
      break
    case 'Catalan':
      wordList = dicewareCA
      break
    case 'Chinese':
      wordList = dicewareCN
      break
    case 'Czech':
      wordList = dicewareCZ
      break
    case 'Danish':
      wordList = dicewareDA
      break
    case 'Dutch':
      wordList = dicewareNL
      break
    case 'English':
      wordList = dicewareEN
      break
    case 'English (Beale)':
      wordList = dicewareBeale
      break
    case 'English (NLP)':
      wordList = dicewareNLP
      break
    case 'Esperanto':
      wordList = dicewareEO
      break
    case 'Estonian':
      wordList = dicewareET
      break
    case 'Finnish':
      wordList = dicewareFI
      break
    case 'French':
      wordList = dicewareFR
      break
    case 'German':
      wordList = dicewareDE
      break
    case 'Greek':
      wordList = dicewareEL
      break
    case 'Hebrew':
      wordList = dicewareIW
      break
    case 'Hungarian':
      wordList = dicewareHU
      break
    case 'Italian':
      wordList = dicewareIT
      break
    case 'Japanese':
      wordList = dicewareJP
      break
    case 'Latin':
      wordList = dicewareLA
      break
    case 'Maori':
      wordList = dicewareMI
      break
    case 'Norwegian':
      wordList = dicewareNO
      break
    case 'Polish':
      wordList = dicewarePL
      break
    case 'Portuguese':
      wordList = dicewarePT
      break
    case 'Romanian':
      wordList = dicewareRO
      break
    case 'Russian':
      wordList = dicewareRU
      break
    case 'Slovak':
      wordList = dicewareSK
      break
    case 'Slovenian':
      wordList = dicewareSL
      break
    case 'Spanish':
      wordList = dicewareES
      break
    case 'Swedish':
      wordList = dicewareSV
      break
    case 'Turkish':
      wordList = dicewareTR
      break
  }

  wordList = uniquesOnly(wordList)

  const entropy = getEntropy()
  const passId = document.getElementById('diceware-pass')
  const passLength = document.getElementById('diceware-length')
  const passEntropy = document.getElementById('diceware-entropy')
  const entropyCheck = document.getElementById('diceware-entropy-check')

  entropyCheck.checked ? useEntropy = true : useEntropy = false

  if ( wordList.filter(Array.isArray).length === 2) {
    // We're working on the "Natrual Language Passwords" list
    const len1 = Math.ceil(entropy / Math.log2(wordList[0].length)) // adjectives
    const len2 = Math.ceil(entropy / Math.log2(wordList[1].length)) // nouns
    const adjs = generatePass(len1, wordList[0], true, useEntropy).split(" ")
    const nouns = generatePass(len2, wordList[1], true, useEntropy).split(" ")

    let bits = 0
    let counter = 0

    // building up the password alteraning: adj-noun-adj-noun-...
    while (bits <= entropy) {
      if (counter % 2 === 0) {
        pass += adjs[counter]
        bits += Math.log2(wordList[0].length)
      }
      else {
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
  }
  else {
    // Every other Diceware word list.
    const len = Math.ceil(entropy / Math.log2(wordList.length))

    pass = generatePass(len, wordList, true, useEntropy)
    pass = pass.replace(/ /g, '-')

    passEntropy.innerText = Math.floor(len * Math.log2(wordList.length)) + ' bits,'
  }

  passId.innerText = pass
  passLength.innerText = pass.length + ' characters.'
}

function generateEff (selection) {
  let pass = ''
  let wordList = ''

  switch (selection) {
    case 'Distant Words':
      wordList = effDistant
      break
    case 'Short Words':
      wordList = effShort
      break
    case 'Long Words':
      wordList = effLong
      break
    case 'Game of Thrones':
      wordList = effGameOfThrones
      break
    case 'Harry Potter':
      wordList = effHarryPotter
      break
    case 'Star Trek':
      wordList = effStarTrek
      break
    case 'Star Wars':
      wordList = effStarWars
      break
  }

  wordList = uniquesOnly(wordList)

  const entropy = getEntropy()
  const len = Math.ceil(entropy / Math.log2(wordList.length))
  const passId = document.getElementById('eff-pass')
  const passLength = document.getElementById('eff-length')
  const passEntropy = document.getElementById('eff-entropy')
  const entropyCheck = document.getElementById('eff-entropy-check')

  entropyCheck.checked ? useEntropy = true : useEntropy = false

  pass = generatePass(len, wordList, true, useEntropy)
  pass = pass.replace(/ /g, '-')
  passId.innerText = pass
  passLength.innerText = pass.length + ' characters.'
  passEntropy.innerText = Math.floor(len * Math.log2(wordList.length)) + ' bits,'
}

function generateAlternate (selection) {
  let pass = ''
  let wordList = ''

  switch (selection) {
    case 'Colors':
      return generateColors()
    case 'Elvish':
      wordList = alternateElvish
      break
    case 'English (All)':
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
      break
    case 'English (Deseret)':
      wordList = alternateDeseret
      break
    case 'English (Shavian)':
      wordList = alternateShavian
      break
    case 'Klingon':
      wordList = alternateKlingon
      break
    case 'PGP':
      wordList = alternatePgp
      break
    case 'Pokerware':
      wordList = alternatePokerware
      break
    case 'RockYou':
      wordList = alternateRockyou
      break
    case 'Simpsons':
      wordList = alternateSimpsons
      break
    case 'S/KEY':
      wordList = alternateSkey
      break
    case 'Trump':
      wordList = alternateTrump
      break
  }

  wordList = uniquesOnly(wordList)

  const entropy = getEntropy()
  const len = Math.ceil(entropy / Math.log2(wordList.length))
  const passId = document.getElementById('alt-pass')
  const passLength = document.getElementById('alt-length')
  const passEntropy = document.getElementById('alt-entropy')
  const entropyCheck = document.getElementById('alt-entropy-check')

  entropyCheck.checked ? useEntropy = true : useEntropy = false

  pass = generatePass(len, wordList, true, useEntropy)
  pass = pass.replace(/ /g, '-')
  passId.innerText = pass
  passLength.innerText = [...pass].length + ' characters.'
  passEntropy.innerText = Math.floor(len * Math.log2(wordList.length)) + ' bits,'
}

function isTooDark (hex) {
  const rgb = parseInt(hex, 16)
  const r = (rgb >> 16) & 0xff
  const g = (rgb >> 8) & 0xff
  const b = (rgb >> 0) & 0xff
  const l = (0.299 * r) + (0.587 * g) + (0.114 * b)

  if (l > 79) return false

  return true
}

function isTooLight (hex) {
  const rgb = parseInt(hex, 16)
  const r = (rgb >> 16) & 0xff
  const g = (rgb >> 8) & 0xff
  const b = (rgb >> 0) & 0xff
  const l = (0.299 * r) + (0.587 * g) + (0.114 * b)

  if (l < 176) return false

  return true
}

function generateColors () {
  let tmp = ''
  const colorKeys = Object.keys(alternateColors)
  const entropy = getEntropy()
  const len = Math.ceil(entropy / Math.log2(colorKeys.length))
  const passId = document.getElementById('alt-pass')
  const passLength = document.getElementById('alt-length')
  const passEntropy = document.getElementById('alt-entropy')
  const entropyCheck = document.getElementById('alt-entropy-check')

  entropyCheck.checked ? useEntropy = true : useEntropy = false

  let pass = generatePass(len, colorKeys, true, useEntropy).split(' ')
  const chosenTheme = localStorage.theme

  for (let i = 0; i < len; i++) {
    const hex = alternateColors[pass[i]]

    if (chosenTheme === undefined || chosenTheme === 'light') {
      if (isTooLight(hex)) tmp += "<span class='bold light_contrast' style='color:#" + hex + ";'>" + pass[i] + '</span> '
      else tmp += "<span class='bold' style='color:#" + hex + ";'>" + pass[i] + '</span> '
    } else if (chosenTheme === 'dark') {
      if (isTooDark(hex)) tmp += "<span class='bold dark_contrast' style='color:#" + hex + ";'>" + pass[i] + '</span> '
      else tmp += "<span class='bold' style='color:#" + hex + ";'>" + pass[i] + '</span> '
    }
  }

  passId.innerHTML = tmp.replace(/> </g, '>-<').trim()
  tmp = ''

  for (let i = 0; i < len; i++) tmp += pass[i]

  pass = tmp
  const totalLen = pass.length + (len - 1)
  passLength.innerText = totalLen + ' characters.'
  passEntropy.innerText = Math.floor(len * Math.log2(colorKeys.length)) + ' bits,'
}

function generateBitcoin (selection) {
  let pass = ''
  let wordList = ''

  switch (selection) {
    case 'Chinese (Simp)':
      wordList = bitcoinCNSimp
      break
    case 'Chinese (Trad)':
      wordList = bitcoinCNTrad
      break
    case 'Czech':
      wordList = bitcoinCZ
      break
    case 'English':
      wordList = bitcoinEN
      break
    case 'French':
      wordList = bitcoinFR
      break
    case 'Italian':
      wordList = bitcoinIT
      break
    case 'Japanese':
      wordList = bitcoinJP
      break
    case 'Korean':
      wordList = bitcoinKR
      break
    case 'Portuguese':
      wordList = bitcoinPT
      break
    case 'Spanish':
      wordList = bitcoinES
      break
  }

  wordList = uniquesOnly(wordList)

  function _bytesToBinary (bytes) {
    let total = 0n
    for (let i = 0; i < bytes.length; i++) total |= BigInt(bytes[i] * 256**(bytes.length - i - 1))
    return total.toString(2)
  }

  function _sha256 (bytes) {
    const crypto = window.crypto || window.msCrypto

    return crypto.subtle.digest('SHA-256', bytes)
    .then(function (hash) {
      return hash
    })
  }

  const entropy = getEntropy()
  const requiredEntropy = Math.ceil(entropy / 32) * 32 // Multiple of 32 bits, per the bip39 spec
  const entropyCheck = document.getElementById('btc-entropy-check')

  entropyCheck.checked ? useEntropy = true : useEntropy = false

  const entropyBuffer = new Uint8Array(Math.ceil(requiredEntropy / 8))
  for (let i = 0; i < entropyBuffer.length; i++) entropyBuffer[i] = secRand(256, useEntropy)

  _sha256(entropyBuffer)
  .then(function (digest) {
    sha256Digest = new Uint8Array(digest)

    const entropyBits = _bytesToBinary(entropyBuffer).padStart(requiredEntropy, '0')
    const checkBits = _bytesToBinary(sha256Digest).padStart(256, '0').substr(0, 11 - (requiredEntropy % 11))
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

function generateApple () {
  function _apple (n) {
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

  entropyCheck.checked ? useEntropy = true : useEntropy = false

  let n = 1 // number of blocks

  while (_apple(n) <= entropy) n++

  for (let i = 0; i < n; i++) {
    pass[6 * i]     = generatePass(1, consonants, false, useEntropy)
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

  if (edge % 2 === 0) digitLoc = 3 * edge
  else digitLoc = 3 * edge + 2

  pass[digitLoc] = digit

  do charLoc = secRand(pass.length, useEntropy)
  while (charLoc === digitLoc)

  pass[charLoc] = pass[charLoc].toUpperCase()

  for (let i = n - 1; i > 0; i--) pass.splice(6 * i, 0, '-')

  return [pass.join(''), pass.length, _apple(n)]
}

function generateBabble () {
  // Spec: https://web.mit.edu/kenta/www/one/bubblebabble/spec/jrtrjwzi/draft-huima-01.txt
  // Code based on https://github.com/kpalin/bubblepy
  const vowels = 'aeiouy'
  const consonants = 'bcdfghklmnprstvzx'
  const bytes = Math.ceil(getEntropy() / 8)
  const entropy = new Uint8Array(bytes)
  const entropyCheck = document.getElementById('pseudo-entropy-check')
  let pass = 'x'
  let checksum = 1

  entropyCheck.checked ? useEntropy = true : useEntropy = false

  for (let i = 0; i < entropy.length; i++) entropy[i] = secRand(256, useEntropy)

  for (let i = 0; i <= entropy.length; i += 2) {
    if (i >= entropy.length) {
      pass += vowels[checksum % 6] + consonants[16] + vowels[Math.floor(checksum / 6)]
      break
    }

    byte1 = entropy[i]
    pass += vowels[(((byte1 >> 6) & 3) + checksum) % 6]
    pass += consonants[(byte1 >> 2) & 15]
    pass += vowels[((byte1 & 3) + Math.floor(checksum / 6)) % 6]

    if ((i + 1) >= entropy.length) break

    byte2 = entropy[i+1]
    pass += consonants[(byte2 >> 4) & 15]
    pass += '-'
    pass += consonants[byte2 & 15]

    checksum = ((checksum * 5) + (byte1 * 7) + byte2) % 36
  }

  pass += 'x'

  return [pass, pass.length, entropy.length * 8]
}

function generateMunemo () {
  // https://github.com/jmettraux/munemo
  function _tos(num, str) {
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

    if (rem > 0) return _tos(rem, str)
    else return str
  }

  const entropyCheck = document.getElementById('pseudo-entropy-check')

  entropyCheck.checked ? useEntropy = true : useEntropy = false

  const minEntropy = getEntropy()
  const isNegative = secRand(2, useEntropy)
  let num = 0n

  // Half the key space is negative, half is non-negative
  for (let i = 0; i < minEntropy - 1; i++) num += BigInt(secRand(2, useEntropy) * (2 ** i))

  let pass = _tos(num, '')

  // 'xa' = -1 * num:
  //    fowohazehikorawihomeho =  1989259826396086294829
  //  xafowohazehikorawihomeho = -1989259826396086294829
  if (isNegative) pass = 'xa' + pass

  return [pass, pass.length, minEntropy]
}

function generateProquints () {
  // https://arxiv.org/html/0901.4016
  const vowels = 'aiou'
  const consonants = 'bdfghjklmnprstvz'
  const entropy = getEntropy()
  const len = Math.ceil(entropy / 16)
  const entropyCheck = document.getElementById('pseudo-entropy-check')

  entropyCheck.checked ? useEntropy = true : useEntropy = false

  let pass = consonants[secRand(16, useEntropy)]

  for (let i = len; i > 0; i--) {
    pass += vowels[secRand(4, useEntropy)]
    pass += consonants[secRand(16, useEntropy)]
    pass += vowels[secRand(4, useEntropy)]

    if (i === 1) break

    pass += consonants[secRand(16, useEntropy)]
    pass += '-'
    pass += consonants[secRand(16, useEntropy)]
  }

  pass += consonants[secRand(16, useEntropy)]

  return [pass, pass.length, len * 16]
}

function generateLetterblock () {
  // https://www.draketo.de/software/letterblock-diceware
  // Diverged from above with:
  //  - '$' and '%' appended to make the checksum delimeters 6 characters
  //  - Treating digits as leet-speak
  function _isDigit (str) {
    return str.length === 1 && str.match(/[0-9]/)
  }

  function _replaceDigit (str) {
    if (str === '0') return 'o'
    else if (str === '1') return 'l'
    else if (str === '2') return 'z'
    else if (str === '3') return 'e'
    else if (str === '4') return 'a'
    else if (str === '5') return 's'
    else if (str === '6') return 'b'
    else if (str === '7') return 't'
    else if (str === '8') return 'b'
    else if (str === '9') return 'g'
  }

  function _getCombos (arr, res, ctr) {
    const ptr0 = ctr.toString(2).padStart(4, '0')[0]
    const ptr1 = ctr.toString(2).padStart(4, '0')[1]
    const ptr2 = ctr.toString(2).padStart(4, '0')[2]
    const ptr3 = ctr.toString(2).padStart(4, '0')[3]

    if (arr[0][ptr0] !== undefined && arr[1][ptr1] !== undefined && arr[2][ptr2] !== undefined && arr[3][ptr3] !== undefined) {
      res.push(arr[0][ptr0] + arr[1][ptr1] + arr[2][ptr2] + arr[3][ptr3])
    }

    ctr++

    if (ctr < 16) _getCombos(arr, res, ctr)
  }

  function _calculateScores (arr) {
    let results = {}

    for (let i = 0; i < arr.length; i++) {
      let str = arr[i]
      let score = 0

      for (let j = 0; j < str.length - 1; j++) {
        if (_isDigit(str[j])) score += bigrams[_replaceDigit(str[j]) + str[j + 1].toLowerCase()]
        else if (_isDigit(str[j + 1])) score += bigrams[str[j].toLowerCase() + _replaceDigit(str[j + 1])]
        else score += bigrams[str[j].toLowerCase() + str[j + 1].toLowerCase()]
      }

      results[str] = score
    }

    return Object.keys(results).reduce(function(a, b){ return results[a] > results[b] ? a : b })
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
  const numBlocks = (totalEntropy / blockEntropy)
  const blocks = []
  const checks = []
  const entropyCheck = document.getElementById('pseudo-entropy-check')

  entropyCheck.checked ? useEntropy = true : useEntropy = false

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

      check += (row + 1) // Indexed at 1 per the original proposal
    }

    _getCombos(jail, combos, 0)

    let winner = _calculateScores(combos)

    blocks.push(winner)
    checks.push(check)
  }

  for (let i = 0; i < blocks.length; i++) {
    pw += blocks[i]

    if (checks[i + 1] !== undefined) pw += delimiters[(checks[i] + checks[i + 1]) % 6]
  }

  return [pw, pw.length, totalEntropy]
}

function generateSKey () {
  const wordList = uniquesOnly(pseudoSKey)
  const entropy = getEntropy()
  const len = Math.ceil(entropy / Math.log2(wordList.length))
  const entropyCheck = document.getElementById('alt-entropy-check')

  entropyCheck.checked ? useEntropy = true : useEntropy = false

  let pass = ''

  for (let i = 0; i < len; i++) {
    pass += wordList[secRand(wordList.length, useEntropy)]
    if (i !== len - 1) pass += '-'
  }

  return [pass, wordList.length, Math.floor(len * Math.log2(wordList.length))]
}

function generatePseudowords () {
  let ret = []
  let displayCheck = false
  const pseudo = document.getElementById('pseudo-options').value

  if (pseudo === 'Apple, Inc.') ret = generateApple()
  else if (pseudo === 'Bubble Babble') {
    ret = generateBabble()
    displayCheck = true
  }
  else if (pseudo === 'Letterblock Diceware') {
    ret = generateLetterblock()
    displayCheck = true
  }
  else if (pseudo === 'Munemo') ret = generateMunemo()
  else if (pseudo === 'Proquints') ret = generateProquints()

  const pass = ret[0]
  const ent = ret[2]
  const passId = document.getElementById('pseudo-pass')
  const passLength = document.getElementById('pseudo-length')
  const passEntropy = document.getElementById('pseudo-entropy')
  const passCheck = document.getElementById('pseudo-check')

  passId.innerText = pass
  passLength.innerText = pass.length + ' characters.'
  passEntropy.innerText = ent + ' bits,'

  if (displayCheck) passCheck.innerText = 'Integrated checksum.'
  else passCheck.innerText = ''
}

function generateRandom () {
  let s = ''
  let check = ''
  let displayCheck = false
  const entropy = getEntropy()
  const passId = document.getElementById('random-pass')
  const passLength = document.getElementById('random-length')
  const passEntropy = document.getElementById('random-entropy')
  const passCheck = document.getElementById('random-check')
  const option = document.getElementById('random-options').value

  switch (option) {
    // ASCII optgroup
    case 'Base94':
      for (let i = 0; i < 94; i++) {
        s += String.fromCharCode(33 + i)
      }
      break
    case 'Base85':
      s = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!#$%&()*+-;<=>?@^_`{|}~'
      break
    case 'Base64':
      s = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_'
      break
    case 'Base62':
      s = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
      break
    case 'Base58':
      s = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
      break
    case 'Base52':
      s = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
      break
    case 'Base45':
      s = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_$%*+-./:'
      break
    case 'Base36':
      s = '0123456789abcdefghijklmnopqrstuvwxyz'
      break
    case 'Base32': // Crockford's base32
      s = '0123456789abcdefghjkmnpqrstvwxyz'
      break
    case 'Base26':
      s = 'abcdefghijklmnopqrstuvwxyz'
      break
    case 'Base16':
      s = '0123456789abcdef'
      break
    case 'Base10':
      s = '0123456789'
      break
    case 'Base8':
      s = '01234567'
      break
    case 'Base4':
      s = 'ACGT'
      break
    case 'Base2':
      s = '01'
      break
    // Unicode optgroup
    case 'Emoji':
      return generateEmoji()
    case 'ISO 8859-1': // Base188
      unicodeWarn()
      for (let i = 0; i < 94; i++) s += String.fromCharCode(33 + i)
      for (let i = 0; i < 95; i++) s += String.fromCharCode(161 + i)
      s = s.replace(String.fromCharCode(173), '') // soft-hyphen isn't graphical
      break
    case 'Latin Extended': // Base256
      unicodeWarn()
      s = 'ḀḁḂḃḄḅḆḇḈḉḊḋḌḍḎḏḐḑḒḓḔḕḖḗḘḙḚḛḜḝḞḟḠḡḢḣḤḥḦḧḨḩḪḫḬḭḮḯḰḱḲḳḴḵḶḷḸḹḺḻḼḽḾḿ'
      s += 'ṀṁṂṃṄṅṆṇṈṉṊṋṌṍṎṏṐṑṒṓṔṕṖṗṘṙṚṛṜṝṞṟṠṡṢṣṤṥṦṧṨṩṪṫṬṭṮṯṰṱṲṳṴṵṶṷṸṹṺṻṼṽṾṿ'
      s += 'ẀẁẂẃẄẅẆẇẈẉẊẋẌẍẎẏẐẑẒẓẔẕẖẗẘẙẚẛẜẝẞẟẠạẢảẤấẦầẨẩẪẫẬậẮắẰằẲẳẴẵẶặẸẹẺẻẼẽẾế'
      s += 'ỀềỂểỄễỆệỈỉỊịỌọỎỏỐốỒồỔổỖỗỘộỚớỜờỞởỠỡỢợỤụỦủỨứỪừỬửỮữỰựỲỳỴỵỶỷỸỹỺỻỼỽỾỿ'
      break
    case 'Mac OS Roman': // Base220
      unicodeWarn()
      // Standard ASCII
      for (let i = 0; i < 94; i++) {
        s += String.fromCharCode(33 + i)
      }
      // Excludes Unicod U+F8FF in the Corporate Private Use Area for the Apple logo
      s += 'ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®©™´¨≠ÆØ∞±≤≥¥µ∂∑∏π∫ªºΩæ'
      s += 'ø¿¡¬√ƒ≈∆«»…ÀÃÕŒœ–—“”‘’÷◊ÿŸ⁄€‹›ﬁﬂ‡·‚„‰ÂÊÁËÈÍÎÏÌÓÔÒÚÛÙıˆ˜¯˘˙˚¸˝˛ˇ'
      console.log(s, s.length)
      break
  }

  const len = Math.ceil(entropy / Math.log2(s.length))
  const entropyCheck = document.getElementById('random-entropy-check')

  entropyCheck.checked ? useEntropy = true : useEntropy = false
  pass = generatePass(len, s, false, useEntropy)

  if (option === 'Base32') {
    // Add Crockford's modulo 37 checksum
    let check = 0n
    s += '*~$=u'
    displayCheck = true

    for (let i = 0; i < pass.length; i++) check += BigInt(s.indexOf(pass[i]) * 32**(pass.length - i - 1))

    pass += s[check % 37n]
  }

  passLength.innerText = pass.length + ' characters.'
  passId.removeAttribute('style') // from emoji
  passId.innerText = pass
  passEntropy.innerText = Math.floor(len * Math.log2(s.length)) + ' bits,'

  if (displayCheck) passCheck.innerText = 'Integrated checksum.'
  else passCheck.innerText = ''
}

function generateEmoji () {
  unicodeWarn()

  const entropy = getEntropy()
  const passId = document.getElementById('random-pass')
  const passLength = document.getElementById('random-length')
  const passEntropy = document.getElementById('random-entropy')
  const len = Math.ceil(entropy / Math.log2(randomEmoji.length))
  const entropyCheck = document.getElementById('random-entropy-check')

  entropyCheck.checked ? useEntropy = true : useEntropy = false

  const pass = generatePass(len, randomEmoji, false, useEntropy)

  passLength.innerText = pass.length + ' characters.'
  passId.style.fontFamily = 'Emoji'
  passId.innerText = pass
  passEntropy.innerText = Math.floor(len * Math.log2(randomEmoji.length)) + ' bits,'
}
