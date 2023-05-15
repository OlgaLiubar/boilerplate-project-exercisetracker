function filterLogsByDateRange(logsArray, queryParams) {
  const fromDate = queryParams?.from ? new Date(new Date(queryParams?.from).toDateString()) : null;
  const toDate = queryParams?.to ? new Date(new Date(queryParams.to).toDateString()) : null;

  let filteredLogs = logsArray;

  // filter by date range if dates are provided
  if (fromDate || toDate) {
    const dateRangedLogs = filteredLogs.filter((log) => {
      const logDate = new Date(log.date);
      return (
        (!fromDate || logDate >= fromDate) && (!toDate || logDate <= toDate)
      );
    });
    filteredLogs = sortByDate(dateRangedLogs);
  }

  // sort by date if no query parameters are provided
  else {
    filteredLogs = sortByDate(filteredLogs);
  }
  return filteredLogs
}

const sortByDate = (arr) => {
  const sortedByDateArr = arr.sort((a, b) => {
    return new Date(a.date) - new Date(b.date);
  });
  return sortedByDateArr;
};

module.exports = {
  filterLogsByDateRange,
};
