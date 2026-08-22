package lk.ijse.rayvora.repository;

import lk.ijse.rayvora.entity.Orders;
import lk.ijse.rayvora.enumeration.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Orders, Long> {

    @Query("""
        SELECT o
        FROM Orders o
        WHERE o.user.userId = ?1
        ORDER BY o.orderDate DESC
    """)
    List<Orders> getAllOrdersByCustomer(Long customerId);

    @Query("""
        SELECT o
        FROM Orders o
        WHERE o.user.userId = ?1
        AND o.orderStatus = ?2
        ORDER BY o.orderDate DESC
    """)
    List<Orders> getAllOrdersByCustomerAndStatus(Long customerId, OrderStatus orderStatus);

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