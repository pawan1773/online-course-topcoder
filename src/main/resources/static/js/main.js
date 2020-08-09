/* wait for document to get ready */
$(document).ready(function () {	
	
	const userInfo = getUserInfoFromSessionStorage();

	/* to bypass login if user is already logged in */
	if (userInfo.firstName != null) {
		$('.without-session').hide();
		$('.username-placeholder').text(
			'Hello, ' + sessionStorage.getItem('firstName'));
		$('.with-session').show();
		$('#courses-container').show();

		if (userInfo.role === 'Student') {
			$('.upload-li').hide();
		}
	}

	/* activate materialize side nav in mobile view */
	$('.sidenav').sidenav();

	/* activate materialize select */
	$('select').formSelect();
	$(document).click(function () {
		$('li[id^="select-options"]').on('touchend', function (e) {
			e.stopPropagation();
		})
	});

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

		/* send student session time to gtag */
		if (isStudent(userInfo)) {
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
		$('form').trigger("reset");
		$('#registration-form-container').show().siblings().hide();
	});

	/* to display login form */
	$('.login-link').click(function () {
		$('form').trigger("reset");
		$('#login-form-container').show().siblings().hide();
	});

	$('.uploadpdf-link').click(function () {
		$('form').trigger("reset");
		$('#upload-pdf-form-container').show().siblings().hide();
	});

	/* to display courses container */
	$('.back-courses').click(function () {
		$('#courses-container').show().siblings().hide();
	});

	/* to display password recovery form */
	$('.forgot-password-link').click(function () {
		$('form').trigger("reset");
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

	/* to upload pdf */
	$('#upload-form').submit(function (event) {
		event.preventDefault();
		uploadPDF();
	});

	/* to download pdf */
	$('#download-pdf').click(function () {
		downloadPdf();
	});

	/* to view list of courses */
	$(document).on('click', '.view-courses', function () {
		var courseCategory = $(this).data('course-category');
		/* call to get files list api */
		$.ajax({
			type: "GET",
			url: "/getFiles/" + courseCategory,
			dataType: 'json',
			cache: false,
			timeout: 60000,
			success: function (data) {
				var pdfListHtml = '';
				if (data.length > 0) {
					for (var i = 0; i < data.length; i++) {
						if (i === 0) {
							pdfListHtml = pdfListHtml + '<li class="collection-item"><a href="#" class="view-pdf teal-text" data-file-id="' + data[i].id + '">' + data[i].fileLinkName + '</a></li>';
						} else {
							pdfListHtml = pdfListHtml + '<li class="collection-item"><a href="#" class="view-pdf teal-text" data-file-id="' + data[i].id + '">' + data[i].fileLinkName + '</a></li>';
						}
					}
				} else {
					pdfListHtml = pdfListHtml + '<li class="collection-item"><a href="#" class="teal-text">No files available.</a></li>';
				}

				$('#course-title').text(courseCategory);
				$('#pdf-list li:not(:first-child)').remove()
				$('#pdf-list li:last').after(pdfListHtml);
				$('#pdf-container').show().siblings().hide();
				$('#pdf-render-container').hide();

				console.log("Courses:" + JSON.stringify(data));
			},
			error: function (textStatus, errorThrown) {
				var toastHTML = '<span>Something went wrong.</span>';
				M.toast({
					html: toastHTML,
					classes: 'red lighten-1'
				});
				console.error(JSON.stringify(errorThrown));
			}
		});
	});

	/* to show pdf */
	$(document).on('click', '.view-pdf', function () {
		var clicker = $(this);
		var fileId = clicker.data('file-id');
		var previewFileConfig = '';
		var divId = 'adobe-dc-full-window';
		var embedMode = 'FULL_WINDOW';
		/* call to get files list api */
		$.ajax({
			type: "GET",
			url: "/getFileById/" + fileId,
			dataType: 'json',
			cache: true,
			timeout: 600000,
			success: function (data) {
				previewFileConfig = data;
				if (clicker.hasClass('emb-btn')) {
					$('.emb-btn').removeClass('disabled');
					clicker.addClass('disabled');
					embedMode = clicker.data("embed-mode");
				} else {
					clicker.addClass('white-text')
					clicker.parent().addClass('active').siblings().removeClass('active').children().removeClass('white-text').addClass('teal-text');
					$('.emb-btn').data('file-id', previewFileConfig.id);
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

				$('#pdf-render-container').show();
				/* setup viewer configurations */
				const viewerConfig = {
					"defaultViewMode": "FIT_WIDTH",
					"embedMode": embedMode,
					"enableAnnotationAPIs": true,
					"showLeftHandPanel": false,
					"includePDFAnnotations:": true
				};

				/* to set preview properties */
				setPreviewFile(divId, viewerConfig, previewFileConfig);

				clicker = '';
			},
			error: function (textStatus, errorThrown) {
				clicker = '';
				var toastHTML = '<span>Something went wrong.</span>';
				M.toast({
					html: toastHTML,
					classes: 'red lighten-1'
				});
				console.error(JSON.stringify(errorThrown));
			}
		});
	});
});

/**
 * Registers a User
 * 
 */
function registerUser() {
	/* set post data */
	var registerRequestModel = {
		"firstName": $('#first_name').val(),
		"lastName": $('#last_name').val(),
		"email": $('#email').val(),
		"password": $('#password').val(),
		"recoveryKey": $('#recovery').val(),
		"role": $('input[name="role-radio"]:checked').val()
	}

	/* call to register user api */
	$.ajax({
		type: "POST",
		contentType: "application/json",
		url: "/register",
		data: JSON.stringify(registerRequestModel),
		dataType: 'json',
		cache: false,
		timeout: 60000,
		success: function (data) {
			$('form').trigger("reset");
			$('#login-form-container').show().siblings().hide();
			var toastHTML = '<span>' + data.success + '</span>';

			M.toast({
				html: toastHTML,
				classes: 'teal lighten-1'
			});

			console.log(data.success);
		},
		error: function (textStatus, errorThrown) {
			var toastHTML = '<span>' + textStatus.responseJSON.error +
				'</span>';
			M.toast({
				html: toastHTML,
				classes: 'red lighten-1'
			});

			console.error(textStatus.responseJSON.error);
		}
	});
}

/**
 * Login a User
 * 
 */
function loginUser() {
	/* set post data */
	var loginRequestModel = {
		"email": $("#login-email").val(),
		"password": $("#login-password").val()
	}

	/* call to login api */
	$.ajax({
		type: "POST",
		contentType: "application/json",
		url: "/login",
		data: JSON.stringify(loginRequestModel),
		dataType: 'json',
		cache: false,
		timeout: 60000,
		success: function (data) {
			sessionStorage.setItem("loggedInTime", new Date());
			sessionStorage.setItem('firstName', data.firstName);
			sessionStorage.setItem('lastName', data.lastName);
			sessionStorage.setItem('email', data.email);
			sessionStorage.setItem('role', data.role);
			$('form').trigger("reset");
			$('.without-session').hide();
			$('.username-placeholder').text('Hello, ' + sessionStorage.getItem('firstName'));

			if (data.role == 'Student') {
				$('.with-session').not('.upload-li').show();
			} else {
				$('.with-session').show();
			}

			$('#courses-container').show();
			var toastHTML = '<span>' + data.success + '</span>';
			M.toast({
				html: toastHTML,
				classes: 'teal lighten-1'
			});

			console.log(data.success);
		},
		error: function (textStatus, errorThrown) {
			var toastHTML = '<span>' + textStatus.responseJSON.error +
				'</span>';
			M.toast({
				html: toastHTML,
				classes: 'red lighten-1'
			});

			console.error(textStatus.responseJSON.error);
		}
	});
}

/**
 * Reset Password
 * 
 */
function forgotPassword() {
	/* set post data */
	var changePasswordRequestModel = {
		"email": $("#recovery-email").val(),
		"password": $("#recovery-password").val(),
		"key": $("#recovery-key").val()
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
			$('form').trigger("reset");
			$('#login-form-container').show().siblings().hide();
			var toastHTML = '<span>' + data.success + '</span>';
			M.toast({
				html: toastHTML,
				classes: 'teal lighten-1'
			});

			console.log(data.success);
		},
		error: function (textStatus, errorThrown) {
			var toastHTML = '<span>' + textStatus.responseJSON.error +
				'</span>';
			M.toast({
				html: toastHTML,
				classes: 'red lighten-1'
			});

			console.error(textStatus.responseJSON.error);
		}
	});
}


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
		var reader = new FileReader();
		var binaryString = window.atob(previewFileConfig.content);
		var binaryLen = binaryString.length;
		var bytes = new Uint8Array(binaryLen);
		for (var i = 0; i < binaryLen; i++) {
			var ascii = binaryString.charCodeAt(i);
			bytes[i] = ascii;
		}
		var blob = new Blob([bytes], {
			type: 'application/pdf'
		});
		var previewFilePromise = '';
		reader.onloadend = function (e) {
			var filePromise = Promise.resolve(e.target.result);
			var previewFilePromise = adobeDCView.previewFile({
				content: {
					promise: filePromise
				},
				metaData: {
					fileName: previewFileConfig.fileName,
					id: previewFileConfig.id
				}
			}, viewerConfig);
	
			/* set pdf meta data in session storage */
			setPdfMetaDataInSession(previewFilePromise);
	
			/* to handle events on PDF */
			handleEventsOnPDF(adobeDCView, previewFilePromise, previewFileConfig.id);
			
			loadAnnotations(previewFilePromise, previewFileConfig.id);
		};
		reader.readAsArrayBuffer(blob);
}


