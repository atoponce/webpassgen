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
    s = []
    s += '	' // character tabulation, U+0009
    s += ' ' // space, U+0020
    s += ' ' // no-break space, U+00A0
    s += ' ' // en quad, U+2000
    s += ' ' // em quad, U+2001
    s += ' ' // en space, U+2002
    s += ' ' // em space, U+2003
    s += ' ' // three-per-em space, U+2004
    s += ' ' // four-per-em space, U+2005
    s += ' ' // six-per-em space, U+2006
    s += ' ' // figure space, U+2007
    s += ' ' // punctuation space, U+2008
    s += ' ' // thin space, U+2009
    s += ' ' // hair space, U+200A
    s += ' ' // medium mathematical space, U+205F
    s += '　' // ideographic space, U+3000
  }

  const len = Math.ceil(entropy / Math.log2(s.length))

  let pass = generatePass(len, s, false, randomProps.entropyCheck.checked)
  console.log(pass.length)

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