package lk.ijse.rayvora.service;

import lk.ijse.rayvora.dto.CartDTO;
import lk.ijse.rayvora.dto.request.UpdateCartRequestDTO;
import lk.ijse.rayvora.dto.response.CartProductsResponseDTO;

public interface CartService {
    void saveCart(CartDTO cartDTO);
    void updateCart(UpdateCartRequestDTO updateCartRequestDTO);
    void removeProductFromCart(UpdateCartRequestDTO updateCartRequestDTO);
    CartProductsResponseDTO getAllCartProducts(Long customerId);
}
