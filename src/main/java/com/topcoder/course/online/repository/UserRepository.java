package com.topcoder.course.online.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.topcoder.course.online.entity.User;

/**
 * <p>
 * Repository for {@link User}.
 * </p>
 * 
 * @author joginder.pawan@gmail.com
 *
 */
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

	/**
	 * <p>
	 * To find user by email and password
	 * </p>
	 * 
	 * @param email
	 * @param password
	 * @return {@linkplain Optional} of {@link User}
	 */
	Optional<User> findByEmailAndPassword(final String email, final String password);

	/**
	 * <p>
	 * To find user by email and key
	 * </p>
	 * 
	 * @param email
	 * @param key
	 * @return {@linkplain Optional} of {@link User}
	 */
	Optional<User> findByEmailAndRecoveryKey(final String email, final String key);
}
