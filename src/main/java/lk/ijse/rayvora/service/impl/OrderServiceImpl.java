package lk.ijse.rayvora.service.impl;

import lk.ijse.rayvora.dto.OrdersDTO;
import lk.ijse.rayvora.dto.request.OrderRequestDTO;
import lk.ijse.rayvora.service.OrderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderServiceImpl implements OrderService {
    @Override
    public void saveOrder(OrderRequestDTO orderRequestDTO) {
        log.info("Execute saveOrder() dto {}", orderRequestDTO);
        try {


        } catch (Exception e) {
            log.error("Error in saveOrder() : " + e.getMessage());
            throw e;
        }
    }

    @Override
    public List<OrdersDTO> getAllOrdersByCustomer(Long customerId) {
        log.info("Execute getAllOrdersByCustomer() id {}", customerId);
        try {


        } catch (Exception e) {
            log.error("Error in getAllOrdersByCustomer() : " + e.getMessage());
            throw e;
        }
    }

    @Override
    public List<OrdersDTO> getAllOrdersBySeller(Long sellerId) {
        log.info("Execute getAllOrdersBySeller() id {}", sellerId);
        try {


        } catch (Exception e) {
            log.error("Error in getAllOrdersBySeller() : " + e.getMessage());
            throw e;
        }
    }

    @Override
    public List<OrdersDTO> getAllOrders() {
        log.info("Execute getAllOrders()");
        try {


        } catch (Exception e) {
            log.error("Error in getAllOrders() : " + e.getMessage());
            throw e;
        }
    }

    @Override
    public void updateOrderStatus(Long orderId, Long customerId) {
        log.info("Execute updateOrderStatus() orderId {}, customerId {}", orderId, customerId);
        try {


        } catch (Exception e) {
            log.error("Error in updateOrderStatus() : " + e.getMessage());
            throw e;
        }
    }
}
