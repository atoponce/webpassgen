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
  let s = ''
  let check = ''
  let displayCheck = false
  const entropy = getEntropy()
  const option = document.getElementById('random-options').value

  randomProps.passCheck.innerText = ''
  randomProps.passId.classList.remove('whitespace')
  randomProps.passId.removeAttribute('style') // from emoji

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
    s = '0123'
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
  } else if (option === "Whitespace" ) {
    // Must be inside CSS "break-spaces" to render tab and not collapse or trim spaces.
    unicodeWarn()

    s = [
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
  }

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
