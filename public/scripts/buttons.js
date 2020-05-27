
$(document).ready(function() {
	const projectLink = 'http://localhost:8080/projects/'
	const writeupLink = 'http://localhost:8080/writeups/'
	const artLink = 'http://localhost:8080/art/'
	const blogLink = 'http://localhost:8080/blog/'

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
	$('#button-blog').on('click', function(e) {
		const url = blogLink;
	  	if (e.ctrlKey){
			window.open(url,'_blank')
		} else {
			document.location.href = url;
		}
	})
})
