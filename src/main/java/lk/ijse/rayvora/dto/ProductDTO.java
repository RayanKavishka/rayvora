package lk.ijse.rayvora.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;
import java.math.BigDecimal;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductDTO {
    private Long productId;

    @NotBlank(message = "Product name is required")
    @Size(max = 100, message = "Product name must not exceed 100 characters")
    private String productName;

    @NotBlank(message = "Description is required")
    @Size(max = 500, message = "Description must not exceed 500 characters")
    private String description;

    @NotNull(message = "Unit price is required")
    @DecimalMin(value = "0.01", message = "Unit price must be greater than 0")
    private BigDecimal unitPrice;

    @NotBlank(message = "Brand is required")
    @Size(max = 100, message = "Brand must not exceed 100 characters")
    private String brand;

    @NotNull(message = "You must need to select a category")
    private Long categoryId;

    @NotNull(message = "Seller is required")
    private Long userId;

    @NotBlank(message = "Quantity is required")
    @Pattern(regexp = "^[0-9]+$", message = "Quantity must be a valid number")
    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity;

    @NotBlank(message = "Limit is required")
    @Pattern(regexp = "^[0-9]+$", message = "Limit must be a valid number")
    @Min(value = 0, message = "Limit must be at least 0")
    private Integer lowStockLimit;

    private List<MultipartFile> productImages;
}