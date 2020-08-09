package com.topcoder.course.online.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.topcoder.course.online.entity.CourseFile;
import com.topcoder.course.online.model.request.GeneratePdfRequestModel;
import com.topcoder.course.online.service.PdfService;

/**
 * <p>
 * To handle HTTP requests for pdf generation.
 * </p>
 * 
 * @author joginder.pawan@gmail.com
 */
@RestController
public class PdfController {

	@Autowired
	private PdfService pdfServiceImpl;

	/**
	 * <p>
	 * To generate pdf.
	 * </p>
	 * 
	 * @param model
	 * @return instance of {@linkplain ResponseEntity} of type {@linkplain Map}
	 */
	@PostMapping(value = "/generatePdf", consumes = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<?> generatePdf(@RequestBody final GeneratePdfRequestModel model) {
		final Map<String, Object> body = this.pdfServiceImpl.generatePdf(model);

		return body.containsKey("error") ? ResponseEntity.badRequest().body(body) : ResponseEntity.ok(body);
	}

	/**
	 * <p>
	 * To upload file.
	 * </p>
	 * 
	 * @param fileLinkName
	 * @param courseCategory
	 * @param uploadfile
	 * @return instance of {@linkplain ResponseEntity} of type {@linkplain Map}
	 */
	@PostMapping(value = "/uploadPdf", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<?> uploadFile(@RequestParam("fileLinkName") String fileLinkName,
			@RequestParam("courseCategory") String courseCategory, @RequestParam("file") MultipartFile uploadfile) {
		final Map<String, Object> body = this.pdfServiceImpl.uploadPdf(fileLinkName, courseCategory, uploadfile);

		return body.containsKey("error") ? ResponseEntity.badRequest().body(body) : ResponseEntity.ok(body);
	}

	/**
	 * <p>
	 * To get files by category.
	 * </p>
	 * 
	 * @param courseCategory
	 * @return instance of {@linkplain ResponseEntity} of type {@linkplain Map}
	 */
	@GetMapping(value = "/getFiles/{courseCategory}", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<List<CourseFile>> getFiles(@PathVariable("courseCategory") String courseCategory) {
		return ResponseEntity.ok(this.pdfServiceImpl.findByCourseCategory(courseCategory));
	}

	/**
	 * <p>
	 * To get file by id.
	 * </p>
	 * 
	 * @param fileId
	 * @return instance of {@linkplain ResponseEntity} of type {@linkplain Map}
	 */
	@GetMapping(value = "/getFileById/{fileId}", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<CourseFile> findByFileId(@PathVariable("fileId") String fileId) {
		return ResponseEntity.ok(this.pdfServiceImpl.findByFileId(fileId));
	}

	/**
	 * <p>
	 * To save annotation.
	 * </p>
	 * 
	 * @param model
	 * @return instance of {@linkplain ResponseEntity} of type {@linkplain Map}
	 */
	@PostMapping(value = "/saveAnnotation", consumes = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<?> saveAnnotation(@RequestBody final Map<String, Object> model) {
		this.pdfServiceImpl.saveAnnotation(model);
		return ResponseEntity.ok().build();
	}

	/**
	 * <p>
	 * To annotations by file by id.
	 * </p>
	 * 
	 * @param courseCategory
	 * @return instance of {@linkplain ResponseEntity} of type {@linkplain Map}
	 */
	@GetMapping(value = "/annotationsByFileId/{fileId}", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<?> getAnnotationsByFileId(@PathVariable("fileId") String fileId) {
		return ResponseEntity.ok(this.pdfServiceImpl.getAnnotationsByFileId(fileId));
	}

	/**
	 * <p>
	 * To annotations by file by id.
	 * </p>
	 * 
	 * @param courseCategory
	 * @return instance of {@linkplain ResponseEntity} of type {@linkplain Map}
	 */
	@DeleteMapping(value = "/deleteAnnotation/{annotationId}", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<?> deleteAnnotation(@PathVariable("annotationId") String annotationId) {
		this.pdfServiceImpl.deleteAnnotation(annotationId);
		return ResponseEntity.ok().build();
	}
}
