
$(document).ready(function() {
	const projectLink = './projects/'
	const writeupLink = './writeups/'
	const artLink = './art/'
	const blogLink = './blog/'

	// Attach listeners to each button
	$('#button-blog').on('click', function(e) {
		const url = blogLink;
	  	if (e.ctrlKey){
			window.open(url,'_blank')
		} else {
			document.location.href = url;
		}
	})
	$('#button-project').on('click', function(e) {
		const url = projectLink;
	  	if (e.ctrlKey){
			window.open(url,'_blank')
		} else {
			document.location.href = url;
		}
	})
	$('#button-writeup').on('click', function(e) {
		const url = writeupLink;
	  	if (e.ctrlKey){
			window.open(url,'_blank')
		} else {
			document.location.href = url;
		}
	})
	$('#button-art').on('click', function(e) {
		const url = artLink;
	  	if (e.ctrlKey){
			window.open(url,'_blank')
		} else {
			document.location.href = url;
		}
	})
})