/**
 * To upload pdf
 */
function uploadPDF() {
	var form = $('#upload-form')[0];
	var data = new FormData(form);

	/* call to upload api */
	$.ajax({
		type: "POST",
		enctype: 'multipart/form-data',
		url: "/uploadPdf",
		data: data,
		processData: false,
		contentType: false,
		cache: false,
		timeout: 600000,
		success: function (data) {
			$('#upload-form').trigger("reset");
			$('#courses-container').show().siblings().hide();
			var toastHTML = '<span>' + data.success + '</span>';
			M.toast({
				html: toastHTML,
				classes: 'teal lighten-1'
			});
		},
		error: function (textStatus, errorThrown) {
			$('#upload-form').trigger("reset");
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
	var canvas = document.getElementById('whiteboard-canvas');
	/* request body for POST request */
	var pdfRequestModel = {
		"user": userInfo.firstName,
		"encodedImage": canvas.toDataURL()
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

			setTimeout(function () {
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
 * To listen to file events, perform required actions and send it to google
 * analytics
 * 
 * @param adobeDCView
 */
function handleEventsOnPDF(adobeDCView, previewFilePromise, fileId) {
	const userInfo = getUserInfoFromSessionStorage();
	var totalPages = 0;
	var fileName = '';
	adobeDCView.registerCallback(AdobeDC.View.Enum.CallbackType.EVENT_LISTENER, (e) => {
		switch (e.type) {
			case 'DOCUMENT_OPEN':
				fileName = e.data.fileName;
				if (isStudent(userInfo)) {
					gtag('event', userInfo.firstName + ' has opened ' + fileName, {
						'event_category': 'DOCUMENT_OPEN',
						'event_label': 'DOCUMENT_OPEN'
					});
				}
				break;
			case 'PAGE_VIEW':
				totalPages = sessionStorage.getItem("totalPages");
				if (e.data.pageNumber == totalPages && isStudent(userInfo)) {
					gtag('event', userInfo.firstName + ' has scrolled through all the pages of ' + fileName, {
						'event_category': 'SCROLLED_THROUGH',
						'event_label': 'SCROLLED_THROUGH'
					});
				}
				break;
			case 'DOCUMENT_DOWNLOAD':
				if (isStudent(userInfo)) {
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
				if (startPage != e.data.endPage.pageNumber && isStudent(userInfo)) {
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
				if (e.data.pageNumber == totalPages && isStudent(userInfo)) {
					gtag('event', userInfo.firstName + ' has scrolled through all the pages of ' + fileName, {
						'event_category': 'SCROLLED_THROUGH',
						'event_label': 'SCROLLED_THROUGH'
					});
				}
				break;
			case 'ANNOTATION_ADDED':				
				saveAnnotation(fileId, e.data);				
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
				if (isStudent(userInfo) && motivation === 'commenting') {
					gtag('event', userInfo.firstName + ' has commented on ' + fileName, {
						'event_category': 'COMMENT_ADDED',
						'event_label': 'COMMENT_ADDED'
					});
				}

				/* check if student has replied to comment */
				if (isStudent(userInfo) && motivation === 'replying') {
					gtag('event', userInfo.firstName + ' has replied on ' + fileName, {
						'event_category': 'REPLIED_TO_COMMENT',
						'event_label': 'REPLIED_TO_COMMENT'
					});
				}
				break;
			case 'ANNOTATION_DELETED':
				deleteAnnotation(e.data.id);
				if (isStudent(userInfo)) {
					gtag('event', userInfo.firstName + ' has deleted comment from assignment ' + fileName, {
						'event_category': 'COMMENT_DELETED',
						'event_label': 'COMMENT_DELETED'
					});
				}
				break;
			case 'ANNOTATION_UPDATED':
				updateAnnotation(e.data);
				if (isStudent(userInfo)) {
					gtag('event', userInfo.firstName + ' has updated comment on ' + fileName, {
						'event_category': 'COMMENT_UPDATED',
						'event_label': 'COMMENT_UPDATED'
					});
				}
				break;
		}
	}, {
		enableAnnotationEvents: true,
		enableFilePreviewEvents: true,
		enablePDFAnalytics: true
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