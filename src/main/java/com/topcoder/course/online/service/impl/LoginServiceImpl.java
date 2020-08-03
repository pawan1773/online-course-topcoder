package com.topcoder.course.online.service.impl;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.topcoder.course.online.entity.User;
import com.topcoder.course.online.model.request.LoginRequestModel;
import com.topcoder.course.online.repository.UserRepository;
import com.topcoder.course.online.service.LoginService;

/**
 * <p>
 * This is implementation class for {@link LoginService}. This class contains
 * business logic for user registration.
 * <p>
 * 
 * @author joginder.pawan@gmail.com
 */
@Service
public class LoginServiceImpl implements LoginService {

	@Autowired
	private UserRepository userRepository;

	/**
	 * <p>
	 * To login a user.
	 * </p>
	 * 
	 * @param model
	 * @return {@linkplain Map}
	 */
	@Override
	public Map<String, Object> loginUser(final LoginRequestModel model) {
		Optional<User> oUser = this.userRepository.findByEmailAndPassword(model.getEmail(), model.getPassword());
		final Map<String, Object> map = new HashMap<>(4);
		if (!oUser.isPresent()) {
			map.put("status", HttpStatus.BAD_REQUEST.value());
			map.put("statusMessage", HttpStatus.BAD_REQUEST.name());
			map.put("error", "Invalid email and password.");
		} else {			
			final User user = oUser.get();
			map.put("status", HttpStatus.OK.value());
			map.put("statusMessage", HttpStatus.OK.name());
			map.put("success", "User logged in successfully.");
			map.put("firstName", user.getFirstName());
			map.put("lastName", user.getLastName());
			map.put("email", user.getEmail());
			map.put("role", user.getRole().getRoleName());
		}
		return map;
	}
}
