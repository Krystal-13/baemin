package com.sparta26.baemin.dto.order;

import lombok.Getter;

@Getter
public class ResponseWeeklyOrderCountDto {

    private String date;
    private String count;
    public ResponseWeeklyOrderCountDto(String date, String count) {
        this.date = date;
        this.count = count;
    }
}
