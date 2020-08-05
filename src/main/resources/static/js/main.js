/* wait for document to get ready */
$(document).ready(function () {
	
	/* to bypass login if user is already logged in */
	if (sessionStorage.getItem('firstName') != null) {
		$('.without-session').hide();
		$('.username-placeholder').text(
			'Hello, ' + sessionStorage.getItem('firstName'));
		$('.with-session').show();
		$('#courses-container').show();
	}

	/* activate materialize side nav in mobile view */
	$('.sidenav').sidenav();

	/* to start progress bar */
	$(document).ajaxStart(function () {
		$('.progress').show();
	});

	/* to end progress bar */
	$(document).ajaxComplete(function () {
		$('.progress').hide();
	});

	/* to clear session storage on logout */
	$('.logout-link').click(function () {
		const userInfo = getUserInfoFromSessionStorage();
		
		/* send student session time to gtag */
		if(isStudent(userInfo)) {
			const sessionTime = new Date() - Date.parse(sessionStorage.getItem("loggedInTime"));
			gtag('event', userInfo.firstName + ' has spent ' + sessionTime + ' milliseconds on application', {
				'event_category': 'LOGGED_IN_PERIOD',
				'event_label': 'LOGGED_IN_PERIOD'
			});				
		}	
		
		sessionStorage.clear();
		$('.without-session').show();
		$('.with-session').hide();
		$('#login-form').trigger("reset");
		$('#login-form-container').show().siblings().hide();
	});

	/* to display registration form */
	$('.register-link').click(function () {
		$('#login-form').trigger("reset");
		$('#recovery-form').trigger("reset");
		$('#registration-form-container').show().siblings().hide();
	});

	/* to display login form */
	$('.login-link').click(function () {
		$('#register-form').trigger("reset");
		$('#recovery-form').trigger("reset");
		$('#login-form-container').show().siblings().hide();
	});

	/* to display courses container */
	$('#back-courses').click(function () {
		$('#courses-container').show().siblings().hide();
	});

	/* to display password recovery form */
	$('.forgot-password-link').click(function () {
		$('#login-form').trigger("reset");
		$('#register-form').trigger("reset");
		$('#password-recovery-form-container').show().siblings().hide();
	});

	/* to register user */
	$('#register-form').submit(function (event) {
		event.preventDefault();
		registerUser();
	});

	/* to login user */
	$('#login-form').submit(function (event) {
		event.preventDefault();
		loginUser();
	});
	
	/* to change password */
	$('#recovery-form').submit(function (event) {
		event.preventDefault();
		forgotPassword();
	});	
	
	/* to download pdf */
	$('#download-pdf').click(function () {
		downloadPdf();
	});

	/* to show pdfs */
	$(document).on('click', '.view-pdf', function () {
		var courseCategory = $(this).data('course-category');
		var pdfs = FILE_CONFIG.filter(function (obj) {
			return obj.courseCategory === courseCategory;
		});
		var pdfListHtml = '';
		var previewFileConfig = '';
		var divId = 'adobe-dc-full-window';
		var embedMode = 'FULL_WINDOW';
		/* if view here button is clicked on card */
		if ($(this).hasClass('list-pdf')) {
			$('#course-title-li').siblings().remove();
			for (var i = 0; i < pdfs.length; i++) {
				if (pdfs[i].courseCategory === courseCategory) {
					if (i === 0) {
						previewFileConfig = pdfs[i];
						pdfListHtml = pdfListHtml + '<li class="collection-item active"><a href="#" class="view-pdf white-text" data-course-category="' + courseCategory + '" data-file-name="' + pdfs[i].fileName + '">' + pdfs[i].fileLinkName + '</a></li>';
					} else {
						pdfListHtml = pdfListHtml + '<li class="collection-item"><a href="#" class="view-pdf teal-text" data-course-category="' + courseCategory + '" data-file-name="' + pdfs[i].fileName + '">' + pdfs[i].fileLinkName + '</a></li>';
					}
				}
			}
			$('#course-title').text(courseCategory);
			$('#pdf-list li:last').after(pdfListHtml);
			$('.emb-btn').data('course-category', previewFileConfig.courseCategory);
			$('.emb-btn').data('file-name', previewFileConfig.fileName);
			$('#pdf-container').show().siblings().hide();
			$('#btn-full').addClass('disabled').siblings().removeClass('disabled');
			$('#adobe-dc-full-window').show().siblings().hide();
		} else {
			/* if file links or embeded buttons are clicked */
			var fileName = $(this).data('file-name');
			for (var i = 0; i < pdfs.length; i++) {
				if (pdfs[i].courseCategory === courseCategory && pdfs[i].fileName === fileName) {
					previewFileConfig = pdfs[i];
				}
			}
			if ($(this).hasClass('emb-btn')) {
				$('.emb-btn').removeClass('disabled');
				$(this).addClass('disabled');
				embedMode = $(this).data("embed-mode");
			} else {
				$(this).addClass('white-text')
				$(this).parent().addClass('active').siblings().removeClass('active').children().removeClass('white-text').addClass('teal-text');
				$('.emb-btn').data('course-category', previewFileConfig.courseCategory);
				$('.emb-btn').data('file-name', previewFileConfig.fileName);
				$('.emb-btn').removeClass('disabled');
				$('#btn-full').addClass('disabled');
			}

			/* set divId for viewer */
			if (embedMode === 'SIZED_CONTAINER') {
				divId = 'adobe-dc-sized-container';
				$('#adobe-dc-sized-container').show().siblings().hide();
			} else {
				divId = 'adobe-dc-full-window';
				$('#adobe-dc-full-window').show().siblings().hide();
			}
		}

		/* setup viewer configurations */
		const viewerConfig = {
			"defaultViewMode": "FIT_WIDTH",
			"embedMode": embedMode,
			"enableAnnotationAPIs": true
		};

		/* to set preview properties */
		setPreviewFile(divId, viewerConfig, previewFileConfig);
	});
})

