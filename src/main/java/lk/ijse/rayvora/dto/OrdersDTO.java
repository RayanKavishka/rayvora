package lk.ijse.rayvora.dto;

import lk.ijse.rayvora.dto.response.ResponseProductDTO;
import lk.ijse.rayvora.enumeration.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrdersDTO {
    private Long orderId;
    private String trackingNumber;
    private LocalDateTime orderDate;
    private BigDecimal totalAmount;
    private OrderStatus orderStatus;
    private LocalDate estimatedDeliveryFrom;
    private LocalDate estimatedDeliveryTo;
    private LocalDateTime shippedAt;
    private LocalDateTime deliveredAt;
    private UserDTO user;
    private List<ResponseProductDTO> products;
}