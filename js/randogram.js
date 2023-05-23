"use strict"

const randogramProps = {
  "lifetimeBits": parseInt(localStorage.lifetimeBits, 10) || 0,
  "length": 400,
  "entropy": [],
  "bits": [],
  "neumann": [],
  "ctx": document.getElementById('randogram').getContext('2d'),
  "officerRank": document.getElementById('officerRank'),
  "rankPips": document.getElementById('rankPips'),
  "nextRank": document.getElementById('nextRank'),
  "remainingRankBits": document.getElementById('remainingRankBits'),
  "entropyResult1": document.getElementById('entropyResult1'),
  "entropyResult2": document.getElementById('entropyResult2'),
}

/**
 * Awards a Star Trek officer rank based on the number of bits they've
 * accumulated over the life of the game.
 * @param {Number} bits - The amount of unbiased bits collected.
 */
function awardOfficerRank (bits) {
  // Thank you https://feathericons.com/
  const openPip = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#333333" stroke="#d1a52c" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="feather feather-circle">
      <circle cx="12" cy="12" r="10"></circle>
    </svg>
  `
  const closedPip = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#d1a52c" stroke="#d1a52c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-circle">
      <circle cx="12" cy="12" r="10"></circle>
    </svg>
  `

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
    Rank is awarded exponentially based on the number of bits generated as
    2**bits >> 4.

    For example:
      - Until you generate less than 64 bits, you are a cadet in the academy.
      - When you have generated 1,280 bits, your awarded rank would be
        "Commander".
      - When you have generated 128 samples, you would be promoted to "Captain".
      - To reach 'Fleet Admiral', you need to generate 16,384 samples (262,144
        bits).

    Rank is only awarded, never revoked. That is, unless you clear your
    localStorage.
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

  if (bits < 64) {
    rank = rankOrder[0]
  } else {
    rank = rankOrder[Math.floor(Math.log2(bits >> 4)) - 1]
  }

  let nextRank = rankOrder[rankOrder.indexOf(rank) + 1]

  localStorage.rank = rank
  randogramProps.officerRank.innerText = rank
  randogramProps.nextRank.innerText = nextRank
  randogramProps.remainingRankBits.innerText = (2 ** (rankOrder.indexOf(nextRank) + 1) << 4) - localStorage.lifetimeBits

  // openPip, closedPip
  let pipString = ''
  let pips = JSON.parse(rankPips[rank])

  pipString = pips[1].replace(/O/, openPip)
  pipString = pipString.replace(/C/g, closedPip)

  randogramProps.rankPips.innerHTML = pipString

  if (pips[0] === 1) {
    randogramProps.rankPips.style.background = '#333333'
    randogramProps.rankPips.style.border = '3px solid #d1a52c'
    randogramProps.rankPips.style.borderRadius = '5px'
    randogramProps.rankPips.style.padding = '11px 2px 2px 2px'
  }
}

/**
 * Concatenate multiple arrays into one.
 * @param {Array} resultConstructor - A JavaScript typed Array to store tho concatenated arrays.
 * @param  {...any} arrays - A iterable list of data to concatenate.
 * @return {Array} - A typed array.
 */
function concatenate(resultConstructor, ...arrays) {
  // https://exploringjs.com/impatient-js/ch_typed-arrays.html#concatenating-typed-arrays
  let totalLength = 0

  for (const arr of arrays) {
    totalLength += arr.length
  }

  const result = new resultConstructor(totalLength)
  let offset = 0

  for (const arr of arrays) {
    result.set(arr, offset)
    offset += arr.length
  }

  return result
}

/** Generate cryptographically secure random numbers for one randogram. */
function randogram () {
  return crypto.getRandomValues(new Uint8Array(40000))
}

/** Concatenate four cryptographically secure randograms to fill the canvas. */
function genPixels () {
  return concatenate(Uint8Array, randogram(), randogram(), randogram(), randogram())
}

/** John von Neumann randomness extraction method. */
function extractRandomness() {
  if (randogramProps.neumann.length === 2) {
    if (randogramProps.neumann[0] !== randogramProps.neumann[1]) {
      randogramProps.bits.push(randogramProps.neumann[0])
      randogramProps.lifetimeBits++

      if (randogramProps.bits.length === 16) {
        randogramProps.entropy.push(parseInt(randogramProps.bits.join(''), 2))
        randogramProps.bits = []
      }
    }

    randogramProps.neumann = []
  }
}

/** Draw the actual randogram on the canvas and animate it. */
function drawRandogram () {
  const imgData = randogramProps.ctx.createImageData(randogramProps.length, randogramProps.length)
  const pixels = genPixels()

  if (localStorage.hasOwnProperty('entropy')) {
    randogramProps.entropy = JSON.parse(localStorage.entropy)
  }

  for (let i = 0; i < imgData.data.length; i += 4) {
    if (pixels[i >> 2] < 128) {
      imgData.data[i]     = 255 // red
      imgData.data[i + 1] = 255 // green
      imgData.data[i + 2] = 255 // blue
    }

    imgData.data[i + 3] = 255   // alpha
  }

  updateEntropyCounts() // set count initially
  awardOfficerRank(randogramProps.lifetimeBits)

  randogramProps.ctx.putImageData(imgData, 0, 0)
  requestAnimationFrame(drawRandogram)

  document.getElementById('randogram').onpointermove = function (e) {
    const x = Math.floor(e.offsetX)
    const y = Math.floor(e.offsetY)

    if (0 <= x && x < randogramProps.length && 0 <= y && y < randogramProps.length) {
      const index = randogramProps.length * y + x
      randogramProps.neumann.push(pixels[index] & 1)
      extractRandomness()
    }

    localStorage.entropy = JSON.stringify(randogramProps.entropy)

    updateEntropyCounts() // update counts on mouse movement
    awardOfficerRank(randogramProps.lifetimeBits)
  }
}

/** Update the statistics on the page for the user to see their randomness
 * progress. */
function updateEntropyCounts () {
  let items = 0

  if (localStorage.hasOwnProperty('entropy')) {
    items = JSON.parse(localStorage.entropy).length
  }

  randogramProps.entropyResult1.innerText = items << 4
  randogramProps.entropyResult2.innerText = items
}

drawRandogram()