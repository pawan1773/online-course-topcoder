package com.topcoder.course.online.service;

import java.util.Map;

import com.topcoder.course.online.model.request.RegistrationRequestModel;

public interface RegistrationService {

	/**
	 * <p>
	 * To register a user.
	 * </p>
	 * 
	 * @param model
	 * @return 
	 */
	Map<String, Object> registerUser(final RegistrationRequestModel model);
}
