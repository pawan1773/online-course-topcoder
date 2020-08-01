package com.topcoder.course.online.service;

import com.topcoder.course.online.model.request.RegistrationRequestModel;

public interface RegistrationService {

	/**
	 * <p>
	 * To register a user.
	 * </p>
	 * 
	 * @param model
	 */
	void registerUser(final RegistrationRequestModel model);
}
