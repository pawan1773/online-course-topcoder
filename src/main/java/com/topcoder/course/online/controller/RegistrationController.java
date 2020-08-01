package com.topcoder.course.online.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.topcoder.course.online.model.request.RegistrationRequestModel;
import com.topcoder.course.online.service.RegistrationService;

@RestController
public class RegistrationController {

	@Autowired
	private RegistrationService registrationServiceImpl;

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
		this.registrationServiceImpl.registerUser(model);

		final Map<String, Object> body = new HashMap<>(3);
		body.put("status", HttpStatus.OK.value());
		body.put("statusMessage", HttpStatus.OK.name());
		body.put("success", "User registered successfully");
		return ResponseEntity.ok(body);
	}
}
