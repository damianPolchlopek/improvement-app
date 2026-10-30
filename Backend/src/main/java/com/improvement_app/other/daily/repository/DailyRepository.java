package com.improvement_app.other.daily.repository;

import com.improvement_app.other.daily.entity.Daily;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DailyRepository extends JpaRepository<Daily, Long> {

    Page<Daily> findByUserId(Long userId, Pageable pageable);

}
