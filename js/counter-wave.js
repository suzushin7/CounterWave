// Fetch the counter data from the server
fetch('php/counter-wave.php')
  .then(response => response.json())
  .then(data => {
    // Get the total views and start date
    const totalViews = data.total;
    const startDate = data.start_date;

    // Display the total views and start date
    document.getElementById('totalViews').textContent = 'Total: ' + totalViews + ' PV';
    document.getElementById('startDate').textContent = 'Start Date: ' + startDate;

    // Display the daily views
    const dailyData = data.daily;
    const dailyViewsList = document.getElementById('dailyViews');

    // Display the last 30 days
    for (let i = 0; i <= 29; i++) {
      // Get the date string
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        timeZone: 'Asia/Tokyo'
      }).replace(/\//g, '-');

      // Get the views for the date
      const views = dailyData[dateString] || 0;
      const listItem = document.createElement('li');

      // Create the date element
      const dateSpan = document.createElement('span');
      dateSpan.className = 'date';
      dateSpan.textContent = dateString;

      // Create the views element
      const pvSpan = document.createElement('span');
      pvSpan.className = 'pv';
      pvSpan.textContent = views + ' PV';

      // Append the date and views to the list item
      listItem.appendChild(dateSpan);
      listItem.appendChild(pvSpan);

      // Append the list item to the list
      dailyViewsList.appendChild(listItem);
    }
  })
  .catch(error => console.error('Error:', error));
