package com.topcoder.course.online.service;

import java.util.Map;

import com.topcoder.course.online.model.request.GeneratePdfRequestModel;

public interface GeneratePdfService {

	/**
	 * <p>
	 * To generate PDF.
	 * </p>
	 * 
	 * @param model
	 * @return {@linkplain Map}
	 */
	Map<String, Object> generatePdf(final GeneratePdfRequestModel model);
}