/** 
 * To set preview file properties 
 *
 * @param divId
 * @param viewerConfig
 * @param previewFileConfig
 */
function setPreviewFile(divId, viewerConfig, previewFileConfig) {
	/* set adobeDCView */
	var adobeDCView = new AdobeDC.View({
		clientId: CLIENT_ID,
		divId: divId
	});

	/* get logged in user info from session storage */
	const userInfo = getUserInfoFromSessionStorage();
	const profile = {
		userProfile: {
			name: userInfo.name,
			firstName: userInfo.firstName,
			lastName: userInfo.lastName,
			email: userInfo.email
		}
	}

	/* register user profile callback */
	adobeDCView.registerCallback(
		AdobeDC.View.Enum.CallbackType.GET_USER_PROFILE_API,
		function () {
			return new Promise((resolve, reject) => {
				resolve({
					code: AdobeDC.View.Enum.ApiResponseCode.SUCCESS,
					data: profile
				})
			})
		});

	/* set file preview */
	var previewFilePromise = adobeDCView.previewFile({
		content: {
			location: {
				url: previewFileConfig.url
			}
		},
		metaData: {
			fileName: previewFileConfig.fileName,
			id: previewFileConfig.id
		}
	}, viewerConfig);

	/* set pdf meta data in session storage */
	setPdfMetaDataInSession(previewFilePromise);
 
	/* to handle events on PDF */
	handleEventsOnPDF(adobeDCView);
}

/** 
 * To login a user
 */
