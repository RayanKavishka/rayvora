package lk.ijse.rayvora.service;

import lk.ijse.rayvora.dto.OrdersDTO;
import lk.ijse.rayvora.dto.request.OrderRequestDTO;
import lk.ijse.rayvora.enumeration.OrderStatus;

import java.util.List;

public interface OrderService {
    void saveOrder(OrderRequestDTO orderRequestDTO);
    List<OrdersDTO> getAllOrdersByCustomer(Long customerId, String orderStatus);
    List<OrdersDTO> getAllOrdersBySeller(Long sellerId);
    List<OrdersDTO> getAllOrders();
    void updateOrderStatusWithTime(Long orderId, OrderStatus orderStatus);
}