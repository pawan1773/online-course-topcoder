package com.topcoder.course.online.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.topcoder.course.online.entity.Role;

public interface RoleRepository extends JpaRepository<Role, Long> {

}