function loginUser() {
	var email = $("#login-email").val();
	var password = $("#login-password").val();

	/* request body for POST request */
	var loginRequestModel = {
		"email": email,
		"password": password
	}

	/* call to login api */
	$.ajax({
		type: "POST",
		contentType: "application/json",
		url: "/login",
		data: JSON.stringify(loginRequestModel),
		dataType: 'json',
		cache: false,
		timeout: 600000,
		success: function (data) {
			sessionStorage.setItem("loggedInTime", new Date());
			sessionStorage.setItem('firstName', data.firstName);
			sessionStorage.setItem('lastName', data.lastName);
			sessionStorage.setItem('email', data.email);
			sessionStorage.setItem('role', data.role);
			$('#login-form').trigger("reset");
			$('.without-session').hide();
			$('.username-placeholder').text('Hello, ' + sessionStorage.getItem('firstName'));
			$('.with-session').show();
			$('#courses-container').show();
			var toastHTML = '<span>' + data.success + '</span>';
			M.toast({
				html: toastHTML,
				classes: 'teal lighten-1'
			});
		},
		error: function (textStatus, errorThrown) {
			var toastHTML = '<span>' + textStatus.responseJSON.error +
				'</span>';
			M.toast({
				html: toastHTML,
				classes: 'red lighten-1'
			});
		}
	});
}

/** 
 * To register a user
 */
function registerUser() {
	var firstName = $("#first_name").val();
	var lastName = $("#last_name").val();
	var email = $("#email").val();
	var password = $("#password").val();
	var recoveryKey = $("#recovery").val();
	var role = $("input[name='role-radio']:checked").val();

	/* request body for POST request */
	var registerRequestModel = {
		"firstName": firstName,
		"lastName": lastName,
		"email": email,
		"password": password,
		"recoveryKey": recoveryKey,
		"role": role
	}

	/* call to registered api */
	$.ajax({
		type: "POST",
		contentType: "application/json",
		url: "/register",
		data: JSON.stringify(registerRequestModel),
		dataType: 'json',
		cache: false,
		timeout: 600000,
		success: function (data) {
			$('#login-form').trigger("reset");
			$('#login-form-container').show().siblings().hide();
			var toastHTML = '<span>' + data.success + '</span>';
			M.toast({
				html: toastHTML,
				classes: 'teal lighten-1'
			});
		},
		error: function (textStatus, errorThrown) {
			var toastHTML = '<span>' + textStatus.responseJSON.error +
				'</span>';
			M.toast({
				html: toastHTML,
				classes: 'red lighten-1'
			});
		}
	});
}

/** 
 * To download pdf
 */
