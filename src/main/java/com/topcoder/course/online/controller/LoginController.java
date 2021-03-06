package com.topcoder.course.online.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.topcoder.course.online.model.request.ForgotPasswordRequestModel;
import com.topcoder.course.online.model.request.LoginRequestModel;
import com.topcoder.course.online.service.LoginService;

/**
 * <p>
 * To handle HTTP requests for user login.
 * </p>
 * 
 * @author joginder.pawan@gmail.com
 * 
 */
@RestController
@RequestMapping("/")
public class LoginController {

	@Autowired
	private LoginService loginServiceImpl;

	/**
	 * <p>
	 * To login a user.
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

	/**
	 * <p>
	 * To change password.
	 * </p>
	 * 
	 * @param model
	 * @return instance of {@linkplain ResponseEntity} of type {@linkplain Map}
	 */
	@PostMapping(value = "/changePassword", consumes = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Map<String, Object>> changePassword(@RequestBody final ForgotPasswordRequestModel model) {
		final Map<String, Object> body = this.loginServiceImpl.changePassword(model);
		return body.containsKey("error") ? ResponseEntity.badRequest().body(body) : ResponseEntity.ok(body);
	}
}
