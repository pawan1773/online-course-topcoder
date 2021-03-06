package com.topcoder.course.online.service;

import java.util.Map;

import com.topcoder.course.online.model.request.ForgotPasswordRequestModel;
import com.topcoder.course.online.model.request.LoginRequestModel;

/**
 * <p>
 * Contains methods for the user login feature.
 * </p>
 * 
 * @author joginder.pawan@gmail.com
 *
 */
public interface LoginService {

	/**
	 * <p>
	 * To login a user.
	 * </p>
	 * 
	 * @param model
	 * @return {@linkplain Map}
	 */
	Map<String, Object> loginUser(final LoginRequestModel model);

	/**
	 * <p>
	 * To change password.
	 * </p>
	 * 
	 * @param model
	 * @return {@linkplain Map}
	 */
	Map<String, Object> changePassword(final ForgotPasswordRequestModel model);
}
