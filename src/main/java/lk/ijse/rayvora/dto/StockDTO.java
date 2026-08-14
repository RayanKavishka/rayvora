package lk.ijse.rayvora.dto;

import jakarta.validation.constraints.*;
import lk.ijse.rayvora.enumeration.Status;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StockDTO {
    private Long stockId;

    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    @Pattern(regexp = "^[0-9]+$", message = "Quantity must be a valid number")
    private Integer quantity;

    @NotNull(message = "Low stock limit is required")
    @Min(value = 0, message = "Low stock limit cannot be negative")
    private Integer lowStockLimit;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Status status;
}