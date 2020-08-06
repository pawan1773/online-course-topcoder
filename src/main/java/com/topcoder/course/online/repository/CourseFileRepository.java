package com.topcoder.course.online.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.topcoder.course.online.entity.CourseFile;

@Repository
@Transactional
public interface CourseFileRepository extends JpaRepository<CourseFile, String> {

	Optional<CourseFile> findByFileNameAndCourseCategory(final String fileName, final String courseCategory);

	@Query("select new com.topcoder.course.online.entity.CourseFile(cf.id, cf.fileLinkName) "
			+ "from CourseFile cf where cf.courseCategory = ?1")
	List<CourseFile> findByCourseCategory(final String courseCategory);
}