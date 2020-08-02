/* wait for document to get ready */
$(document).ready(function() {
	/* activate materialize side nav in mobile view */
	$('.sidenav').sidenav();
	
	$(document).ajaxStart(function() {
		$('.progress').show();
	});

	$(document).ajaxComplete(function() {
		$('.progress').hide();
	});
	
	/* to clear session storage on logout */
	$('.logout-link').click(function() {
		sessionStorage.removeItem('user');
		$('.without-session').show();
		$('.with-session').hide();
		$('#registration-form-container').show().siblings().hide();
	});

	/* to prevent login if user is stored in session */
	if (sessionStorage.getItem('user')) {
		$('.without-session').hide();
		$('.username-placeholder').text('Hello, ' + sessionStorage.getItem('user'));
		$('.with-session').show();
		$('#courses-container').show().siblings().hide();
	}

	/* to display registration form */
	$('.register-link').click(function() {
		$('#login-form').trigger("reset");
		$('#recovery-form').trigger("reset");
		$('#registration-form-container').show().siblings().hide();
	});

	/* to display login form */
	$('.login-link').click(function() {
		$('#register-form').trigger("reset");
		$('#recovery-form').trigger("reset");
		$('#login-form-container').show().siblings().hide();
	});

	/* to display password recovery form */
	$('.forgot-password-link').click(function() {
		$('#login-form').trigger("reset");
		$('#register-form').trigger("reset");
		$('#password-recovery-form-container').show().siblings().hide();
	});

	/* to register user */
	$('#register-form').submit(function(event) {
		event.preventDefault();
		registerUser();
	});
	
	/* to login user */
	$('#login-form').submit(function(event) {
		event.preventDefault();
		loginUser();
	});
})

/* to login user */
function loginUser() {
	var email = $("#login-email").val();
	var password = $("#login-password").val();
	
	var loginRequestModel = {
		"email" : email,
		"password" : password
	}

	$.ajax({
			type : "POST",
			contentType : "application/json",
			url : "/login",
			data : JSON.stringify(loginRequestModel),
			dataType : 'json',
			cache : false,
			timeout : 600000,
			success : function(data) {
				sessionStorage.setItem('user', data.user);
				$('#login-form').trigger("reset");
				$('.without-session').hide();
				$('.username-placeholder').text('Hello, ' + sessionStorage.getItem('user'));
				$('.with-session').show();
				$('#courses-container').show().siblings().hide();
				var toastHTML = '<span>'
						+ data.success
						+ '</span><button class="white-text btn-flat toast-action">Close</button>';
				M.toast({
					html : toastHTML,
					classes : 'teal lighten-1'
				});
			},
			error : function(textStatus, errorThrown) {
				var toastHTML = '<span>'
						+ textStatus.responseJSON.error
						+ '</span><button class="white-text btn-flat toast-action">Close</button>';
				M.toast({
					html : toastHTML,
					classes : 'red lighten-1'
				});
			}
		});
}

/* to register user */
function registerUser() {
	var firstName = $("#first_name").val();
	var lastName = $("#last_name").val();
	var email = $("#email").val();
	var password = $("#password").val();
	var recoveryKey = $("#recovery").val();
	var role = $("input[name='role-radio']:checked").val();

	var registerRequestModel = {
		"firstName" : firstName,
		"lastName" : lastName,
		"email" : email,
		"password" : password,
		"recoveryKey" : recoveryKey,
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
				$('#login-form').trigger("reset");
				$('#login-form-container').show().siblings().hide();
				var toastHTML = '<span>'
						+ data.success
						+ '</span><button class="white-text btn-flat toast-action">Close</button>';
				M.toast({
					html : toastHTML,
					classes : 'teal lighten-1'
				});
			},
			error : function(textStatus, errorThrown) {
				var toastHTML = '<span>'
						+ textStatus.responseJSON.error
						+ '</span><button class="white-text btn-flat toast-action">Close</button>';
				M.toast({
					html : toastHTML,
					classes : 'red lighten-1'
				});
			}
		});
}
