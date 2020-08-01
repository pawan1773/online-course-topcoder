package com.topcoder.course.online.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.topcoder.course.online.model.request.RegistrationRequestModel;
import com.topcoder.course.online.service.RegistrationService;

/**
 * <p>
 * To handle HTTP requests for user registration.
 * </p>
 * 
 * @author joginder.pawan@gmail.com
 */
@RestController
public class RegistrationController {

	@Autowired
	@Qualifier(value = "registrationServiceImpl")
	private RegistrationService registrationService;

	/**
	 * <p>
	 * To register a user.
	 * </p>
	 * 
	 * @param model
	 * @return instance of {@linkplain ResponseEntity}
	 */
	@PostMapping(value = "/register", consumes = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Map<String, Object>> registerUser(@RequestBody final RegistrationRequestModel model) {
		final Map<String, Object> body = this.registrationService.registerUser(model);

		return body.containsKey("error") ? ResponseEntity.badRequest().body(body) : ResponseEntity.ok(body);
	}
}
