/* wait for document to get ready */
$(document).ready(function() {
	/* activate materialize side nav in mobile view */
	$('.sidenav').sidenav();
	
	/* to register user */
	$("#register-form").submit(function(event) {
		event.preventDefault();
		registerUser();
	});
})

function registerUser() {
	alert($("#first_name").val());
}