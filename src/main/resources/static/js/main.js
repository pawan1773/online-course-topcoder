/* wait for document to get ready */
$(document).ready(function() {
	/* activate materialize side nav in mobile view */
	$('.sidenav').sidenav();

	/* to display registration form */
	$('.register-link').click(function() {
		$('#login-form').trigger("reset");
		$('#registration-form-container').show();
		$('#login-form-container').hide();
	});

	/* to display login form */
	$('.login-link').click(function() {
		$('#register-form').trigger("reset");
		$('#login-form-container').show();
		$('#registration-form-container').hide();
	});

	/* to register user */
	$('#register-form').submit(function(event) {
		event.preventDefault();
		registerUser();
	});
})

function registerUser() {
	alert($("#first_name").val());
}