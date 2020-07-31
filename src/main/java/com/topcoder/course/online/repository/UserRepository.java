package com.topcoder.course.online.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.topcoder.course.online.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {

}
