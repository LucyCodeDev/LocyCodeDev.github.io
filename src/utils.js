export function generateLottoNumbers(numOfSets = 1) {
  const lottoNumbers = [];
  for (let i = 0; i < numOfSets; i++) {
    const singleSet = new Set();
    while (singleSet.size < 6) {
      const number = String(Math.floor(Math.random() * 45) + 1).padStart(2, "0");
      singleSet.add(number);
    }
    lottoNumbers.push(Array.from(singleSet));
  }
  return lottoNumbers;
}
