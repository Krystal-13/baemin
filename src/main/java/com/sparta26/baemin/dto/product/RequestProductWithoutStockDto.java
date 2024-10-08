package com.sparta26.baemin.dto.product;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RequestProductWithoutStockDto {

    @NotBlank(message = "상품 이름은 필수입니다.")
    private String name;
    private String description;

    @NotNull(message = "가격은 필수입니다.")
    @Min(value = 1, message = "가격은 1 이상의 값이어야 합니다.")
    private Integer price;

    private String category;
    private String imageUrl;

}
