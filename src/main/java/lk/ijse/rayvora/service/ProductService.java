package lk.ijse.rayvora.service;

import lk.ijse.rayvora.dto.ProductDTO;
import lk.ijse.rayvora.dto.response.ResponseProductDTO;
import org.springframework.data.domain.Page;

import java.math.BigDecimal;
import java.util.List;

public interface ProductService {
    void saveProduct(ProductDTO productDTO);
    void updateProduct(ProductDTO productDTO);
    void updateActiveStatus(long productId);
    ResponseProductDTO getProductById(long productId);
    Page<ResponseProductDTO> getProductBySellerAndCategoryName(int page, int size, Long sellerId, String categoryName);
    List<ResponseProductDTO> getLowStockProducts();
    Page<ResponseProductDTO> getAllProducts(int page, int size);
    Page<ResponseProductDTO> searchProductsByName(int page, int size, String productName);
    Page<ResponseProductDTO> searchProductsByNameWithSeller(int page, int size, Long sellerId, String productName);
    Page<ResponseProductDTO> filterPriceAscOrDesc(int page, int size, String direction);
    Page<ResponseProductDTO> filterProducts(
        int page, int size,
        String searchedProductName,
        String categoryName,
        BigDecimal startPrice,
        BigDecimal lastPrice
    );
}
