package com.sparta26.baemin.redis;

import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
public class RedisService {

    private final RedisTemplate<String, String> redisTemplate;
    public RedisService(RedisTemplate<String, String> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    public void updateTodayOrders(String hashKey, String value) {
        HashOperations<String, Object, Object> opsForHash = redisTemplate.opsForHash();
        opsForHash.put("orders", hashKey, value);
    }

    public Map<String, String> getWeeklyOrderCounts() {
        HashOperations<String, Object, Object> hashOps = redisTemplate.opsForHash();
        Map<String, String> orderCounts = new HashMap<>();

        LocalDate today = LocalDate.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        for (int i = 0; i < 7; i++) {
            LocalDate date = today.minusDays(i);
            String key = date.format(formatter);
            Object count = hashOps.get("orders", key);

            orderCounts.put(key, count != null ? count.toString() : "0");
        }
        return orderCounts;
    }

    @Scheduled(cron = "0 0 0 * * *")
    public void cleanupOldOrders() {
        LocalDate sevenDaysAgo = LocalDate.now().minusDays(7);
        String oldDateKey = sevenDaysAgo.format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));

        HashOperations<String, Object, Object> opsForHash = redisTemplate.opsForHash();
        opsForHash.delete("orders", oldDateKey);
        log.info("Deleted old Redis field for date: " + oldDateKey);
    }
}
