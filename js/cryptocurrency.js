"use strict"

const cryptoProps = {
  "passId": document.getElementById('crypto-pass'),
  "passLength": document.getElementById('crypto-length'),
  "passEntropy": document.getElementById('crypto-entropy'),
  "setSize": document.getElementById('crypto-set-size'),
  "entropyCheck": document.getElementById('crypto-entropy-check'),
  "passCheck": document.getElementById('crypto-check'),
}

/**
 * Generate a Bitcoin BIPS39-compliant passphrase (seed). Contains checksum.
 * @param {string} selection - The selection option chosen by the user.
 */
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

  wordList = uniquesOnly(wordList)  // Force unique elements in array.

  /**
   * Convert 8-bit byte objects to binary strings.
   * @param {Object} bytes - Unsigned 8-bit Array.
   * @returns {string} Binary string.
   */
  var bytesToBinary = function (bytes) {
    let total = 0n

    for (let i = 0; i < bytes.length; i++) {
      total |= BigInt(bytes[i] * 256 ** (bytes.length - i - 1))
    }

    return total.toString(2)
  }

  /**
   * The SHA-256 hash function.
   * @param {Object} bytes - Unsigned 8-bit Array.
   * @returns {Object} Unsigned 8-bit Array
   */
  var sha256 = function (bytes) {
    const crypto = window.crypto || window.msCrypto

    // Note: This only works under HTTPS or localhost.
    return crypto.subtle.digest('SHA-256', bytes).then(function (hash) {
      return hash
    })
  }

  const entropy = Math.ceil(getEntropy() / 32) * 32 // Multiple of 32 bits, per the bip39 spec

  const entropyBuffer = new Uint8Array(Math.ceil(entropy / 8))

  for (let i = 0; i < entropyBuffer.length; i++) {
    entropyBuffer[i] = secRand(256, cryptoProps.entropyCheck.checked)
  }

  sha256(entropyBuffer).then(function (digest) {
    const sha256Digest = new Uint8Array(digest)

    const entropyBits = bytesToBinary(entropyBuffer).padStart(entropy, '0')
    const checkBits = bytesToBinary(sha256Digest)
      .padStart(256, '0')
      .substring(0, 11 - (entropy % 11))
    const allBits = entropyBits + checkBits

    const bitWords = allBits.match(/(.{1,11})/g)
    const words = bitWords.map(function (binary) {
      const index = parseInt(binary, 2)
      return wordList[index]
    })

    pass = words.join('-')
    cryptoProps.passId.innerText = pass
    cryptoProps.passLength.innerText = pass.length + ' characters'
    cryptoProps.passEntropy.innerText = entropy + ' bits'
    cryptoProps.setSize.innerText = wordList.length.toLocaleString() + ' words'
    cryptoProps.passCheck.innerText = 'Integrated checksum.'
  })
}

/**
 * Generate a Monero-based passphrase (seed). Contains checksum.
 * @param {string} selection - The selection option chosen by the user.
 */
function generateMonero(selection) {
  /**
   * Calculate the CRC32 of a string.
   * https://gist.github.com/lenqwang/1be7b4843a580f2c1df84d5360e5e88c
   * @param {string} string - The string to calculate.
   * @returns {number} A 32-bit integer.
   */
  var crc32 = function (str) {
    let crc = 0 ^ -1
    const crcTable = []
    const encoder = new TextEncoder()

    // Build the CRC32 table.
    for (let i = 0; i < 256; i++) {
      let c = i

      for (let j = 0; j < 8; j++) {
        c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
      }

      crcTable[i] = c
    }

    // Encode the string as raw bytes.
    str = String.fromCharCode(...encoder.encode(str))

    for (let i = 0; i < str.length; i++) {
      crc = (crc >>> 8) ^ crcTable[(crc ^ str.charCodeAt(i)) & 0xff]
    }

    return (crc ^ -1) >>> 0
  }

  let pass = ''
  let wordList = ''
  let prefixLen = 4 // Common for most languages below

  if (selection === 'Chinese') {
    prefixLen = 1
    wordList = moneroCN
  } else if (selection === 'Dutch') {
    wordList = moneroNL
  } else if (selection === 'English') {
    prefixLen = 3
    wordList = moneroEN
  } else if (selection === 'Esperanto') {
    wordList = moneroEO
  } else if (selection === 'French') {
    wordList = moneroFR
  } else if (selection === 'German') {
    wordList = moneroDE
  } else if (selection === 'Italian') {
    wordList = moneroIT
  } else if (selection === 'Japanese') {
    prefixLen = 3
    wordList = moneroJP
  } else if (selection === 'Lojban') {
    wordList = moneroJBO
  } else if (selection === 'Portuguese') {
    wordList = moneroPT
  } else if (selection === 'Russian') {
    wordList = moneroRU
  } else if (selection === 'Spanish') {
    wordList = moneroES
  }

  wordList = uniquesOnly(wordList)  // Force unique elements in array.

  const entropy = Math.ceil(getEntropy() / 32) * 32 // Multiple of 32 bits
  const len = Math.ceil(entropy / Math.log2(wordList.length))

  pass = generatePass(len, wordList, true, cryptoProps.entropyCheck.checked).trim().split(' ')

  let prefixes = ''

  for (let i = 0; i < pass.length; i++) {
    prefixes += pass[i].substring(0, prefixLen)
  }

  const checksum = crc32(prefixes)
  const checkWord = pass[checksum % pass.length]
  pass.push(checkWord)

  pass = pass.join('-')
  cryptoProps.passId.innerText = pass
  cryptoProps.passLength.innerText = pass.length + ' characters'
  cryptoProps.passEntropy.innerText = entropy + ' bits'
  cryptoProps.setSize.innerText = wordList.length.toLocaleString() + ' words'
  cryptoProps.passCheck.innerText = 'Integrated checksum.'
}
