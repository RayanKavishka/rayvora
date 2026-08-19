package lk.ijse.rayvora.controller;

import lk.ijse.rayvora.constant.CommonResponse;
import lk.ijse.rayvora.constant.ResponseCode;
import lk.ijse.rayvora.constant.ResponseMessage;
import lk.ijse.rayvora.dto.CartDTO;
import lk.ijse.rayvora.dto.request.UpdateCartRequestDTO;
import lk.ijse.rayvora.service.CartService;
import lk.ijse.rayvora.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/carts")
@RequiredArgsConstructor
public class CartController {
    private final CategoryService categoryService;
    private final CartService cartService;

    @PostMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public CommonResponse saveCart(@RequestBody CartDTO cartDTO) {
        cartService.saveCart(cartDTO);
        return new CommonResponse(
                ResponseCode.OPERATION_SUCCESS,
                ResponseMessage.SUCCESS_MESSAGE
        );
    }

    @PutMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public CommonResponse updateCart(@RequestBody UpdateCartRequestDTO updateCartRequestDTO) {
        cartService.updateCart(updateCartRequestDTO);
        return new CommonResponse(
                ResponseCode.OPERATION_SUCCESS,
                ResponseMessage.SUCCESS_MESSAGE
        );
    }

    @DeleteMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public CommonResponse removeProductFromCart(@RequestBody UpdateCartRequestDTO updateCartRequestDTO) {
        cartService.removeProductFromCart(updateCartRequestDTO);
        return new CommonResponse(
                ResponseCode.OPERATION_SUCCESS,
                ResponseMessage.SUCCESS_MESSAGE
        );
    }

    @GetMapping(value = "/{userId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public CommonResponse getAllCartProducts(@PathVariable long userId) {
        return new CommonResponse(
                ResponseCode.OPERATION_SUCCESS,
                cartService.getAllCartProducts(userId),
                ResponseMessage.SUCCESS_MESSAGE
        );
    }
}
