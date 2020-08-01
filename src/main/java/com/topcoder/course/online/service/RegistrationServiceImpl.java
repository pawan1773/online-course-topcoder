package com.topcoder.course.online.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.topcoder.course.online.entity.Role;
import com.topcoder.course.online.entity.User;
import com.topcoder.course.online.model.request.RegistrationRequestModel;
import com.topcoder.course.online.repository.RoleRepository;
import com.topcoder.course.online.repository.UserRepository;

@Service
public class RegistrationServiceImpl implements RegistrationService {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private RoleRepository roleRepository;

	/**
	 * <p>
	 * To register a user.
	 * </p>
	 * 
	 * @param model
	 */
	@Override
	public Map<String, Object> registerUser(final RegistrationRequestModel model) {
		boolean existsByEmail = this.userRepository.existsByEmail(model.getEmail());
		final Map<String, Object> map = new HashMap<>(3);
		if (existsByEmail) {
			map.put("status", HttpStatus.BAD_REQUEST.value());
			map.put("statusMessage", HttpStatus.BAD_REQUEST.name());
			map.put("error", "User already exists.");
		} else {
			final Role role = this.roleRepository.findByRoleName(model.getRole()).get();
			final User user = new User();
			user.setEmail(model.getEmail());
			user.setFirstName(model.getFirstName());
			user.setLastName(model.getLastName());
			user.setPassword(model.getPassword());
			user.setRole(role);

			this.userRepository.save(user);
			map.put("status", HttpStatus.OK.value());
			map.put("statusMessage", HttpStatus.OK.name());
			map.put("success", "User registered successfully.");
		}
		return map;
	}

}
