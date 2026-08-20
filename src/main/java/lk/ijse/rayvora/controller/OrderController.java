package lk.ijse.rayvora.controller;

import jakarta.validation.Valid;
import lk.ijse.rayvora.constant.CommonResponse;
import lk.ijse.rayvora.constant.ResponseCode;
import lk.ijse.rayvora.constant.ResponseMessage;
import lk.ijse.rayvora.dto.request.OrderRequestDTO;
import lk.ijse.rayvora.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/api/v1/orders")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;

    @PostMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public CommonResponse saveOrder(@Valid @RequestBody OrderRequestDTO orderRequestDTO) {
        orderService.saveOrder(orderRequestDTO);
        return new CommonResponse(
                ResponseCode.OPERATION_SUCCESS,
                ResponseMessage.SUCCESS_MESSAGE
        );
    }
}
