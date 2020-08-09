package com.topcoder.course.online.model.request;

/**
 * <p>
 * This class represents user change password model.
 * </p>
 * 
 * @author joginder.pawan@gmail.com
 * 
 */
public class ForgotPasswordRequestModel {

	private String email;

	private String password;

	private String key;

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getKey() {
		return key;
	}

	public void setKey(String key) {
		this.key = key;
	}
}
