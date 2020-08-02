/* wait for document to get ready */
$(document).ready(function() {
	/* to prevent login if user is stored in session */
	if (sessionStorage.getItem('user')) {
		$('.without-session').hide();
		$('.username-placeholder').text(
				'Hello, ' + sessionStorage.getItem('user'));
		$('.with-session').show();		
		
		$('#courses-container').show();		
	}
	
	/* activate materialize side nav in mobile view */
	$('.sidenav').sidenav();
	
	/* to start progress bar */
	$(document).ajaxStart(function() {
		$('.progress').show();
	});

	/* to end progress bar */
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
	
	/* to display courses container */
	$('#back-courses').click(function() {
		$('#courses-container').show().siblings().hide();
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
	
	/* to get list of pdfs for particular course */
	$('.list-pdf').click(function() {
		$('#course-title-li').siblings().remove();
		var courseCategory = $(this).data("course-category")
		var pdfs = FILE_CONFIG.filter(function(obj) {
					return obj.courseCategory === courseCategory;
				});
		var pdfListHtml = '';
		for (var i = 0; i < pdfs.length; i++) {
			if (pdfs[i].courseCategory === courseCategory) {
				if(i === 0) {
					pdfListHtml = pdfListHtml + '<li class="collection-item active" data-file-name="' + pdfs[i].fileName +'"><a href="#" class="white-text">' + pdfs[i].fileLinkName + '</a></li>';
				} else {
					pdfListHtml = pdfListHtml + '<li class="collection-item" data-file-name="' + pdfs[i].fileName +'"><a href="#" class="teal-text">' + pdfs[i].fileLinkName + '</a></li>';
				}
			}
		}
		$('#course-title').text(courseCategory);
		$('#pdf-list li:last').after(pdfListHtml);
		$('#pdf-container').show().siblings().hide();
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
				$('#courses-container').show();
				var toastHTML = '<span>' + data.success + '</span>';
				M.toast({
					html : toastHTML,
					classes : 'teal lighten-1'
				});
			},
			error : function(textStatus, errorThrown) {
				var toastHTML = '<span>' + textStatus.responseJSON.error
					+ '</span>';
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
				var toastHTML = '<span>' + data.success + '</span>';
				M.toast({
					html : toastHTML,
					classes : 'teal lighten-1'
				});
			},
			error : function(textStatus, errorThrown) {
				var toastHTML = '<span>' + textStatus.responseJSON.error
					+ '</span>';
				M.toast({
					html : toastHTML,
					classes : 'red lighten-1'
				});
			}
		});
}
