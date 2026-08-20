package lk.ijse.rayvora.service.impl;

import lk.ijse.rayvora.dto.OrdersDTO;
import lk.ijse.rayvora.dto.request.OrderRequestDTO;
import lk.ijse.rayvora.entity.*;
import lk.ijse.rayvora.enumeration.OrderStatus;
import lk.ijse.rayvora.enumeration.PayMethod;
import lk.ijse.rayvora.enumeration.PayStatus;
import lk.ijse.rayvora.enumeration.Status;
import lk.ijse.rayvora.exception.RayvoraException;
import lk.ijse.rayvora.repository.*;
import lk.ijse.rayvora.service.EmailService;
import lk.ijse.rayvora.service.OrderService;
import lk.ijse.rayvora.util.OrderEmailBuilder;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderServiceImpl implements OrderService {
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final PaymentRepository paymentRepository;
    private final CartRepository cartRepository;
    private final CartProductsRepository cartProductsRepository;
    private final AddressRepository addressRepository;
    private final OrderProductsRepository orderProductsRepository;
    private final StockRepository stockRepository;

    private final EmailService emailService;
    private final OrderEmailBuilder orderEmailBuilder;

    @Override
    @Transactional(rollbackFor = {Exception.class}, propagation = Propagation.REQUIRED)
    public void saveOrder(OrderRequestDTO orderRequestDTO) {
        log.info("Execute saveOrder() dto {}", orderRequestDTO);

        Orders order = null;
        try {
            Optional<User> optionalUser = userRepository.findById(orderRequestDTO.getCustomerId());
            if (optionalUser.isEmpty())
                throw new RayvoraException(404, "Sorry, related customer is not found!");
            User customer = optionalUser.get();

            Optional<Address> optionalAddress = addressRepository.findById(customer.getAddress().getAddressId());
            if (optionalAddress.isEmpty())
                throw new RayvoraException(404, "Sorry, related address is not found!");
            Address address = optionalAddress.get();

            Optional<Cart> optionalCart = cartRepository.getLatestCart(customer.getUserId());
            if (optionalCart.isEmpty())
                throw new RayvoraException(404, "Sorry, your cart is empty");
            Cart latestCart = optionalCart.get();


            order = new Orders();
            order.setOrderStatus(OrderStatus.PENDING);

            LocalDate today = LocalDate.now();
            order.setEstimatedDeliveryFrom(today);
            order.setEstimatedDeliveryTo(today.plusWeeks(2));

            order.setUser(customer);
            order.setAddress(address);

            if (latestCart.getStatus().equals(Status.INACTIVE)) {
                throw new RayvoraException(404, "Sorry, your cart is empty");
            }

            List<CartProducts> cartProducts = latestCart.getCartProducts();
            if (cartProducts == null || cartProducts.isEmpty()) {
                throw new RayvoraException(404, "Sorry, your cart is empty.");
            }

            BigDecimal total = new BigDecimal(0);
            for (CartProducts cartProduct : cartProducts) {
                total = total.add(
                        cartProduct.getProduct().getUnitPrice()
                                .multiply(BigDecimal.valueOf(cartProduct.getQuantity()))
                );
            }

            if (total.compareTo(orderRequestDTO.getTotal()) != 0) {
                throw new RayvoraException(409, "Your order total has changed. Please refresh your cart and try again.");
            }
            order.setTotalAmount(total);

            order = orderRepository.save(order);


            List<OrderProducts> orderProducts = new ArrayList<>();
            List<Stock> stocks = new ArrayList<>();
            for (CartProducts cartProduct : cartProducts) {
                if (cartProduct.getStatus().equals(Status.ACTIVE)) {
                    OrderProducts orderProduct = new OrderProducts();
                    orderProduct.setQuantity(cartProduct.getQuantity());
                    orderProduct.setOrder(order);
                    orderProduct.setProduct(cartProduct.getProduct());

                    orderProducts.add(orderProduct);

                    Stock stock = cartProduct.getProduct().getStock();
                    if (stock.getQuantity() < cartProduct.getQuantity()) {
                        throw new RayvoraException(409, "Sorry, some products in your cart are no longer available in the requested quantity.");
                    }
                    stock.setQuantity(
                            stock.getQuantity() - cartProduct.getQuantity()
                    );
                    stocks.add(stock);
                }
            }
            orderProductsRepository.saveAll(orderProducts);
            order.setOrderProducts(orderProducts);

            stockRepository.saveAll(stocks);

            Payment payment = new Payment();
            payment.setAmount(total);
            payment.setPayMethod(PayMethod.COD);
            payment.setPayStatus(PayStatus.PENDING);
            payment.setOrder(order);

            paymentRepository.save(payment);

            String trackingNumber = "RAY-" + order.getOrderId() + "-" +
                    UUID.randomUUID()
                            .toString()
                            .replace("-", "")
                            .substring(0, 12)
                            .toUpperCase();

            order.setTrackingNumber(trackingNumber);
            order.setOrderStatus(OrderStatus.CONFIRMED);
            order = orderRepository.save(order);

            emailService.sendEmail(
                    order,
                    customer.getFirstName() + " " + customer.getLastName(),
                    customer.getEmail(),
                    "Order Confirmed! Your Rayvora Order #" + order.getOrderId() + " Is on Its Way",
                    orderEmailBuilder.buildConfirmed(order)
            );

            // Clear cart products and remove cart
            List<CartProducts> cartProductsList = new ArrayList<>();
            for (CartProducts cartProduct : cartProducts) {
                cartProduct.setStatus(Status.INACTIVE);

                cartProductsList.add(cartProduct);
            }
            cartProductsRepository.saveAll(cartProductsList);

            latestCart.setStatus(Status.INACTIVE);
            cartRepository.save(latestCart);


        } catch (Exception e) {
            log.error("Error in saveOrder() : " + e.getMessage());
            throw e;
        }
    }

    @Override
    public List<OrdersDTO> getAllOrdersByCustomer(Long customerId) {
        log.info("Execute getAllOrdersByCustomer() id {}", customerId);
        try {


        } catch (Exception e) {
            log.error("Error in getAllOrdersByCustomer() : " + e.getMessage());
            throw e;
        }
        return null;
    }

    @Override
    public List<OrdersDTO> getAllOrdersBySeller(Long sellerId) {
        log.info("Execute getAllOrdersBySeller() id {}", sellerId);
        try {
            List<Orders> allOrdersBySellerId = orderRepository.getAllOrdersBySellerId(sellerId);
            for (Orders order : allOrdersBySellerId) {

            }

        } catch (Exception e) {
            log.error("Error in getAllOrdersBySeller() : " + e.getMessage());
            throw e;
        }

        return null;
    }

    @Override
    public List<OrdersDTO> getAllOrders() {
        log.info("Execute getAllOrders()");
        try {


        } catch (Exception e) {
            log.error("Error in getAllOrders() : " + e.getMessage());
            throw e;
        }

        return null;
    }

    @Override
    public void updateOrderShippedOrDeliveredStatusAndTime(Long orderId, String type) {
        log.info("Execute updateOrderShippedOrDeliveredStatusAndTime() orderId {}, type {}", orderId, type);
        try {


        } catch (Exception e) {
            log.error("Error in updateOrderShippedOrDeliveredStatusAndTime() : " + e.getMessage());
            throw e;
        }
    }
}
