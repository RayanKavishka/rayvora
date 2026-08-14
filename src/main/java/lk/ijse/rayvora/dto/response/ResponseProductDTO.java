package lk.ijse.rayvora.dto.response;

import lk.ijse.rayvora.dto.ReviewDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;
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
}