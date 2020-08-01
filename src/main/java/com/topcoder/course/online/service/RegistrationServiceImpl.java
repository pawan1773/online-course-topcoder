package com.topcoder.course.online.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
	public void registerUser(final RegistrationRequestModel model) {

		final User user = new User();
		user.setEmail(model.getEmail());
		user.setFirstName(model.getFirstName());
		user.setLastName(model.getLastName());
		user.setPassword(model.getPassword());
		user.setRole(this.roleRepository.findByRoleName(model.getRole()).get());

		this.userRepository.save(user);
	}

}
