package com.topcoder.course.online.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.topcoder.course.online.entity.PdfAnnotation;

/**
 * <p>
 * Repository for {@link PdfAnnotation}.
 * </p>
 * 
 * @author joginder.pawan@gmail.com
 *
 */
@Repository
public interface PdfAnnotationRepository extends JpaRepository<PdfAnnotation, Long> {

	/**
	 * <p>
	 * To get annotation by annotation id.
	 * </p>
	 * 
	 * @param fileId
	 * @return {@linkplain List} of type {@linkplain String}
	 */
	@Query("select annotation from PdfAnnotation where fileId = :fileId")
	List<String> findByFileId(@Param(value = "fileId") final String fileId);

	/**
	 * <p>
	 * To check annotation with given annotation id is present.
	 * </p>
	 * 
	 * @param annotationId
	 * @return true/false
	 */
	boolean existsByAnnotationId(final String annotationId);

	/**
	 * <p>
	 * To delete annotations by annotation id.
	 * </p>
	 * 
	 * @param annotationId
	 */
	@Modifying
	void deleteByAnnotationId(String annotationId);

	/**
	 * 
	 * @param annotationId
	 * @return
	 */
	Optional<PdfAnnotation> findByAnnotationId(String annotationId);

	/**
	 * <p>
	 * To check annotation with given annotation id is present.
	 * </p>
	 * 
	 * @param annotationId
	 * @param created
	 * @return true/false
	 */
	boolean existsByAnnotationIdAndAnnotationContaining(final String annotationId, final String created);
}
