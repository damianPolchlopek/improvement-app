package com.improvement_app.weekly.repository;

import com.improvement_app.weekly.entity.WeeklyRecord;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WeeklyRepository extends MongoRepository<WeeklyRecord, String> {

}
