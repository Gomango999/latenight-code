function includeHTML() {
	elements = $("[include-html]");
	for (const element of elements) {
		file = element.getAttribute("include-html");
		if (file) {
			xhr = new XMLHttpRequest();
			xhr.onreadystatechange = function() {
				if (this.readyState == 4) {
					if (this.status == 200) {
						result = this.responseText
					}
					if (this.status == 404) {
						result = "Uh oh. Looks like the content couldn't be found!"
					}
					element.innerHTML = result;
					element.removeAttribute("include-html");
					includeHTML(); // Recursively include files
				}
			}
			xhr.open("GET", file, true);
			xhr.send();
			return;
		}
	}
}

$(document).ready(includeHTML)
