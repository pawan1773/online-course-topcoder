package com.topcoder.course.online.service;

import java.util.HashMap;
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

	/**
	 * <p>
	 * Returns list of files for course category.
	 * </p>
	 * 
	 * @param courseCategory
	 * @return {@link List} of {@link CourseFile}
	 */
	List<CourseFile> findByCourseCategory(final String courseCategory);

	/**
	 * <p>
	 * To get {@link CourseFile} by id.
	 * </p>
	 * 
	 * @param id
	 * @return instance of {@link CourseFile}
	 */
	CourseFile findByFileId(final String id);

	/**
	 * <p>
	 * To save annotation
	 * </p>
	 * 
	 * @param map
	 */
	void saveAnnotation(final Map<String, Object> map);

	/**
	 * <p>
	 * To delete annotation by annotation id.
	 * </p>
	 * 
	 * @param annotationId
	 */
	void deleteAnnotation(final String annotationId);

	/**
	 * <p>
	 * To get annotations by file id.
	 * </p>
	 * 
	 * @param fileId
	 * @return {@linkplain List} of {@linkplain Map}
	 */
	List<HashMap<String, Object>> getAnnotationsByFileId(final String fileId);

	/**
	 * <p>
	 * To update annotation.
	 * </p>
	 * 
	 * @param model
	 */
	void updateAnnotation(final Map<String, Object> model);
}
