package com.topcoder.course.online.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.topcoder.course.online.model.request.LoginRequestModel;
import com.topcoder.course.online.service.LoginService;

@RestController
public class LoginController {

	@Autowired
	private LoginService loginServiceImpl;

	/**
	 * <p>
	 * To login user.
	 * </p>
	 * 
	 * @param model
	 * @return instance of {@linkplain ResponseEntity} of type {@linkplain Map}
	 */
	@PostMapping(value = "/login", consumes = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Map<String, Object>> loginUser(@RequestBody final LoginRequestModel model) {
		final Map<String, Object> body = this.loginServiceImpl.loginUser(model);

		return body.containsKey("error") ? ResponseEntity.badRequest().body(body) : ResponseEntity.ok(body);
	}
}
