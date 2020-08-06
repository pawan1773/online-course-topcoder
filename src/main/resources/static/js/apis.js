function addAnnotations(previewFilePromise, sourceId) {
	previewFilePromise.then(function (adobeViewer) {
        adobeViewer.getAnnotationManager().then(function (annotationManager) {
        	// get annotations from backend
            /* API to add annotations */
            annotationManager.addAnnotations([])
                .then(function () {             
                    console.log("Annotations added.")
                })
                .catch(function (error) {
                    console.log(error)
                });          
	         });
         });
	}

