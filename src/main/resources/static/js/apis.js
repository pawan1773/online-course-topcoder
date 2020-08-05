function addComment(previewFilePromise, sourceId) {
	previewFilePromise.then(function (adobeViewer) {
        adobeViewer.getAnnotationManager().then(function (annotationManager) {
        	getAnnotations
            /* API to add annotations */
            annotationManager.addAnnotations([])
                .then(function () {             
                    console.log("Annotations added through API successfully")
                })
                .catch(function (error) {
                    console.log(error)
                });          
	         });
         });
	}

