package lk.ijse.rayvora.repository;

import lk.ijse.rayvora.entity.CartProducts;
import lk.ijse.rayvora.enumeration.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CartProductsRepository extends JpaRepository<CartProducts, Long> {
    @Query(value = """
    SELECT cp FROM CartProducts cp
    WHERE cp.cart.cartId = ?1 AND cp.product.productId = ?2
    """)
    CartProducts getMatchingCartProduct(Long cartId, Long productId);

    @Query(value = """
        SELECT cp FROM CartProducts cp
        WHERE cp.cart.cartId = ?1 AND cp.status = ?2
    """)
    List<CartProducts> findAllByCartCartIdAndStatus(Long cartId, Status status);

    @Query(value = """
        SELECT cp FROM CartProducts cp
        WHERE cp.cart.cartId = ?1
    """)
    List<CartProducts> findAllByCartCartId(Long cartId);
}
