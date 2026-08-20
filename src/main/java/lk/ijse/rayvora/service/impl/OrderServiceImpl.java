package lk.ijse.rayvora.service.impl;

import lk.ijse.rayvora.dto.AddressDTO;
import lk.ijse.rayvora.dto.OrdersDTO;
import lk.ijse.rayvora.dto.ReviewDTO;
import lk.ijse.rayvora.dto.UserDTO;
import lk.ijse.rayvora.dto.request.OrderRequestDTO;
import lk.ijse.rayvora.dto.response.ResponseProductDTO;
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
import org.jspecify.annotations.NonNull;
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
            Optional<User> optionalUser = userRepository.findById(sellerId);
            if (optionalUser.isEmpty())
                throw new RayvoraException(404, "Sorry, related seller is not found!");

            List<Orders> allOrdersBySellerId = orderRepository.getAllOrdersBySellerId(sellerId);
            return getOrdersDTOsList(allOrdersBySellerId, sellerId);

        } catch (Exception e) {
            log.error("Error in getAllOrdersBySeller() : " + e.getMessage());
            throw e;
        }
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

    private @NonNull List<OrdersDTO> getOrdersDTOsList(List<Orders> orders, Long sellerId) {
        List<OrdersDTO> ordersDTOList = new ArrayList<>();
        for (Orders order : orders) {
            OrdersDTO ordersDTO = new OrdersDTO();
            ordersDTO.setOrderId(order.getOrderId());
            ordersDTO.setTrackingNumber(order.getTrackingNumber());
            ordersDTO.setOrderDate(order.getOrderDate());
            ordersDTO.setTotalAmount(order.getTotalAmount());
            ordersDTO.setOrderStatus(order.getOrderStatus());
            ordersDTO.setEstimatedDeliveryFrom(order.getEstimatedDeliveryFrom());
            ordersDTO.setEstimatedDeliveryTo(order.getEstimatedDeliveryTo());
            ordersDTO.setShippedAt(order.getShippedAt());
            ordersDTO.setDeliveredAt(order.getDeliveredAt());

            Optional<User> optionalUser = userRepository.findById(order.getUser().getUserId());
            if (optionalUser.isEmpty())
                throw new RayvoraException(404, "Sorry, related customer is not found!");
            User user = optionalUser.get();

            UserDTO userDTO = new UserDTO();
            userDTO.setFirstName(user.getFirstName());
            userDTO.setLastName(user.getLastName());
            userDTO.setEmail(user.getEmail());
            userDTO.setContact(user.getContact());

            AddressDTO addressDTO = new AddressDTO();
            addressDTO.setFullName(user.getAddress().getFullName());
            addressDTO.setContact(user.getAddress().getContact());
            addressDTO.setStreet(user.getAddress().getStreet());
            addressDTO.setCity(user.getAddress().getCity());
            addressDTO.setDistrict(user.getAddress().getDistrict());
            addressDTO.setProvince(user.getAddress().getProvince());
            addressDTO.setZipCode(user.getAddress().getZipCode());
            addressDTO.setCountry(user.getAddress().getCountry());

            userDTO.setAddressDTO(addressDTO);

            ordersDTO.setUser(userDTO);


            List<OrderProducts> orderProducts = order.getOrderProducts();

            List<ResponseProductDTO> responseProductDTOS =  new ArrayList<>();
            for (OrderProducts orderProduct : orderProducts) {
                if (orderProduct.getProduct().getStock().getUser().getUserId().equals(sellerId)) {
                    ResponseProductDTO responseProductDTO = getResponseProductDTO(orderProduct.getProduct(), orderProduct.getQuantity());
                    responseProductDTOS.add(responseProductDTO);
                }
            }

            ordersDTO.setProducts(responseProductDTOS);

            ordersDTOList.add(ordersDTO);
        }

        return ordersDTOList;
    }

    private @NonNull ResponseProductDTO getResponseProductDTO(Product product, Integer orderedQty) {
        ResponseProductDTO responseProductDTO = new ResponseProductDTO();
        responseProductDTO.setProductId(product.getProductId());
        responseProductDTO.setProductName(product.getProductName());
        responseProductDTO.setDescription(product.getDescription());
        responseProductDTO.setUnitPrice(product.getUnitPrice());
        responseProductDTO.setBrand(product.getBrand());

        responseProductDTO.setCategoryName(product.getCategory().getCategoryName());
        responseProductDTO.setShopName(product.getStock().getUser().getAddress().getFullName());

        responseProductDTO.setQuantity(orderedQty);
        responseProductDTO.setLowStockLimit(product.getStock().getLowStockLimit());

        int soldCount = 0;
        List<OrderProducts> orderProducts = product.getOrderProducts();
        for (OrderProducts orderProduct : orderProducts) {
            if (orderProduct.getOrder().getOrderStatus() == OrderStatus.COMPLETED) {
                soldCount += orderProduct.getQuantity();
            }
        }
        responseProductDTO.setSoldCount(soldCount);

        List<ReviewDTO> reviewDTOS = new ArrayList<>();
        for (Review review : product.getReviews()) {
            if (review.getStatus().equals(Status.ACTIVE)) {
                ReviewDTO reviewDTO = new ReviewDTO();
                reviewDTO.setReviewId(review.getReviewId());
                reviewDTO.setRating(review.getRating());
                reviewDTO.setComment(review.getComment());

                reviewDTOS.add(reviewDTO);
            }
        }
        responseProductDTO.setReviews(reviewDTOS);

        List<ProductImage> productImages = product.getProductImages();
        List<String> imageUrls = new ArrayList<>();
        for (ProductImage productImage : productImages) {
            imageUrls.add(productImage.getImageUrl());
        }
        responseProductDTO.setImageUrls(imageUrls);

        return responseProductDTO;
    }
}
