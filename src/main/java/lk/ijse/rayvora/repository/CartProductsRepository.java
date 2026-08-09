package lk.ijse.rayvora.repository;

import lk.ijse.rayvora.entity.CartProducts;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CartProductsRepository extends JpaRepository<CartProducts, Long> {
}
