package lk.ijse.rayvora.service;

import lk.ijse.rayvora.dto.OrdersDTO;
import lk.ijse.rayvora.dto.request.OrderRequestDTO;

import java.util.List;

public interface OrderService {
    void saveOrder(OrderRequestDTO orderRequestDTO);
    List<OrdersDTO> getAllOrdersByCustomer(Long customerId);
    List<OrdersDTO> getAllOrdersBySeller(Long sellerId);
    List<OrdersDTO> getAllOrders();
    void updateOrderStatus(Long orderId, Long customerId);
}