function downloadPdf() {
	var userInfo = getUserInfoFromSessionStorage();
	/* request body for POST request */
	var pdfRequestModel = {
		"user": userInfo.firstName,
		"encodedImage": "data:image/png;base64,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AABASFgFAAAAAAgJqwAAAAAAIWEVAAAAACAkrAIAAAAAhIRVAAAAAICQsAoAAAAAEBJWAQAAAABCwioAAAAAQEhYBQAAAAAICasAAAAAACFhFQAAAAAgJKwCAAAAAISEVQAAAACAkLAKAAAAABASVgEAAAAAQsIqAAAAAEBIWAUAAAAACAmrAAAAAAAhYRUAAAAAICSsAgAAAACEhFUAAAAAgJCwCgAAAAAQElYBAAAAAELCKgAAAABASFgFAAAAAAgJqwAAAAAAIWEVAAAAACAkrAIAAAAAhIRVAAAAAICQsAoAAAAAEBJWAQAAAABCwioAAAAAQEhYBQAAAAAICasAAAAAACFhFQAAAAAgJKwCAAAAAISEVQAAAACAkLAKAAAAABASVgEAAAAAQsIqAAAAAEBIWAUAAAAACAmrAAAAAAAhYRUAAAAAICSsAgAAAACEhFUAAAAAgJCwCgAAAAAQElYBAAAAAELCKgAAAABASFgFAAAAAAgJqwAAAAAAIWEVAAAAACAkrAIAAAAAhIRVAAAAAICQsAoAAAAAEBJWAQAAAABCwioAAAAAQEhYBQAAAAAICasAAAAAACFhFQAAAAAgJKwCAAAAAISEVQAAAACAkLAKAAAAABASVgEAAAAAQsIqAAAAAEBIWAUAAAAACAmrAAAAAAAhYRUAAAAAICSsAgAAAACEhFUAAAAAgJCwCgAAAAAQElYBAAAAAELCKgAAAABASFgFAAAAAAgJqwAAAAAAIWEVAAAAACAkrAIAAAAAhIRVAAAAAICQsAoAAAAAEBJWAQAAAABCwioAAAAAQEhYBQAAAAAICasAAAAAACFhFQAAAAAgJKwCAAAAAISEVQAAAACAkLAKAAAAABASVgEAAAAAQsIqAAAAAEBIWAUAAAAACAmrAAAAAAAhYRUAAAAAICSsAgAAAACEhFUAAAAAgJCwCgAAAAAQElYBAAAAAELCKgAAAABASFgFAAAAAAgJqwAAAAAAIWEVAAAAACAkrAIAAAAAhIRVAAAAAICQsAoAAAAAEBJWAQAAAABCwioAAAAAQEhYBQAAAAAICasAAAAAACFhFQAAAAAgJKwCAAAAAISEVQAAAACAkLAKAAAAABASVgEAAAAAQsIqAAAAAEBIWAUAAAAACAmrAAAAAAAhYRUAAAAAICSsAgAAAACEhFUAAAAAgJCwCgAAAAAQElYBAAAAAELCKgAAAABASFgFAAAAAAgJqwAAAAAAIWEVAAAAACAkrAIAAAAAhIRVAAAAAICQsAoAAAAAEBJWAQAAAABCwioAAAAAQEhYBQAAAAAICasAAAAAACFhFQAAAAAgJKwCAAAAAISEVQAAAACAkLAKAAAAABASVgEAAAAAQsIqAAAAAEBIWAUAAAAACAmrAAAAAAAhYRUAAAAAICSsAgAAAACEhFUAAAAAgJCwCgAAAAAQElYBAAAAAELCKgAAAABASFgFAAAAAAgJqwAAAAAAIWEVAAAAACAkrAIAAAAAhIRVAAAAAICQsAoAAAAAEBJWAQAAAABCwioAAAAAQEhYBQAAAAAICasAAAAAACFhFQAAAAAgJKwCAAAAAISEVQAAAACAkLAKAAAAABASVgEAAAAAQsIqAAAAAEBIWAUAAAAACAmrAAAAAAAhYRUAAAAAICSsAgAAAACEhFUAAAAAgJCwCgAAAAAQElYBAAAAAELCKgAAAABASFgFAAAAAAgJqwAAAAAAIWEVAAAAACAkrAIAAAAAhIRVAAAAAICQsAoAAAAAEBJWAQAAAABCwioAAAAAQEhYBQAAAAAICasAAAAAACFhFQAAAAAgJKwCAAAAAISEVQAAAACAkLAKAAAAABASVgEAAAAAQsIqAAAAAEBIWAUAAAAACAmrAAAAAAAhYRUAAAAAICSsAgAAAACEhFUAAAAAgJCwCgAAAAAQElYBAAAAAELCKgAAAABASFgFAAAAAAgJqwAAAAAAIWEVAAAAACAkrAIAAAAAhIRVAAAAAICQsAoAAAAAEBJWAQAAAABCwioAAAAAQEhYBQAAAAAICasAAAAAACFhFQAAAAAgJKwCAAAAAISEVQAAAACAkLAKAAAAABASVgEAAAAAQsIqAAAAAEBIWAUAAAAACAmrAAAAAAAhYRUAAAAAICSsAgAAAACEhFUAAAAAgJCwCgAAAAAQElYBAAAAAELCKgAAAABASFgFAAAAAAgJqwAAAAAAIWEVAAAAACAkrAIAAAAAhIRVAAAAAICQsAoAAAAAEBJWAQAAAABCwioAAAAAQEhYBQAAAAAICasAAAAAACFhFQAAAAAgJKwCAAAAAISEVQAAAACAkLAKAAAAABASVgEAAAAAQsIqAAAAAEBIWAUAAAAACAmrAAAAAAAhYRUAAAAAICSsAgAAAACEhFUAAAAAgJCwCgAAAAAQElYBAAAAAELCKgAAAABASFgFAAAAAAgJqwAAAAAAIWEVAAAAACAkrAIAAAAAhIRVAAAAAICQsAoAAAAAEBJWAQAAAABCwioAAAAAQEhYBQAAAAAICasAAAAAACFhFQAAAAAgJKwCAAAAAISEVQAAAACAkLAKAAAAABASVgEAAAAAQsIqAAAAAEBIWAUAAAAACAmrAAAAAAAhYRUAAAAAICSsAgAAAACEhFUAAAAAgJCwCgAAAAAQElYBAAAAAELCKgAAAABASFgFAAAAAAgJqwAAAAAAIWEVAAAAACAkrAIAAAAAhIRVAAAAAICQsAoAAAAAEBJWAQAAAABCwioAAAAAQEhYBQAAAAAICasAAAAAACFhFQAAAAAgJKwCAAAAAISEVQAAAACAkLAKAAAAABASVgEAAAAAQsIqAAAAAEBIWAUAAAAACAmrAAAAAAAhYRUAAAAAICSsAgAAAACEhFUAAAAAgJCwCgAAAAAQElYBAAAAAELCKgAAAABASFgFAAAAAAgJqwAAAAAAIWEVAAAAACAkrAIAAAAAhIRVAAAAAICQsAoAAAAAEBJWAQAAAABCwioAAAAAQEhYBQAAAAAICasAAAAAACFhFQAAAAAgJKwCAAAAAISEVQAAAACAkLAKAAAAABASVgEAAAAAQsIqAAAAAEBIWAUAAAAACAmrAAAAAAAhYRUAAAAAICSsAgAAAACEhFUAAAAAgJCwCgAAAAAQElYBAAAAAELCKgAAAABASFgFAAAAAAgJqwAAAAAAIWEVAAAAACAkrAIAAAAAhIRVAAAAAICQsAoAAAAAEBJWAQAAAABCwioAAAAAQEhYBQAAAAAICasAAAAAACFhFQAAAAAgJKwCAAAAAISEVQAAAACAkLAKAAAAABASVgEAAAAAQsIqAAAAAEBIWAUAAAAACAmrAAAAAAAhYRUAAAAAICSsAgAAAACEhFUAAAAAgJCwCgAAAAAQElYBAAAAAELCKgAAAABASFgFAAAAAAgJqwAAAAAAIWEVAAAAACAkrAIAAAAAhIRVAAAAAICQsAoAAAAAEBJWAQAAAABCwioAAAAAQEhYBQAAAAAICasAAAAAACFhFQAAAAAgJKwCAAAAAISEVQAAAACAkLAKAAAAABASVgEAAAAAQsIqAAAAAEBIWAUAAAAACAmrAAAAAAAhYRUAAAAAICSsAgAAAACEhFUAAAAAgJCwCgAAAAAQElYBAAAAAELCKgAAAABASFgFAAAAAAgJqwAAAAAAIWEVAAAAACAkrAIAAAAAhIRVAAAAAICQsAoAAAAAEBJWAQAAAABCwioAAAAAQEhYBQAAAAAICasAAAAAACFhFQAAAAAgJKwCAAAAAISEVQAAAACAkLAKAAAAABASVgEAAAAAQsIqAAAAAEBIWAUAAAAACAmrAAAAAAAhYRUAAAAAICSsAgAAAACEhFUAAAAAgJCwCgAAAAAQElYBAAAAAEL/A29GZEAfwHMFAAAAAElFTkSuQmCC"
	}

	/* call to generate pdf api */
	$.ajax({
		type: "POST",
		contentType: "application/json",
		url: "/generatePdf",
		data: JSON.stringify(pdfRequestModel),
		cache: false,
		timeout: 600000,
		success: function (data) {
			const linkSource = 'data:application/pdf;base64,' + data.encodedFile;
		    const downloadLink = document.createElement("a");
		    downloadLink.download = "notes.pdf";
		    downloadLink.target = "_blank";
		    downloadLink.href = linkSource;	
		    document.body.appendChild(downloadLink);
		    
		    setTimeout(function() {
		    	downloadLink.click();
		    	document.body.removeChild(downloadLink);
		    }, 500);		    
		    
		    var toastHTML = '<span>' + data.success + '</span>';
			M.toast({
				html: toastHTML,
				classes: 'teal lighten-1'
			});
		},
		error: function (textStatus, errorThrown) {			
			var toastHTML = '<span>Some error occured. Please try again.</span>';
			M.toast({
				html: toastHTML,
				classes: 'red lighten-1'
			});
		}
	});
}

