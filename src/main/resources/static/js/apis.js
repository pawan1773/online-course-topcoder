/**
 * To save annotation to database
 * 
 * @param fileId
 * @param annotation
 */
function saveAnnotation(fileId, annotation) {
	var keyValue = {
		"fileId": fileId,
		"annotationId": annotation.id,
		"createDate": annotation.created,
		"annotation": annotation
	}

	$.ajax({
		type: "POST",
		contentType: "application/json",
		url: "/saveAnnotation",
		data: JSON.stringify(keyValue),
		cache: false,
		timeout: 600000,
		success: function (data) {
			console.log('annotation saved in database')
		},
		error: function (textStatus, errorThrown) {
			console.error('error while saving annotation');
		}
	});
}

/**
 * To delete annotation from database.
 * 
 * @param annotationId
 */
function deleteAnnotation(annotationId) {
	$.ajax({
		type: "DELETE",
		contentType: "application/json",
		url: "/deleteAnnotation/" + annotationId,
		cache: false,
		timeout: 600000,
		success: function (data) {
			console.log('annotation deleted from database')
		},
		error: function (textStatus, errorThrown) {
			console.error('error while deleting annotation');
		}
	});
}

function loadAnnotations(previewFilePromise, fileId) {
	previewFilePromise.then(function (adobeViewer) {
		adobeViewer.getAnnotationManager().then(function (annotationManager) {
			getAnnotations(annotationManager, fileId);
			annotationManager.getAnnotations()
            .then(function (result) {
                console.log("GET all annotations", result)
            })
            .catch(function (error) {
                console.log(error)
            });
			    const customFlags = {
	                downloadWithAnnotations: true,
	                printWithAnnotations: true,
	            };
	            annotationManager.setConfig(customFlags)
	                .then(function () {
	                    console.log("custom flags applied")
	                })
	                .catch(function (error) {
	                    console.log(error)
	                });
		});
	});
}

/**
 * To get annotations for a file.
 * 
 * @param annotationManager
 * @param fileId
 */
function getAnnotations(annotationManager, fileId) {
	$.ajax({
		type: "GET",
		url: "/annotationsByFileId/" + fileId,
		dataType: 'json',
		cache: false,
		timeout: 600000,
		success: function (data) {
			if (data.length > 0) {
				var annotations = [];
				for (i = 0; i < data.length; i++) {
					annotations[i] = data[i];
				}
				console.log(JSON.stringify(annotations));
				annotationManager.addAnnotations(annotations)
					.then(function () {
						console.log('annotations added through API successfully');
					})
					.catch(function (error) {
						console.log(error)
					});
			}

		},
		error: function (textStatus, errorThrown) {
			console.error('error while getting annotations');
		}
	});
}

/**
 * To update annotation.
 * 
 * @param annotation
 */
function updateAnnotation(annotation) {
	var keyValue = {
		"annotationId": annotation.id,
		"annotation": annotation
	}

	$.ajax({
		type: "PUT",
		contentType: "application/json",
		url: "/updateAnnotation",
		data: JSON.stringify(keyValue),
		cache: false,
		timeout: 600000,
		success: function (data) {
			console.log('annotation updated')
		},
		error: function (textStatus, errorThrown) {
			console.error('error while updating annotation');
		}
	});
}