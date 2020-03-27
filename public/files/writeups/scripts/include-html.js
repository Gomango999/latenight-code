function includeHTML() {
	elements = $("*");
	for (var i = 0; i < elements.length; i++) {
		element = elements[i];
		file = element.getAttribute("include-html");
		if (file) {
			xhr = new XMLHttpRequest();
			xhr.onreadystatechange = function() {
				if (this.readyState == 4) {
					if (this.status == 200) {
						element.innerHTML = this.responseText;
					}
					if (this.status == 404) {
						element.innerHTML = "Content not found";
					}
					element.removeAttribute("include-html");
					includeHTML();
				}
			}
			xhr.open("GET", file, true);
			xhr.send();
			return;
		}
	}
}

$(document).ready(includeHTML)
