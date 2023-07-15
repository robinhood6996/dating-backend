function generateRandomNumber() {
  const min = 10000; // the minimum value for a 5-digit number
  const max = 99999; // the maximum value for a 5-digit number
  return Math.floor(Math.random() * (max - min + 1) + min);
}
function getFutureDate(numberOfDays) {
  // Create a new Date object for the current date
  var currentDate = new Date();

  // Calculate the future date by adding the specified number of days
  var futureDate = new Date();
  futureDate.setDate(currentDate.getDate() + numberOfDays);

  // Get the day, month, and year from the future date
  var day = futureDate.getDate();
  var month = futureDate.getMonth() + 1; // Months are zero-based, so we add 1
  var year = futureDate.getFullYear();

  // Pad the day and month with leading zeros if necessary
  day = day < 10 ? "0" + day : day;
  month = month < 10 ? "0" + month : month;

  // Combine the day, month, and year in the desired format
  var formattedDate = day + "-" + month + "-" + year;

  // Return the future date
  return formattedDate;
}

function mergeArrays(oldArray, newArray) {
  let oldData = [...oldArray];
  newArray.forEach((newObj) => {
    const index = oldData.findIndex(
      (oldObj) => oldObj.langauge === newObj.langauge
    );

    if (index !== -1) {
      oldData.splice(index, 1);
    }

    oldData.push(newObj);
  });

  return oldData;
}

module.exports = { generateRandomNumber, getFutureDate, mergeArrays };
