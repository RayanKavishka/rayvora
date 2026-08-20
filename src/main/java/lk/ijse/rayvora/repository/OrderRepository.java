package lk.ijse.rayvora.repository;

import lk.ijse.rayvora.dto.OrdersDTO;
import lk.ijse.rayvora.dto.response.ResponseProductDTO;
import lk.ijse.rayvora.entity.Orders;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Orders, Long> {

    @Query("""
    SELECT DISTINCT o
    FROM Orders o
    JOIN o.orderProducts op
    JOIN op.product p
    JOIN p.stock s
    JOIN s.user u
    WHERE u.userId = ?1
    ORDER BY o.orderDate DESC
""")
    List<Orders> getAllOrdersBySellerId(Long sellerId);
}