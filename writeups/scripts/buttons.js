function updateHTML(element, file) {
	xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function () {
		if (this.readyState == 4) {
			if (this.status == 200) {
				result = this.responseText
			}
			if (this.status == 404) {
				result = "Uh oh. Looks like the content couldn't be found!"
			}
			element.innerHTML = result;
		}
	}
	xhr.open("GET", file, true);
	xhr.send();
}


$(document).ready(function() {
	const problemFile = "vases-problem.html";
	const analysisFile = "vases-analysis.html"

	$('#problembutton').on('click', function(e) {
		updateHTML($("#analysis")[0], problemFile);
		$("#problembutton").css("border-top", "3px #706993 solid")
		$("#analysisbutton").css("border-top", "3px #211f25 solid")
	})
	$('#analysisbutton').on('click', function(e) {
		updateHTML($("#analysis")[0], analysisFile);
		$("#problembutton").css("border-top", "3px #211f25 solid")
		$("#analysisbutton").css("border-top", "3px #706993 solid")
	})
})