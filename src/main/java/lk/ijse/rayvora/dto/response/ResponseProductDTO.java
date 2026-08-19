package lk.ijse.rayvora.dto.response;

import lk.ijse.rayvora.dto.ReviewDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResponseProductDTO {
    private Long productId;
    private String productName;
    private String description;
    private BigDecimal unitPrice;
    private String brand;

    private String categoryName;
    private String shopName;
    private Integer quantity;
    private Integer lowStockLimit;
    private Integer soldCount;

    private List<ReviewDTO> reviews;
    private List<String> imageUrls;

    private String cartProductImageUrl;

    public ResponseProductDTO(Long productId, String productName, BigDecimal unitPrice, String shopName, Integer quantity, String cartProductImageUrl) {
        this.productId = productId;
        this.productName = productName;
        this.unitPrice = unitPrice;
        this.shopName = shopName;
        this.quantity = quantity;
        this.cartProductImageUrl = cartProductImageUrl;
    }
}