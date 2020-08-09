function saveAnnotation(fileId, annotation) {
	var keyValue = {
		"fileId" : fileId,
		"source" : annotation.target.source,
		"annotation" : annotation
	}

	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : "/saveAnnotation",
		data : JSON.stringify(keyValue),
		cache : false,
		timeout : 600000,
		success : function(data) {
			console.log("Annotation saved.")
		},
		error : function(textStatus, errorThrown) {
			console.error(JSON.stringify(textStatus));
		}
	});
}

function loadAnnotations(previewFilePromise, fileId) {
	previewFilePromise.then(function (adobeViewer) {
        adobeViewer.getAnnotationManager().then(function (annotationManager) { 
        	  addAnnotations(annotationManager, fileId);        	
        	});
	});    	
}

/*
 * function callAnnotationApis(previewFilePromise, previewFileConfig) { called
 * from main }
 */





function addAnnotations(annotationManager, fileId) {	
	$.ajax({
		type : "GET",
		url : "/annotationsByFileId/" + fileId,
		dataType : 'json',
		cache : false,
		timeout : 600000,
		success : function(data) {	
			if(data.length > 0) {
				var annotations = [];
				for(i = 0; i < data.length; i++) {
					annotations[i] = data[i];
				}
				console.log(JSON.stringify(annotations));
				annotationManager.addAnnotations(annotations)
	            .then(function () {				
	            	console.log("Annotations added through API successfully");
	            })
	            .catch(function (error) {
	                console.log(error)
	            });


	        annotationManager.getAnnotations()
	            .then(function (result) {
	                console.log("GET all annotations", result)
	            })
	            .catch(function (error) {
	                console.log(error)
	            });
			}
			
		},
		error : function(textStatus, errorThrown) {
			console.error(JSON.stringify(textStatus));
		}
	});   
}
