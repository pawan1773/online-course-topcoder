package com.topcoder.course.online.service;

import java.util.Map;

import com.topcoder.course.online.model.request.RegistrationRequestModel;

/**
 * <p>
 * Contains methods for the user registration feature.
 * </p>
 * 
 * @author joginder.pawan@gmail.com
 *
 */
public interface RegistrationService {

	/**
	 * <p>
	 * To register a user.
	 * </p>
	 * 
	 * @param model
	 * @return {@linkplain Map}
	 */
	Map<String, Object> registerUser(final RegistrationRequestModel model);
}
