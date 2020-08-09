package com.topcoder.course.online.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.topcoder.course.online.entity.PdfAnnotation;

@Repository
public interface PdfAnnotationRepository extends JpaRepository<PdfAnnotation, Long> {

	@Query("select annotation from PdfAnnotation where fileId = :fileId")
	List<String> findByFileId(@Param(value = "fileId") final String fileId);

	boolean existsByAnnotationId(String annotationId);
	
	@Modifying
	void deleteByAnnotationId(String annotationId);
	
	Optional<PdfAnnotation> findByAnnotationId(String annotationId);
	
	boolean existsByAnnotationIdAndAnnotationContaining(String annotationId, String created);
}
