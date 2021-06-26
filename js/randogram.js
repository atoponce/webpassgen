const CANVAS = document.getElementById('randogram')
const CTX = CANVAS.getContext('2d', {alpha: false})
const LENGTH = 400

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

function getEntropy () {
  const entropyResult1 = document.getElementById('entropyResult1')
  const entropyResult2 = document.getElementById('entropyResult2')
  const pixels = drawRandogram()

  let entropy
  let bits = []
  let neumann = []
  let items = JSON.parse(localStorage.entropy).length

  entropyResult1.innerText = 16 * items
  entropyResult2.innerText = items

  if (localStorage.hasOwnProperty('entropy')) {
    entropy = JSON.parse(localStorage.entropy)
  } else {
    entropy = []
  }

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

          if (bits.length === 16) {
            entropy.push(parseInt(bits.join(''), 2))
            items++
            bits = []
          }
        }

        neumann = []
      }
    } // if 0 <= x < LENGTH && 0 <= y < LENGTH

    entropyResult1.innerText = 16 * items
    entropyResult2.innerText = items
  } // onpointermove
  requestAnimationFrame(drawRandogram)
} // getEntropy()

getEntropy()
