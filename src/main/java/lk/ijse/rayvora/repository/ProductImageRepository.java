package lk.ijse.rayvora.repository;

import lk.ijse.rayvora.entity.Product;
import lk.ijse.rayvora.entity.ProductImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductImageRepository extends JpaRepository<ProductImage, Long> {
    List<ProductImage> findByProductProductId(long productId);
    void deleteByProduct(Product product);
}
