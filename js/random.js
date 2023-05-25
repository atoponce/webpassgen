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
  } else if (option === "Whitespace" ) {
    unicodeWarn()
    // Base22

    /**
     * Problematic whitespace characters that aren't printing:
     *   '	': character tabulation, U+009
     *   ' ': non-breaking space, U+00A0
     *
     * Defined as space characters in Unicode, but have a graphical mark:
     *   ' ': Ogham space mark, U+1680
     *   '〿': Ideographic half fill space, U+303F
     */

    // Sorted by Unicode hex code
    s = []
    s.push(' ') // Space, U+0020
    s.push('᠎') // Mongolian vowel separator, U+180E
    s.push(' ') // En quad, U+2000
    s.push(' ') // Em quad, U+2001
    s.push(' ') // En space, U+2002
    s.push(' ') // Em space, U+2003
    s.push(' ') // Three-per-em space, U+2004
    s.push(' ') // Four-per-em space, U+2005
    s.push(' ') // Six-per-em space, U+2006
    s.push(' ') // Figure space, U+2007
    s.push(' ') // Punctuation space, U+2008
    s.push(' ') // Thin space, U+2009
    s.push(' ') // Hair space, U+200A
    s.push('​') // Zero width space, U+200B
    s.push('‌') // Zero width non-joiner, U+200C
    s.push('‍') // Zero width joiner, U+200D
    s.push(' ') // Narrow no-break space, U+202F
    s.push(' ') // Medium mathematical space, U+205F
    s.push('⁠') // Word joiner, U+2060
    s.push('　') // Ideographic space, U+3000
    s.push('﻿') // Zero width non-breaking space, U+FEFF
    s.push('󠀠') // Tag space, U+E0020
  }

  const len = Math.ceil(entropy / Math.log2(s.length))

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
    randomProps.passId.classList.add('whitespace')
  } else {
    randomProps.passId.classList.remove('whitespace')
  }

  randomProps.passLength.innerText = pass.length + ' characters'
  randomProps.passId.removeAttribute('style') // from emoji
  randomProps.passId.innerText = pass
  randomProps.setSize.innerText = s.length.toLocaleString() + ' characters'
  randomProps.passEntropy.innerText = Math.floor(len * Math.log2(s.length)) + ' bits'

  if (displayCheck) {
    randomProps.passCheck.innerText = 'Integrated checksum.'
  } else {
    randomProps.passCheck.innerText = ''
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