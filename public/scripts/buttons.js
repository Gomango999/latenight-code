
$(document).ready(function() {
	const blogLink = './blog/'

	// Attach listeners to each button
	$('#button-blog').on('click', function(e) {
    console.log("HI")
		const url = blogLink;
	  	if (e.ctrlKey){
			window.open(url,'_blank')
		} else {
			document.location.href = url;
		}
	})
})