/** 
 * To listen to file events, perform required actions and send it to google analytics 
 *
 * @param adobeDCView
 */
function handleEventsOnPDF(adobeDCView) {
	const userInfo = getUserInfoFromSessionStorage();
	var totalPages = 0;
	var fileName = '';
	adobeDCView.registerCallback(AdobeDC.View.Enum.CallbackType.EVENT_LISTENER, (e) => {
		switch (e.type) {
			case 'DOCUMENT_OPEN':
				fileName = e.data.fileName;
				if(isStudent(userInfo)) {
					gtag('event', userInfo.firstName + ' has opened ' + fileName, {
						'event_category': 'DOCUMENT_OPEN',
						'event_label': 'DOCUMENT_OPEN'
					});
				}
				break;
			case 'PAGE_VIEW':	
				totalPages = sessionStorage.getItem("totalPages");
				if(e.data.pageNumber == totalPages && isStudent(userInfo)) {									
					gtag('event', userInfo.firstName + ' has scrolled through all the pages of ' + fileName, {
						'event_category': 'SCROLLED_THROUGH',
						'event_label': 'SCROLLED_THROUGH'
					});					
				}				
				break;
			case 'DOCUMENT_DOWNLOAD':
				if(isStudent(userInfo)) {
					gtag('event', userInfo.firstName + ' has downloaded ' + fileName, {
						'event_category': 'DOCUMENT_DOWNLOAD',
						'event_label': 'DOCUMENT_DOWNLOAD'
					});
				}
				break;
			case 'DOCUMENT_PRINT':
				gtag('event', userInfo.firstName + ' has downloaded ' + fileName, {
					'event_category': 'DOCUMENT_PRINT',
					'event_label': 'DOCUMENT_PRINT'
				});
				break;
			case 'PAGES_IN_VIEW_CHANGE':
				var pageEnteredTime = new Date();
				var startPage = e.data.startPage.pageNumber;
				if(startPage != e.data.endPage.pageNumber && isStudent(userInfo)) {	
					var pageChangeTime = new Date() - pageEnteredTime;
					gtag('event', userInfo.firstName + ' has read all the content of page ' + startPage + ' of ' + fileName, {
						'event_category': 'READ_PAGE_CONTENT',
						'event_label': 'READ_PAGE_CONTENT'
					});		
					
					gtag('event', userInfo.firstName + ' has spent ' + pageChangeTime + ' milliseconds on page ' + startPage, {
						'event_category': 'PAGE_TIME',
						'event_label': 'PAGE_TIME'
					});
				} 
				break;
			case 'CURRENT_ACTIVE_PAGE':	
				totalPages = sessionStorage.getItem("totalPages");
				if(e.data.pageNumber == totalPages && isStudent(userInfo)) {									
					gtag('event', userInfo.firstName + ' has scrolled through all the pages of ' + fileName, {
						'event_category': 'SCROLLED_THROUGH',
						'event_label': 'SCROLLED_THROUGH'
					});					
				}				
				break;
			case 'ANNOTATION_ADDED':
				const comment = e.data.bodyValue;
				const motivation = e.data.motivation;				
				
				/* check if assignment completed */
				if (assignmentCompleted(userInfo, comment, motivation)) {
					gtag('event', userInfo.firstName + ' has completed the assignment on ' + fileName, {
						'event_category': 'ASSIGNMENT_COMPLETED',
						'event_label': 'ASSIGNMENT_COMPLETED'
					});
				}
                
				/* check if student has commented */
				if(isStudent(userInfo) && motivation === 'commenting') {
					gtag('event', userInfo.firstName + ' has commented on ' + fileName, {
						'event_category': 'COMMENT_ADDED',
						'event_label': 'COMMENT_ADDED'
					});
				}
				
				/* check if student has replied to comment */
				if(isStudent(userInfo) && motivation === 'replying') {
					gtag('event', userInfo.firstName + ' has replied on ' + fileName, {
						'event_category': 'REPLIED_TO_COMMENT',
						'event_label': 'REPLIED_TO_COMMENT'
					});
				}
				break;
		}
	}, {
		enableAnnotationEvents: true,
		enableFilePreviewEvents:true,
		enablePDFAnalytics: true
	});
}

