package com.topcoder.course.online.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.topcoder.course.online.entity.Role;
import com.topcoder.course.online.entity.User;
import com.topcoder.course.online.repository.RoleRepository;
import com.topcoder.course.online.repository.UserRepository;

@RestController
@RequestMapping("/login")
public class LoginController {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private RoleRepository roleRepository;

	@GetMapping(value = "/user", produces = MediaType.APPLICATION_JSON_VALUE)
	public User getUser() {
		Role role = new Role();
		role.setRoleName("TEACHER");
		User user = new User();
		user.setFirstName("Joginder");
		user.setLastName("Kumar");
		user.setPassword("password");
		user.setEmail("joginder.pawan@gmail.com");
		user.setRole(role);
		return userRepository.save(user);
	}
}
