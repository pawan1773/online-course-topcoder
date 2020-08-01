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

/* to register user */
function registerUser() {
	var firstName = $("#first_name").val();
	var lastName = $("#last_name").val();
	var email = $("#email").val();
	var password = $("#password").val();
	var role = $("input[name='role-radio']:checked").val();

	var registerRequestModel = {
		"firstName" : firstName,
		"lastName" : lastName,
		"email" : email,
		"password" : password,
		"role" : role
	}	

	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : "/register",
		data : JSON.stringify(registerRequestModel),
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : function(data) {
			$('#register-form').trigger("reset");
			$('#login-form-container').show();
			$('#registration-form-container').hide();
		},
		error : function(e) {
			console.log("ERROR : ", e);
		}
	});
}