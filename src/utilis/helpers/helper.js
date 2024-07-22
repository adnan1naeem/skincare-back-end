function isFirstDateLarger(firstDate, secondDate) {
    // Convert the date strings to Date objects if they are not already
    const date1 = new Date(firstDate);
    const date2 = new Date(secondDate);

    // Compare the two dates
    return date1 > date2;
}
module.exports = { isFirstDateLarger }