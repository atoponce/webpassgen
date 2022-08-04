/**
 * Generate an EFF passphrase based on the chosen word list.
 * @param {string} selection - An EFF word list.
 */
function generateEff(selection) {
  let pass = ''
  let wordList = ''

  if (selection === 'Distant Words') {
    wordList = effDistant
  } else if (selection === 'Short Words') {
    wordList = effShort
  } else if (selection === 'Long Words') {
    wordList = effLong
  } else if (selection === 'Game of Thrones') {
    wordList = effGameOfThrones
  } else if (selection === 'Harry Potter') {
    wordList = effHarryPotter
  } else if (selection === 'Star Trek') {
    wordList = effStarTrek
  } else if (selection === 'Star Wars') {
    wordList = effStarWars
  }

  wordList = uniquesOnly(wordList)  // Force unique elements in array.

  const entropy = getEntropy()
  const len = Math.ceil(entropy / Math.log2(wordList.length))
  const passId = document.getElementById('eff-pass')
  const passLength = document.getElementById('eff-length')
  const passEntropy = document.getElementById('eff-entropy')
  const entropyCheck = document.getElementById('eff-entropy-check')

  let useEntropy = false

  if (entropyCheck.checked) {
    useEntropy = true
  }

  pass = generatePass(len, wordList, true, useEntropy)
  pass = pass.replace(/ /g, '-')
  passId.innerText = pass
  passLength.innerText = pass.length + ' characters.'
  passEntropy.innerText = Math.floor(len * Math.log2(wordList.length)) + ' bits,'
}
