package lk.ijse.rayvora.repository;

import lk.ijse.rayvora.entity.Cart;
import lk.ijse.rayvora.entity.CartProducts;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {
    @Query(value = """
    SELECT *
    FROM cart
    WHERE user_id = ?1
    ORDER BY created_at DESC
    LIMIT 1
    """, nativeQuery = true)
    Optional<Cart> getLatestCart(Long userId);
}
