package com.topcoder.course.online.model.request;

/**
 * <p>
 * This class represents user registration model.
 * </p>
 * 
 * @author joginder.pawan@gmail.com
 * 
 */
public class RegistrationRequestModel {

	private String firstName;

	private String lastName;

	private String email;

	private String password;

	private String recoveryKey;

	private String role;

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

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

	public String getRecoveryKey() {
		return recoveryKey;
	}

	public void setRecoveryKey(String recoveryKey) {
		this.recoveryKey = recoveryKey;
	}

	public String getRole() {
		return role;
	}

	public void setRole(String role) {
		this.role = role;
	}
}