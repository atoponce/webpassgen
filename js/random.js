"use strict"

const randomProps = {
  "passId": document.getElementById('random-pass'),
  "passLength": document.getElementById('random-length'),
  "passEntropy": document.getElementById('random-entropy'),
  "setSize": document.getElementById('random-set-size'),
  "passCheck": document.getElementById('random-check'),
  "entropyCheck": document.getElementById('random-entropy-check'),
}

/** Generate a random meaningless password string. */
function generateRandom() {
  let check = ''
  let displayCheck = false
  const entropy = getEntropy()
  const option = document.getElementById('random-options').value

  randomProps.passCheck.innerText = ''
  randomProps.passId.classList.remove('whitespace')
  randomProps.passId.removeAttribute('style') // from emoji

  const randomCharsets = {
    'Base94': () => Array.from({ length: 94 }, (_, i) => String.fromCharCode(33 + i)).join(''),
    'Base85': () => 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!#$%&()*+-;<=>?@^_`{|}~',
    'Base64': () => '`!"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_',
    'Base62': () => 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
    'Base58': () => '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz',
    'Base52': () => 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
    'Base45': () => '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_$%*+-./:',
    'Base36': () => '0123456789abcdefghijklmnopqrstuvwxyz',
    'Base32': () => '0123456789abcdefghjkmnpqrstvwxyz', // Crockford's base32
    'Base26': () => 'abcdefghijklmnopqrstuvwxyz',
    'Base16': () => '0123456789abcdef',
    'Base10': () => '0123456789',
    'Base8': () => '01234567',
    'Base4': () => '0123',
    'Base2': () => '01',
    'ISO 8859-1': () => {
      unicodeWarn()
      let chars = ''
      for (let i = 0; i < 94; i++) chars += String.fromCharCode(33 + i)
      for (let i = 0; i < 95; i++) chars += String.fromCharCode(161 + i)
      return chars.replace(String.fromCharCode(173), '')
    },
    'Latin Extended': () => {
      unicodeWarn()
      let chars = ''
      chars = 'ḀḁḂḃḄḅḆḇḈḉḊḋḌḍḎḏḐḑḒḓḔḕḖḗḘḙḚḛḜḝḞḟḠḡḢḣḤḥḦḧḨḩḪḫḬḭḮḯḰḱḲḳḴḵḶḷḸḹḺḻḼḽḾḿ'
      chars += 'ṀṁṂṃṄṅṆṇṈṉṊṋṌṍṎṏṐṑṒṓṔṕṖṗṘṙṚṛṜṝṞṟṠṡṢṣṤṥṦṧṨṩṪṫṬṭṮṯṰṱṲṳṴṵṶṷṸṹṺṻṼṽṾṿ'
      chars += 'ẀẁẂẃẄẅẆẇẈẉẊẋẌẍẎẏẐẑẒẓẔẕẖẗẘẙẚẛẜẝẞẟẠạẢảẤấẦầẨẩẪẫẬậẮắẰằẲẳẴẵẶặẸẹẺẻẼẽẾế'
      chars += 'ỀềỂểỄễỆệỈỉỊịỌọỎỏỐốỒồỔổỖỗỘộỚớỜờỞởỠỡỢợỤụỦủỨứỪừỬửỮữỰựỲỳỴỵỶỷỸỹỺỻỼỽỾỿ'
      return chars
    },
    'Mac OS Roman': () => {
      unicodeWarn()
      let chars = ''
      for (let i = 0; i < 94; i++) chars += String.fromCharCode(33 + i)
      chars += 'ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®©™´¨≠ÆØ∞±≤≥¥µ∂∑∏π∫ªºΩæ'
      chars += 'ø¿¡¬√ƒ≈∆«»…ÀÃÕŒœ–—“”‘’÷◊ÿŸ⁄€‹›ﬁﬂ‡·‚„‰ÂÊÁËÈÍÎÏÌÓÔÒÚÛÙıˆ˜¯˘˙˚¸˝˛ˇ'
      return chars
    },
    'Whitespace': () => {
      // Must be inside CSS "break-spaces" to render tab and not collapse or trim spaces.
      unicodeWarn()
      return [
        /*
         * Non-zero width, horizontal, non-graphical spaces/blanks.
         *
         * \u{00A0} is converted to \u{0020} on copy. This is a long-standing bug:
         *   - https://bugs.chromium.org/p/chromium/issues/detail?id=346096
         *   - https://bugzilla.mozilla.org/show_bug.cgi?id=359303
         *   - https://bugzilla.mozilla.org/show_bug.cgi?id=1769534
         * \u{00AD} replaces \u{00A0} in the meantime to provide exactly 32 characetrs.
         *
         * "\u{115F}\u{1160}" produces tofu with the Noto Sans Mono font. Replaced with \u{2062}
         * and \u{2064} to accompany \u{2063}.
         */
        '\u{0009}', // Character tabulation
        '\u{0020}', // Space
        '\u{2000}', // En quad
        '\u{2001}', // Em quad
        '\u{2002}', // En space
        '\u{2003}', // Em space
        '\u{2004}', // Three-per-em space
        '\u{2005}', // Four-per-em space
        '\u{2006}', // Six-per-em space
        '\u{2007}', // Figure space
        '\u{2008}', // Punctuation space
        '\u{2009}', // Thin space
        '\u{200A}', // Hair space
        '\u{2028}', // Line separator
        '\u{2029}', // Paragraph separator
        '\u{202F}', // Narrow no-break space
        '\u{205F}', // Medium mathematical space
        '\u{2800}', // Braille pattern blank
        '\u{3000}', // Ideographic space
        '\u{3164}', // Hangul filler
        '\u{FFA0}', // Halfwidth hangul filler
        // Zero width, non-control spaces/blanks.
        '\u{00AD}', // Soft hyphen
        '\u{034F}', // Combining grapheme joiner
        '\u{180E}', // Mongolian vowel separator
        '\u{200B}', // Zero width space
        '\u{200C}', // Zero width non-joiner
        '\u{200D}', // Zero width joiner
        '\u{2060}', // Word joiner
        '\u{2062}', // Invisible times
        '\u{2063}', // Invisible separator
        '\u{2064}', // Invisible plus
        '\u{FEFF}', // Zero width non-breaking space
      ]
    },
  }

  const keyboardLayouts = {
    'Colemak': layouts.COLEMAK,
    'Dvorak': layouts.DVORAK,
    'Norman': layouts.NORMAN,
    'QWERTY': layouts.QWERTY,
    'Workman': layouts.WORKMAN,
  }

  if (option === 'Emoji') {
    return generateEmoji()
  }

  if (keyboardLayouts[option]) {
    let layout = keyboardLayouts[option]
    let rand = secRand(94, randomProps.entropyCheck.checked)
    let bits = Math.log2(94)
    let char = String.fromCharCode(rand + 33)
    let pass = char

    while (bits <= entropy) {
      const neighbors = layout[char]
      bits += Math.log2(neighbors.length)
      rand = secRand(neighbors.length, randomProps.entropyCheck.checked)
      char = neighbors[rand]
      pass += char
    }

    randomProps.passLength.innerText = pass.length + ' characters'
    randomProps.passId.innerText = pass
    randomProps.setSize.innerText = '94 characters'
    randomProps.passEntropy.innerText = Math.floor(bits) + ' bits'
    return
  }

  const getCharset = randomCharsets[option]
  const s = getCharset()
  let len = Math.ceil(entropy / Math.log2(s.length))
  let pass = generatePass(len, s, false, randomProps.entropyCheck.checked)

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

  if (option === 'Whitespace') {
    // Eeaster egg for typing "mork" on the keyboard
    if (sessionStorage.getItem('mork')) {
      len = 1
      pass = '\u{1F9D1}\u{1F3FB}\u{200D}\u{1F680}' // astronaut: light skin tone
      sessionStorage.removeItem('mork')
      randomProps.passCheck.innerText = 'Na-Nu Na-Nu'
    } else {
      pass = "\u{2800}" + pass + "\u{2800}"
      randomProps.passId.classList.add('whitespace')
    }
  }

  randomProps.passLength.innerText = len + ' characters'
  randomProps.passId.innerText = pass
  randomProps.setSize.innerText = s.length.toLocaleString() + ' characters'
  randomProps.passEntropy.innerText = Math.floor(len * Math.log2(s.length)) + ' bits'

  if (displayCheck) {
    randomProps.passCheck.innerText = 'Integrated checksum.'
  }
}

/** Generate an emoji password. */
function generateEmoji() {
  unicodeWarn()

  const entropy = getEntropy()
  const len = Math.ceil(entropy / Math.log2(randomEmoji.length))
  const pass = generatePass(len, randomEmoji, false, randomProps.entropyCheck.checked)

  randomProps.passLength.innerText = len + ' emoji'
  randomProps.passId.style.fontFamily = 'Noto Color Emoji'
  randomProps.passId.innerText = pass
  randomProps.setSize.innerText = randomEmoji.length.toLocaleString() + ' emoji'
  randomProps.passEntropy.innerText = Math.floor(len * Math.log2(randomEmoji.length)) + ' bits'
}
