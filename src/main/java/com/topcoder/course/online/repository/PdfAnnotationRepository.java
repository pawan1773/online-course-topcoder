package com.topcoder.course.online.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.topcoder.course.online.entity.PdfAnnotation;

@Repository
public interface PdfAnnotationRepository extends JpaRepository<PdfAnnotation, Long> {

	//List<PdfAnnotation> findByFileId(final String fileId);

	@Query("select annotation from PdfAnnotation where fileId = :fileId")
	List<String> findByFileId(@Param(value = "fileId") final String fileId);
}
