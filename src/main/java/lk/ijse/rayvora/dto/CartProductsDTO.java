package lk.ijse.rayvora.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CartProductsDTO {
    private Long cartProductsId;

    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    @Pattern(regexp = "^[0-9]+$", message = "Quantity must be a valid number")
    private Integer quantity;

    @NotNull(message = "ProductId is required")
    private Long productId;

    @NotNull(message = "CartId is required")
    private Long cartId;
}