package com.topcoder.course.online.service;

import java.util.List;
import java.util.Map;

import org.springframework.web.multipart.MultipartFile;

import com.topcoder.course.online.entity.CourseFile;
import com.topcoder.course.online.model.request.GeneratePdfRequestModel;

public interface PdfService {

	/**
	 * <p>
	 * To generate PDF.
	 * </p>
	 * 
	 * @param model
	 * @return {@linkplain Map}
	 */
	Map<String, Object> generatePdf(final GeneratePdfRequestModel model);

	/**
	 * <p>
	 * To upload file.
	 * </p>
	 * 
	 * @param fileLinkName
	 * @param courseCategory
	 * @param uploadfile
	 * @return {@linkplain Map}
	 */
	Map<String, Object> uploadPdf(final String fileLinkName, final String courseCategory,
			final MultipartFile uploadfile);

	List<CourseFile> findByCourseCategory(final String courseCategory);

	CourseFile findByFileId(final String id);
}
