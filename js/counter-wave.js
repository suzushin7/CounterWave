fetch('php/counter-wave.php')
  .then(response => response.json())
  .then(data => {
    const totalViews = data.total;
    const startDate = data.start_date;

    // Display total views and start date
    document.getElementById('totalViews').textContent = 'Total: ' + totalViews + ' PV';
    document.getElementById('startDate').textContent = 'Start Date: ' + startDate;

    const dailyData = data.daily;
    const dailyViewsList = document.getElementById('dailyViews');

    // Clear the list
    dailyViewsList.innerHTML = '';

    // Input PV data into an array
    const pvArray = [];
    for (let i = 0; i <= 29; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toLocaleDateString('ja-JP',
        { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'Asia/Tokyo' })
        .replace(/\//g, '-');

      const views = dailyData[dateString] || 0;
      pvArray.push(views);
    }

    // Get the maximum PV
    const maxPV = Math.max(...pvArray);

    // Create a list of daily views
    pvArray.forEach((views, index) => {
      const listItem = document.createElement('li');

      // Display date
      const date = new Date();
      date.setDate(date.getDate() - index);
      const dateString = date.toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-');

      const dateSpan = document.createElement('span');
      dateSpan.className = 'date';
      dateSpan.textContent = dateString;

      // Display graph
      const graphSpan = document.createElement('span');
      graphSpan.className = 'graph';

      // Set the scale of the graph
      const scaledPV = Math.round((views / maxPV) * 20);
      graphSpan.textContent = '*'.repeat(scaledPV);

      // Display PV
      const pvSpan = document.createElement('span');
      pvSpan.className = 'pv';
      pvSpan.textContent = views + ' PV';

      // Add the date, graph, and PV to the list item
      listItem.appendChild(dateSpan);
      listItem.appendChild(graphSpan);
      listItem.appendChild(pvSpan);

      dailyViewsList.appendChild(listItem);
    });
  })
  .catch(error => console.error('Error:', error));
