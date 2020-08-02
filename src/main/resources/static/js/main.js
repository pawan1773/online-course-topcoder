/* wait for document to get ready */
$(document).ready(function() {
	/* to prevent login if user is stored in session */
	if (sessionStorage.getItem('firstName')) {
		$('.without-session').hide();
		$('.username-placeholder').text(
				'Hello, ' + sessionStorage.getItem('firstName'));
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
		sessionStorage.clear();
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
	
	/* to show pdfs */
	$('.view-pdf').click(function() {		
		var courseCategory = $(this).data("course-category");		
		var pdfs = FILE_CONFIG.filter(function(obj) {
					return obj.courseCategory === courseCategory;
				});
		var pdfListHtml = '';
		var previewFileConfig = '';
		var divId = 'adobe-dc-full-window';
		var embedMode = 'FULL_WINDOW';
		/* if course button is clicked */
		if($(this).hasClass('list-pdf')) {
			$('#course-title-li').siblings().remove();
			for (var i = 0; i < pdfs.length; i++) {
				if (pdfs[i].courseCategory === courseCategory) {				
					if(i === 0) {
						previewFileConfig = pdfs[i];
						pdfListHtml = pdfListHtml + '<li class="collection-item active"><a href="#" class="view-pdf white-text" data-course-category="' + courseCategory + '" data-file-name="' + pdfs[i].fileName +'">' + pdfs[i].fileLinkName + '</a></li>';
					} else {
						pdfListHtml = pdfListHtml + '<li class="collection-item"><a href="#" class="view-pdf teal-text" data-course-category="' + courseCategory + '" data-file-name="' + pdfs[i].fileName +'">' + pdfs[i].fileLinkName + '</a></li>';
					}
				}
			}
			$('#course-title').text(courseCategory);
			$('#pdf-list li:last').after(pdfListHtml);
			$('.emb-btn').data("course-category", previewFileConfig.courseCategory);
			$('.emb-btn').data("file-name", previewFileConfig.fileName);
			$('#pdf-container').show().siblings().hide();		
			$('#btn-full').addClass('disabled').siblings().removeClass('disabled');
			$('#adobe-dc-full-window').show().siblings().hide();
		} else {			
			if ($(this).hasClass('emb-btn')) {				
				$('.emb-btn').removeClass('disabled');
				$(this).addClass('disabled');
			}
			
			var fileName = $(this).data("file-name");
			embedMode = $(this).data("embed-mode");
			
			if (embedMode === 'SIZED_CONTAINER') {
				divId = 'adobe-dc-sized-container';
				$('#adobe-dc-sized-container').show().siblings().hide();
			} else if (embedMode === 'FULL_WINDOW') {
				divId = 'adobe-dc-full-window';
				$('#adobe-dc-full-window').show().siblings().hide();
			} else {
				divId = 'adobe-dc-in-line';
				$('#adobe-dc-in-line').show().siblings().hide();
			}
			
			for (var i = 0; i < pdfs.length; i++) {
				if (pdfs[i].courseCategory === courseCategory && pdfs[i].fileName === fileName) {	
					previewFileConfig = pdfs[i];
				}
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
	var adobeDCView = new AdobeDC.View({
		clientId: CLIENT_ID,
		divId: divId
	});
	
	var firstName = sessionStorage.getItem('firstName');
	var lastName = sessionStorage.getItem('lastName');
	var email = sessionStorage.getItem('email');
	const profile = {
			userProfile: {
				name: firstName + ' ' + lastName,
				firstName: firstName,
				lastName: lastName,
				email: email
			}
		}
	
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
	
	postEventsToGoogleAnalytics(adobeDCView);
}

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
				sessionStorage.setItem('firstName', data.firstName);
				sessionStorage.setItem('lastName', data.lastName);
				sessionStorage.setItem('email', data.email);
				$('#login-form').trigger("reset");
				$('.without-session').hide();
				$('.username-placeholder').text('Hello, ' + sessionStorage.getItem('firstName'));
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

/** 
 * To listen to file events and send it to google analytics 
 *
 * @param adobeDCView
 */
function postEventsToGoogleAnalytics(adobeDCView) {
	adobeDCView.registerCallback(AdobeDC.View.Enum.CallbackType.EVENT_LISTENER, (e) => {
		switch (e.type) {
			case 'DOCUMENT_OPEN':
				gtag('event', e.data.fileName + ' opened.', {
					'event_category': 'DOCUMENT_OPEN',
					'event_label': 'DOCUMENT_OPEN'
				});
				break;
			case 'PAGE_VIEW':
				gtag('event', e.data.pageNumber + ' of ' + e.data.fileName + ' viewed.', {
					'event_category': 'PAGE_VIEW',
					'event_label': 'PAGE_VIEW'
				});
				break;
			case 'DOCUMENT_DOWNLOAD':
				gtag('event', e.data.fileName + ' downloaded.', {
					'event_category': 'DOCUMENT_DOWNLOAD',
					'event_label': 'DOCUMENT_DOWNLOAD'
				});
				break;
			case 'DOCUMENT_PRINT':
				gtag('event', e.data.fileName + ' printed.', {
					'event_category': 'DOCUMENT_PRINT',
					'event_label': 'DOCUMENT_PRINT'
				});
				break;
			case 'TEXT_COPY':
				gtag('event', e.data.copiedText + ' copied from ' + e.data.fileName, {
					'event_category': 'TEXT_COPY',
					'event_label': 'TEXT_COPY'
				});
				break;
			case 'TEXT_SEARCH':
				gtag('event', e.data.searchedText + ' copied from ' + e.data.fileName, {
					'event_category': 'TEXT_SEARCH',
					'event_label': 'TEXT_SEARCH'
				});
				break;
			case 'ANNOTATION_ADDED':
				gtag('event', 'ANNOTATION_ADDED', {
					'event_category': 'ANNOTATION_ADDED',
					'event_label': 'ANNOTATION_ADDED'
				});
				break;
		}
	}, {
		enableAnnotationEvents: true,
		enablePDFAnalytics: true
	});
}
