package com.improvement_app.other.daily.repository;

import com.improvement_app.other.daily.entity.Daily;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface DailyRepository extends MongoRepository<Daily, String>  {

}
