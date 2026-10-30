package com.improvement_app.other.weekly.repository;

import com.improvement_app.other.weekly.entity.Category;
import com.improvement_app.other.weekly.entity.WeeklyRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WeeklyRepository extends JpaRepository<WeeklyRecord, Long> {

    List<WeeklyRecord> findByUserIdAndCategoryOrderByDateDescIdDesc(Long userId, Category category);

    Optional<WeeklyRecord> findByIdAndUserId(Long id, Long userId);

}
