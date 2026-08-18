package lk.ijse.rayvora.service.impl;

import lk.ijse.rayvora.dto.CartDTO;
import lk.ijse.rayvora.dto.request.UpdateCartRequestDTO;
import lk.ijse.rayvora.entity.Cart;
import lk.ijse.rayvora.entity.CartProducts;
import lk.ijse.rayvora.entity.Product;
import lk.ijse.rayvora.entity.User;
import lk.ijse.rayvora.enumeration.Status;
import lk.ijse.rayvora.exception.RayvoraException;
import lk.ijse.rayvora.repository.CartProductsRepository;
import lk.ijse.rayvora.repository.CartRepository;
import lk.ijse.rayvora.repository.ProductRepository;
import lk.ijse.rayvora.repository.UserRepository;
import lk.ijse.rayvora.service.CartService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class CartServiceImpl implements CartService {
    private final CartRepository cartRepository;
    private final CartProductsRepository cartProductsRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    @Override
    public void saveCart(CartDTO cartDTO) {
        log.info("Execute saveCart() dto {}", cartDTO);
        try {
            Optional<User> optionalUser = userRepository.findById(cartDTO.getUserId());
            if (optionalUser.isEmpty())
                throw new RayvoraException(404, "Sorry, related customer is not found!");
            User customer = optionalUser.get();


            Cart currentCart;
            Optional<Cart> optionalCart = cartRepository.getLatestCart(cartDTO.getUserId());
            if (optionalCart.isPresent()) {
                Cart latestCart = optionalCart.get();

                if (latestCart.getStatus().equals(Status.INACTIVE)) {
                    Cart cart = new Cart();
                    cart.setUser(customer);
                    currentCart = cartRepository.save(cart);

                } else {
                    currentCart = latestCart;
                }

            } else {
                Cart cart = new Cart();
                cart.setUser(customer);
                currentCart = cartRepository.save(cart);
            }

            Optional<Product> optionalProduct = productRepository.findById(cartDTO.getProduct().getProductId());
            if (optionalProduct.isEmpty()) {
                throw new RayvoraException(404, "Sorry, related product is not found!");
            }
            Product product = optionalProduct.get();
            if (cartDTO.getProduct().getQuantity() <= 0) {
                throw new RayvoraException(400, "Quantity must be greater than zero.");
            }

            if (cartDTO.getProduct().getQuantity() > product.getStock().getQuantity()) {
                throw new RayvoraException(400, "Not enough stock available.");
            }

            CartProducts cartProducts =  new CartProducts();
            cartProducts.setCart(currentCart);
            cartProducts.setProduct(product);
            cartProducts.setQuantity(cartDTO.getProduct().getQuantity());

            cartProductsRepository.save(cartProducts);

        } catch (Exception e) {
            log.error("Error in saveCart() : " + e.getMessage());
            throw e;
        }
    }

    @Override
    public void updateCart(UpdateCartRequestDTO updateCartRequestDTO) {
        log.info("Execute updateCart() dto {}", updateCartRequestDTO);
        try {
            Optional<Product> optionalProduct = productRepository.findById(updateCartRequestDTO.getProductId());
            if (optionalProduct.isEmpty()) {
                throw new RayvoraException(404, "Sorry, related product is not found!");
            }
            Product product = optionalProduct.get();

            if (updateCartRequestDTO.getQuantity() <= 0) {
                throw new RayvoraException(400, "Quantity must be greater than zero.");
            }

            if (updateCartRequestDTO.getQuantity() > product.getStock().getQuantity()) {
                throw new RayvoraException(400, "Not enough stock available.");
            }

            Optional<Cart> optionalCart = cartRepository.getLatestCart(updateCartRequestDTO.getUserId());
            if (optionalCart.isEmpty())
                throw new RayvoraException(404, "Sorry related cart is not found!");
            Cart latestCart = optionalCart.get();

            CartProducts matchingCartProduct =
                    cartProductsRepository.getMatchingCartProduct(latestCart.getCartId(), updateCartRequestDTO.getProductId());

            matchingCartProduct.setQuantity(updateCartRequestDTO.getQuantity());

            cartProductsRepository.save(matchingCartProduct);

        } catch (Exception e) {
            log.error("Error in updateCart() : " + e.getMessage());
            throw e;
        }
    }

    @Override
    public void removeProductFromCart(UpdateCartRequestDTO updateCartRequestDTO) {
        log.info("Execute removeProductFromCart() dto {}", updateCartRequestDTO);
        try {
            Optional<Cart> optionalCart = cartRepository.getLatestCart(updateCartRequestDTO.getUserId());
            if (optionalCart.isEmpty())
                throw new RayvoraException(404, "Sorry related cart is not found!");
            Cart latestCart = optionalCart.get();

            CartProducts matchingCartProduct =
                    cartProductsRepository.getMatchingCartProduct(latestCart.getCartId(), updateCartRequestDTO.getProductId());

            matchingCartProduct.setStatus(Status.INACTIVE);
            matchingCartProduct.setQuantity(0);

            cartProductsRepository.save(matchingCartProduct);

        } catch (Exception e) {
            log.error("Error in removeProductFromCart() : " + e.getMessage());
            throw e;
        }
    }
}