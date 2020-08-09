package com.topcoder.course.online.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.topcoder.course.online.entity.Role;

/**
 * <p>
 * Repository for {@link Role}.
 * </p>
 * 
 * @author joginder.pawan@gmail.com
 *
 */
public interface RoleRepository extends JpaRepository<Role, Long> {

	/**
	 * <p>
	 * To get {@link Role} by role name.
	 * </p>
	 * 
	 * @param role
	 * @return {@linkplain Optional} of type {@link Role}
	 */
	Optional<Role> findByRoleName(final String role);
}