/** 
 * To reset password
 */
function forgotPassword() {
	var email = $("#recovery-email").val();
	var password = $("#recovery-password").val();
	var key = $("#recovery-key").val();

	/* request body for POST request */
	var changePasswordRequestModel = {
		"email": email,
		"password": password,
		"key": key
	}

	/* call to change password api */
	$.ajax({
		type: "POST",
		contentType: "application/json",
		url: "/changePassword",
		data: JSON.stringify(changePasswordRequestModel),
		dataType: 'json',
		cache: false,
		timeout: 600000,
		success: function (data) {
			$('#login-form').trigger("reset");
			$('#login-form-container').show().siblings().hide();
			var toastHTML = '<span>' + data.success + '</span>';
			M.toast({
				html: toastHTML,
				classes: 'teal lighten-1'
			});
		},
		error: function (textStatus, errorThrown) {
			var toastHTML = '<span>' + textStatus.responseJSON.error +
				'</span>';
			M.toast({
				html: toastHTML,
				classes: 'red lighten-1'
			});
		}
	});
}

/**
 * To check if user is a student
 * 
 * @param userInfo
 * @returns true if Student
 */
function isStudent(userInfo) {
	return userInfo.role == 'Student';
}

/** 
 * To check assignment is completed
 * 
 * @param userInfo
 * @param comment
 * @param motivation
 */
function assignmentCompleted(userInfo, comment, motivation) {
	return (isStudent(userInfo) && comment !== null && comment.toLowerCase() == 'completed' && motivation !== null && motivation === 'commenting')
}

/**
 * To set pdf meta data in session storage
 * 
 * @param previewFilePromise
 * @returns previewFilePromise
 */
function setPdfMetaDataInSession(previewFilePromise) {
	return previewFilePromise.then(function (adobeViewer) {
		adobeViewer.getAPIs().then(function (apis) {
			apis.getPDFMetadata()
				.then(result => sessionStorage.setItem("totalPages", result.numPages))
				.catch(error => console.log(error));
		});
	});
}

/**
 * To get user info from session storage
 * 
 * @returns userInfo
 */
function getUserInfoFromSessionStorage() {
	const firstName = sessionStorage.getItem('firstName');
	const lastName = sessionStorage.getItem('lastName');
	const email = sessionStorage.getItem('email');
	const role = sessionStorage.getItem('role');

	const userInfo = {
		name: firstName + ' ' + lastName,
		firstName: firstName,
		lastName: lastName,
		email: email,
		role: role
	}

	return userInfo;
}