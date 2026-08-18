package lk.ijse.rayvora.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateCartRequestDTO {
    @NotNull(message = "Product is required")
    private Long productId;

    @NotNull(message = "Quantity is required")
    private Integer quantity;

    @NotNull(message = "Customer is required")
    private Long userId;

    public UpdateCartRequestDTO(Long productId, Long userId) {
        this.productId = productId;
        this.userId = userId;
    }
}
