package com.topcoder.course.online.model.request;

/**
 * <p>
 * This class represents generate pdf model.
 * </p>
 * 
 * @author joginder.pawan@gmail.com
 * 
 */
public class GeneratePdfRequestModel {

	private String user;

	private String encodedImage;

	public String getUser() {
		return user;
	}

	public void setUser(String user) {
		this.user = user;
	}

	public String getEncodedImage() {
		return encodedImage;
	}

	public void setEncodedImage(String encodedImage) {
		this.encodedImage = encodedImage;
	}
}
