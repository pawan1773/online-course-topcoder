package com.topcoder.course.online.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.topcoder.course.online.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {

	/**
	 * <p>
	 * Returns true if {@link User} by email already exists.
	 * </p>
	 * 
	 * @param email
	 * @return true/false
	 */
	boolean existsByEmail(final String email);
}
