const CANVAS = document.getElementById('randogram')
const CTX = CANVAS.getContext('2d', {alpha: false})
const LENGTH = 400
const OFFICERRANK = document.getElementById('officerRank')
const RANKPIPS = document.getElementById('rankPips')

function awardOfficerRank (bits) {
  // Thank you https://feathericons.com/
  const openPip = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#333333" stroke="#d1a52c" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="feather feather-circle"><circle cx="12" cy="12" r="10"></circle></svg>'
  const closedPip = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#d1a52c" stroke="#d1a52c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-circle"><circle cx="12" cy="12" r="10"></circle></svg>'

  /*
    For each key (rank), the value is the pip assignment as an array of 2 elements.:
      [0, .] are non-boxed pips (Ensign through Fleet Captain)
      [1, .] are boxed pips (Commodore through Fleet Admiral)

    The pips themselves have two values:
      "O" is an open pip (as seen on Chief Petty Officer, Lieutenant Junior Grade, & Lieutenant Commander)
      "C" is a closed pip (as seen on Ensign through Fleet Admiral)

    There is probably a better way to do this.
  */
  const rankPips = {
    'Cadet': '[0, ""]',
    'Chief Petty Officer': '[0, "O"]',
    'Ensign': '[0, "C"]',
    'Lieutenant Junior Grade': '[0, "OC"]',
    'Lieutenant': '[0, "CC"]',
    'Lieutenant Commander': '[0, "OCC"]',
    'Commander': '[0, "CCC"]',
    'Captain': '[0, "CCCC"]',
    'Fleet Captain': '[0, "CCCCC"]',
    'Commodore': '[1, "C"]',
    'Rear Admiral': '[1, "CC"]',
    'Vice Admiral': '[1, "CCC"]',
    'Admiral': '[1, "CCCC"]',
    'Fleet Admiral': '[1, "CCCCC"]'
  }

  /*
    Rank is awarded exponentially based on the number of bits generated as 2**bits / 16.

    For example:
      - Until you generate less than 64 bits, you are a cadet in the academy.
      - When you have generated 1,280 bits, your awarded rank would be "Commander".
      - When you have generated 128 samples, you would be promoted to "Captain".
      - To reach 'Fleet Admiral', you need to generate 16,384 samples (262,144 bits).

    Rank is only awarded, never revoked.
  */
  const rankOrder = [
    'Cadet',                   //       0 <= bits <      64
    'Chief Petty Officer',     //      64 <= bits <     128
    'Ensign',                  //     128 <= bits <     256
    'Lieutenant Junior Grade', //     256 <= bits <     512
    'Lieutenant',              //     512 <= bits <   1,024
    'Lieutenant Commander',    //   1,024 <= bits <   2,048
    'Commander',               //   2,048 <= bits <   4,096
    'Captain',                 //   4,096 <= bits <   8,192
    'Fleet Captain',           //   8,192 <= bits <  16,384
    'Commodore',               //  16,384 <= bits <  32,768
    'Rear Admiral',            //  32,768 <= bits <  65,536
    'Vice Admiral',            //  65,536 <= bits < 131,072
    'Admiral',                 // 131,072 <= bits < 262,144
    'Fleet Admiral'            // 262,144 <= bits
  ]

  localStorage.lifetimeBits = bits

  let rank
  if (bits < 64) rank = rankOrder[0]
  else rank = rankOrder[Math.floor(Math.log2(bits / 16)) - 1]

  localStorage.rank = rank
  OFFICERRANK.innerText = rank

  // openPip, closedPip
  let pipString = ''
  let pips = JSON.parse(rankPips[rank])

  pipString = pips[1].replace(/O/, openPip)
  pipString = pipString.replace(/C/g, closedPip)

  RANKPIPS.innerHTML = pipString

  if (pips[0] === 1) {
    RANKPIPS.style.background = '#333333'
    RANKPIPS.style.border = '3px solid #d1a52c'
    RANKPIPS.style.borderRadius = '5px'
    RANKPIPS.style.padding = '11px 2px 2px 2px'
  }
}

// https://exploringjs.com/impatient-js/ch_typed-arrays.html#concatenating-typed-arrays
function concatenate (resultConstructor, ...arrays) {
  let totalLength = 0

  for (const arr of arrays) totalLength += arr.length

  const result = new resultConstructor(totalLength)
  let offset = 0

  for (const arr of arrays) {
    result.set(arr, offset)
    offset += arr.length
  }

  return result
}

function randogram () {
  return crypto.getRandomValues(new Uint8Array(40000)) // max ArrayBufferView byte length
}

function genPixels () {
  return concatenate(Uint8Array, randogram(), randogram(), randogram(), randogram())
}

function drawRandogram () {
  const imgData = CTX.getImageData(0, 0, LENGTH, LENGTH)
  const pixels = genPixels()

  for (let i = 0; i < imgData.data.length; i += 4) {
    if (pixels[i / 4] % 2 === 0) {
      imgData.data[i] = 0
      imgData.data[i + 1] = 0
      imgData.data[i + 2] = 0
    } else {
      imgData.data[i] = 255
      imgData.data[i + 1] = 255
      imgData.data[i + 2] = 255
    }
  }

  CTX.putImageData(imgData, 0, 0)
  requestAnimationFrame(drawRandogram)

  return pixels
}

function updateEntropyCounts () {
  let items = 0
  const entropyResult1 = document.getElementById('entropyResult1')
  const entropyResult2 = document.getElementById('entropyResult2')

  if (localStorage.hasOwnProperty('entropy')) items = JSON.parse(localStorage.entropy).length

  entropyResult1.innerText = 16 * items
  entropyResult2.innerText = items

}

function getEntropy () {
  let entropy
  let bits = neumann = []
  let lifetimeBits = parseInt(localStorage.lifetimeBits, 10) || 0
  const pixels = drawRandogram()

  if (localStorage.hasOwnProperty('entropy')) {
    entropy = JSON.parse(localStorage.entropy)
  } else {
    entropy = []
  }

  updateEntropyCounts() // set count initially
  awardOfficerRank(lifetimeBits)

  document.getElementById('randogram').onpointermove = function (e) {
    const x = Math.floor(e.offsetX)
    const y = Math.floor(e.offsetY)

    localStorage.entropy = JSON.stringify(entropy)

    if (0 <= x && x < LENGTH && 0 <= y && y < LENGTH) {
      const p = LENGTH * y + x

      neumann.push(pixels[p] % 2)

      // john von neumann randomness extractor
      if (neumann.length === 2) {
        if (neumann[0] !== neumann[1]) {
          bits.push(neumann[0])
          lifetimeBits++

          if (bits.length === 16) {
            entropy.push(parseInt(bits.join(''), 2))
            bits = []
          }
        }

        neumann = []
      }
    } // if 0 <= x < LENGTH && 0 <= y < LENGTH

    updateEntropyCounts() // update counts on mouse movement
    awardOfficerRank(lifetimeBits)
  } // onpointermove
  requestAnimationFrame(drawRandogram)
} // getEntropy()

getEntropy()
