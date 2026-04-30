package com.ecowire.ecowire.repository;

import com.ecowire.ecowire.entity.NatureData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface NatureDataRepository extends JpaRepository<NatureData, String> {
    Optional<NatureData> findByPolicy_PolicyId(String policyId);
}
