
$(document).ready(function() {
	const projectLink = 'http://www.youtube.com'
	// const writeupLink = 'file:///C:/Users/kevin/Dropbox/website/writeups/index.html'
	const writeupLink = 'http://localhost:8080/writeups/'
	const artLink = 'http://localhost:8080/art/'

	// Attach listeners to each button
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

