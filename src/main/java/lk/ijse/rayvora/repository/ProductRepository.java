package lk.ijse.rayvora.repository;

import lk.ijse.rayvora.entity.Product;
import lk.ijse.rayvora.enumeration.Status;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    Page<Product> findByStatus(Status status, Pageable pageable);
    List<Product> findAllByStatus(Status status);

    @Query(value = """
    SELECT p
    FROM Product p
    WHERE p.productName LIKE %?1% AND p.status = 'ACTIVE'
    """)
    Page<Product> searchProductsByProductName(String productName,  Pageable pageable);

    @Query(value = """
    SELECT p
    FROM Product p
    WHERE p.stock.user.userId = ?1
        AND (?2 = 'ALL' OR p.category.categoryName = ?2)
        AND p.status = 'ACTIVE'
    """)
    List<Product> searchProductsBySellerAndCategoryName(Long sellerId, String categoryName);

    @Query(value = """
    SELECT p
    FROM Product p
    WHERE (?1 IS NULL OR p.productName LIKE %?1%) AND
        (?2 IS NULL OR p.category.categoryName = ?2) AND
        (?3 IS NULL OR p.unitPrice >= ?3) AND
        (?4 IS NULL OR p.unitPrice <= ?4) AND
        p.status = 'ACTIVE'
    """)
    Page<Product> filterProducts(
            String searchedProductName,
            String categoryName,
            BigDecimal startPrice,
            BigDecimal lastPrice,
            Pageable pageable
    );
}
