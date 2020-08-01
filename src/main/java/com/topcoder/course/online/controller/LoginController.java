package com.topcoder.course.online.controller;

import javax.servlet.http.HttpSession;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class LoginController {
	
	@GetMapping("/login")
	public ResponseEntity<?> login(final HttpSession session) {
		return null;
	}
}
