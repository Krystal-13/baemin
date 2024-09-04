package com.sparta26.baemin.dto.payment;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class ResponsePaymentInfoDto {

    private String paymentId;
    private String status;
    private String cardNumber;
    private LocalDateTime payDate;
    private Integer totalPrice;

    public static ResponsePaymentInfoDto createPaymentInfoWithId(String paymentId, String status, String cardNumber, LocalDateTime payDate, Integer totalPrice) {
        return new ResponsePaymentInfoDto(paymentId, status, cardNumber, payDate, totalPrice);
    }

    public static ResponsePaymentInfoDto createPaymentInfo(String status, String cardNumber, LocalDateTime payDate, Integer totalPrice) {
        return ResponsePaymentInfoDto.builder()
                .status(status)
                .cardNumber(cardNumber)
                .payDate(payDate)
                .totalPrice(totalPrice)
                .build();
    }

    @Builder(access = AccessLevel.PROTECTED)
    public ResponsePaymentInfoDto(String paymentId, String status, String cardNumber, LocalDateTime payDate, Integer totalPrice) {
        this.paymentId = paymentId;
        this.status = status;
        this.cardNumber = cardNumber;
        this.payDate = payDate;
        this.totalPrice = totalPrice;
    }
}
