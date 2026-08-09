package lk.ijse.rayvora.dto;

import jakarta.validation.constraints.*;
import lk.ijse.rayvora.enumeration.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrdersDTO {
    private Long orderId;
    private String trackingNumber;
    private LocalDateTime orderDate;

    @DecimalMin(value = "0.00", message = "Discount amount cannot be negative")
    private BigDecimal discountAmount;

    @NotNull(message = "Total amount is required")
    @DecimalMin(value = "0.01", message = "Total amount must be greater than 0")
    private BigDecimal totalAmount;

    private OrderStatus orderStatus;
    private LocalDate estimatedDeliveryFrom;
    private LocalDate estimatedDeliveryTo;
    private LocalDateTime shippedAt;
    private LocalDateTime deliveredAt;
}