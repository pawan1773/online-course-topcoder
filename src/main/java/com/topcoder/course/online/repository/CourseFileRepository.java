package com.topcoder.course.online.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.topcoder.course.online.entity.CourseFile;

/**
 * <p>
 * Repository for {@link CourseFile}.
 * </p>
 * 
 * @author joginder.pawan@gmail.com
 *
 */
@Repository
@Transactional
public interface CourseFileRepository extends JpaRepository<CourseFile, String> {

	/**
	 * <p>
	 * To get files by course category.
	 * </p>
	 * 
	 * @param courseCategory
	 * @return {@link List} of type {@link CourseFile}
	 */
	@Query("select new com.topcoder.course.online.entity.CourseFile(cf.id, cf.fileLinkName) "
			+ "from CourseFile cf where cf.courseCategory = ?1")
	List<CourseFile> findByCourseCategory(final String courseCategory);
}
