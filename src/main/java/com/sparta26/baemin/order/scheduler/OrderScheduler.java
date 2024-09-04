package com.sparta26.baemin.order.scheduler;

import com.sparta26.baemin.order.repository.OrderRepository;
import com.sparta26.baemin.redis.RedisService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Slf4j
@Component
@RequiredArgsConstructor
public class OrderScheduler {

    private final RedisService redisService;
    private final OrderRepository orderRepository;

    @Scheduled(cron = "0 */10 * * * *")
    public void updateOrderCountCache() {
        LocalDateTime startDay = LocalDate.now().atStartOfDay();
        LocalDateTime endDay = startDay.plusDays(1);

        Long orderCount = orderRepository.countTodayOrders(startDay, endDay);

        String today = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
        try {
            redisService.updateTodayOrders(today, orderCount != null ? String.valueOf(orderCount) : "0");
        } catch (Exception e) {
            log.error("Failed to update order count cache", e);
        }
    }
}
