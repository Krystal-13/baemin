package com.sparta26.baemin.order.client;

import com.sparta26.baemin.product.entity.Product;

public interface ProductServiceClient {
    Product getProductById(String productId);
}
