package com.topcoder.course.online.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.topcoder.course.online.model.request.GeneratePdfRequestModel;
import com.topcoder.course.online.service.GeneratePdfService;

/**
 * <p>
 * To handle HTTP requests for pdf generation.
 * </p>
 * 
 * @author joginder.pawan@gmail.com
 */
@RestController
public class GeneratePdfController {

	@Autowired
	private GeneratePdfService generatePdfServiceImpl;

	/**
	 * <p>
	 * To generate.
	 * </p>
	 * 
	 * @param model
	 * @return instance of {@linkplain ResponseEntity} of type {@linkplain Map}
	 */
	@PostMapping(value = "/generatePdf", consumes = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Map<String, Object>> loginUser(@RequestBody final GeneratePdfRequestModel model) {
		final Map<String, Object> body = this.generatePdfServiceImpl.generatePdf(model);

		return body.containsKey("error") ? ResponseEntity.badRequest().body(body) : ResponseEntity.ok(body);
	}
}
