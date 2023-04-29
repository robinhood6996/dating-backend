function generateRandomNumber() {
  const min = 10000; // the minimum value for a 5-digit number
  const max = 99999; // the maximum value for a 5-digit number
  return Math.floor(Math.random() * (max - min + 1) + min);
}

module.exports = { generateRandomNumber };
