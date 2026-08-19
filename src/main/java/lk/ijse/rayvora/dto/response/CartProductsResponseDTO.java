package lk.ijse.rayvora.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CartProductsResponseDTO {
    private Long cartId;
    private List<ResponseProductDTO> cartProduct;
}
