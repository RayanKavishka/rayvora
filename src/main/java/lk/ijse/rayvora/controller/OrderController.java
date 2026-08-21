package lk.ijse.rayvora.controller;

import jakarta.validation.Valid;
import lk.ijse.rayvora.constant.CommonResponse;
import lk.ijse.rayvora.constant.ResponseCode;
import lk.ijse.rayvora.constant.ResponseMessage;
import lk.ijse.rayvora.dto.request.OrderRequestDTO;
import lk.ijse.rayvora.enumeration.OrderStatus;
import lk.ijse.rayvora.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = "/api/v1/orders")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;

    // Only customer
    @PostMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public CommonResponse saveOrder(@Valid @RequestBody OrderRequestDTO orderRequestDTO) {
        orderService.saveOrder(orderRequestDTO);
        return new CommonResponse(
                ResponseCode.OPERATION_SUCCESS,
                ResponseMessage.SUCCESS_MESSAGE
        );
    }

    // Only customer
    @GetMapping(value = "/customers-orders/{customerId}/{orderStatus}", produces = MediaType.APPLICATION_JSON_VALUE)
    public CommonResponse getAllOrdersBySeller(@PathVariable long customerId, @PathVariable String orderStatus) {
        return new CommonResponse(
                ResponseCode.OPERATION_SUCCESS,
                orderService.getAllOrdersByCustomer(customerId, orderStatus),
                ResponseMessage.SUCCESS_MESSAGE
        );
    }

    // Only seller
    @GetMapping(value = "/sellers-orders/{sellerId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public CommonResponse getAllOrdersBySeller(@PathVariable long sellerId) {
        return new CommonResponse(
                ResponseCode.OPERATION_SUCCESS,
                orderService.getAllOrdersBySeller(sellerId),
                ResponseMessage.SUCCESS_MESSAGE
        );
    }
}
