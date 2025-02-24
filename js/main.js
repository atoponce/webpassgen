//"use strict"

// globals
const PAGECONTAINER = document.getElementsByTagName('body')[0]
const PREFERSDARKTHEME = window.matchMedia('(prefers-color-scheme: dark)')
const THEMESWITCHER = document.getElementById('theme_switcher')
const SITECOLORS = {
  // added bold variants, just in case I want them later.
  red:    '#ff6464', redBold:    '#ff3939',
  orange: '#ffcb64', orangeBold: '#ffbd39',
  yellow: '#ffff64', yellowBold: '#ffff39',
  green:  '#55d955', greenBold:  '#2fcf2f',
  // new blue and purple, again just in case.
  blue:   '#5777c0', blueBold:   '#365bb0',
  purple: '#9951c0', purpleBold: '#822fb0'
}

/** Provide a warning when any of the Unicode generators are chosen. */
function unicodeWarn() {
  if (localStorage.getItem('unicode_warned') === null) {
    document.getElementById('overlay').style.display = 'block'
    localStorage.setItem('unicode_warned', true)
  }
}

/** Toggle the theme to dark. Uses #000000 for OLED efficiency. */
function setDarkTheme() {
  PAGECONTAINER.classList.add('dark-theme')
  localStorage.setItem('theme', 'dark')
  // SVG sun
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

/** Toggle the theme to light. */
function setLightTheme() {
  PAGECONTAINER.classList.remove('dark-theme')
  localStorage.setItem('theme', 'light')
  // SVG moon
  THEMESWITCHER.innerHTML = `
    <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='currentColor' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='feather feather-moon'>
      <path d='M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z'></path>
    </svg>
  `
}

/** Initialize the theme from previous setting, or default to light. */
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

/** Toggle theme between light and dark. */
function toggleTheme() {
  if (PAGECONTAINER.classList.contains('dark-theme')) {
    setLightTheme()
  } else {
    setDarkTheme()
  }
}

/** Return selected entropy (56, 64, 72, 80, 88, 96, 104, 112, 120, or 128). */
function getEntropy() {
  return parseInt(document.querySelector('#output').value)
}

/**
 * Return a word list from the Alternate, Bitcoin, Diceware, or EFF generator.
 * @param {string} source - The selected passphrase wordlist.
 * @return {string} - The HTML selected option.
 */
function getSourceList(source) {
  let sourceList

  if (source === 'alternate') {
    sourceList = document.getElementById('alt-options').value
  } else if (source === 'cryptocurrency') {
    sourceList = document.getElementById('cryptocurrency-options').value
  } else if (source === 'diceware') {
    sourceList = document.getElementById('diceware-options').value
  } else if (source === 'eff') {
    sourceList = document.getElementById('eff-options').value
  }

  return sourceList
}

/**
 * Generate a passphrase based on the button the user presses.
 * @param {string} source - The selected passphrase generator.
 */
function generatePassphrase(source) {
  const sourceList = getSourceList(source)

  if (source === 'alternate') {
    generateAlternate(sourceList)
  } else if (source === 'cryptocurrency') {
    const optGroup = document.querySelector('#cryptocurrency-options option:checked').parentElement.label

    if (optGroup === 'Bitcoin') {
      generateBitcoin(sourceList)
    } else if (optGroup === 'Monero') {
      generateMonero(sourceList)
    }
  } else if (source === 'diceware') {
    generateDiceware(sourceList)
  } else if (source === 'eff') {
    generateEff(sourceList)
  } 
}

/**
 * Toggle the visibility of the cell overflow div for password stats.
 * @param {String} source - One of the six generator cells.
 */
function toggleStats(source) {
  let elem
  const coords = {left: scrollX, top: scrollY, behavior: 'instant'}

  if (source === 'alternate') {
    elem = document.getElementById('alt-overlay')
  } else if (source == 'cryptocurrency') {
    elem = document.getElementById('crypto-overlay')
  } else if (source == 'diceware') {
    elem = document.getElementById('diceware-overlay')
  } else if (source == 'eff') {
    elem = document.getElementById('eff-overlay')
  } else if (source == 'pseudo') {
    elem = document.getElementById('pseudo-overlay')
  } else if (source == 'random') {
    elem = document.getElementById('random-overlay')
  }

  // Toggling the div display in CSS scrolls to the top of the page. I don't
  // want to lock scrolling, as the user may want to still scroll after looking
  // at the stats. So CSS "overflow: hidden;" isn't going to work. Neither will
  // some disableScroll() and enableScroll() functions.
  if (elem.style.display === '') {
    elem.style.display = 'block'
  } else {
    elem.style.display = ''
  }

  // So this hack scrolls back to our previous position, but won't without a
  // timeout. Requires ~10 ms to work in Firefox consistently. Unfortunately,
  // this can create a quick page blink in the UI, which isn't great.
  // I really hate this, but it works.
  setTimeout(function() {scrollTo(coords)}, 10)
}

/** 
 * Add a checkbox to use entropy if its present in localStorage.entropy.
 * Mozilla will not store localStorage key values to disk under the file:// protocol.
 * See https://bugzilla.mozilla.org/show_bug.cgi?id=507361 for more information.
 */
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

/**
 * A cryptographically secure uniform random number generator.
 * @param {number} count - The max number a random number can be.
 * @param {boolean} useEntropy - Whether or not to use the data in localStorage.entropy.
 * @return {number} - Uniform random number.
 */
function secRand(count, useEntropy) {
  let num = 0
  const min = 2 ** 32 % count
  const rand = new Uint32Array(1)

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

/**
 * Remove any and all duplicates from an array. Case sensitive.
 * @param {Array} list - An array of strings or numbers which might contain duplicates.
 * @return {Array} - The array with duplicates removed.
 */
function uniquesOnly(list) {
  return [...new Set(list)] // enforce unique elements in array
}

/**
 * The critical password generation function. Generates a password from a given set of data.
 * @param {number} len - How many characters/words to pick.
 * @param {string|Array} set - The data set to pick from.
 * @param {boolean} spaces - Whether or not to space-separate the password.
 * @param {boolean} useEntropy - Whether or not to use save entropy in localStorage.entropy.
 * @return {string} - The generated password.
 */
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

  return pass
}

/**
 * Determine if the color name needs to be outlined with CSS.
 * @param {number} hex - The hex value of the color.
 * @return {boolean} - true if color is too dark, false if light enough.
 */
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

/**
 * Determine if the color name needs to be outlined with CSS.
 * @param {number} hex - The hex value of the color.
 * @return {boolean} -true if the color is too light, false if dark enough
 */
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

/**
 * Add entropy from an external source, such as an HWRNG.
 * @param {string} hex - Hexadecimal input
 */
function addEntropy(hex) {
  var isHex = function(hex) {
    return typeof hex === 'string' && hex.length % 4 === 0 && !isNaN(Number('0x' + hex))
  }

  if (isHex(hex)) {
    let entropy = JSON.parse(localStorage.entropy)
    let lifetimeBits = JSON.parse(localStorage.lifetimeBits)

    for (let i = 0; i < hex.length; i+=4) {
      let num = hex.substring(i, i+4)
      entropy.push(parseInt(num, 16))
    }

    localStorage.lifetimeBits = JSON.stringify(lifetimeBits + hex.length * 4)
    localStorage.entropy = JSON.stringify(entropy)
  } else {
    console.error('Argument must be a hex string with a length that is a multple of 4 characters.')
  }
}

/**
 * An input slider ranging from values 48 to 128 stepping every 8.
 * @param {number} integer - An 8-bit value
 */
function updateSlider(n) {
  const slider = document.getElementById('input')
  const passClass = document.getElementsByClassName('password')

  for (let i = 0; i < 6; i++) {
    passClass[i].classList.remove('p48')
    passClass[i].classList.remove('p56')
    passClass[i].classList.remove('p64')
    passClass[i].classList.remove('p72')
  }

  if (n === 48) {
    slider.style.setProperty('--track-background', SITECOLORS.red)

    for (let i = 0; i < 6; i++) {
      passClass[i].classList.add('p48')
    }
  } else if (n === 56) {
    slider.style.setProperty('--track-background', SITECOLORS.orange)

    for (let i = 0; i < 6; i++) {
      passClass[i].classList.add('p56')
    }
  } else if (n === 64) {
    slider.style.setProperty('--track-background', SITECOLORS.yellow)

    for (let i = 0; i < 6; i++) {
      passClass[i].classList.add('p64')
    }
  } else if (n >= 72) {
    slider.style.setProperty('--track-background', SITECOLORS.green)

    for (let i = 0; i < 6; i++) {
      passClass[i].classList.add('p72')
    }
  }

  document.querySelector('#output').value = n
  localStorage.setItem('security', n)
}

/** Update localStorage with a key-value of the selected security margin when using the slider. */
function setSecurity() {
  if (localStorage.getItem('security') === null) {
    localStorage.setItem('security', 72)
  }

  const security = parseInt(localStorage.getItem('security'))

  document.querySelector('#output').value = security
  document.querySelector('input[type=range]').value = security

  updateSlider(security)
}

/** Generate all passwords (called from index.html only on page load/refresh). */
function loadPasses() {
  generatePassphrase('alternate')
  generatePassphrase('cryptocurrency')
  generatePassphrase('diceware')
  generatePassphrase('eff')
  generatePseudowords()
  generateRandom()
}

/** Sets a session storage variable */
function mork() {
  let str = ''
  window.addEventListener('keydown', function(e) {
      str = (str + e.key).substr(-4)
      if (str === 'mork') {
        sessionStorage.setItem('mork', true)
      }
    }, false
  )
}
