package com.ecowire.ecowire.repository;

import com.ecowire.ecowire.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {

    // Used during login to load the user
    Optional<User> findByUsername(String username);

    // Used during registration to check for duplicates
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
}
