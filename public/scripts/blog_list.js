function updateDateTime() {
  let timeString = moment().format('h:mm:ss a');
  $('#time-div #time').text(timeString);
  let dateString = moment().format('YYYY.MM.DD ddd');
  $('#time-div #date').text(dateString);
}

$(document).ready(function() {
	// Make clicking arrow scroll to bottom
	$('#moon-symbol').on('click', function(e) {
		window.scrollTo(0,document.body.scrollHeight);
	})

  updateDateTime();
  setInterval(updateDateTime, 1000);
})