// Fetch time taken data from JSON file
fetch('timeTaken.json')
  .then(response => response.json())
  .then(data => {
    const timeList = document.getElementById('time-list');

    // Iterate over the time data and create list items
    data.forEach(time => {
      const listItem = document.createElement('li');
      listItem.innerText = time;
      timeList.appendChild(listItem);
    });
  })
  .catch(error => {
    console.error('Error fetching time data:', error);
  });
