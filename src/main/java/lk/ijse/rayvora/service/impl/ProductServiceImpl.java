package lk.ijse.rayvora.service.impl;

import lk.ijse.rayvora.dto.ProductDTO;
import lk.ijse.rayvora.dto.ReviewDTO;
import lk.ijse.rayvora.dto.response.ResponseProductDTO;
import lk.ijse.rayvora.entity.*;
import lk.ijse.rayvora.enumeration.OrderStatus;
import lk.ijse.rayvora.enumeration.Status;
import lk.ijse.rayvora.exception.RayvoraException;
import lk.ijse.rayvora.repository.*;
import lk.ijse.rayvora.service.ProductService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.NonNull;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductServiceImpl implements ProductService {
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ProductImageRepository productImageRepository;
    private final StockRepository stockRepository;
    private final UserRepository userRepository;

    private String getExtension(String fileName) {
        if (fileName == null) {
            return "";
        }
        int index = fileName.lastIndexOf(".");
        if (index == -1) {
            return "";
        }
        return fileName.substring(index);
    }

    @Override
    @Transactional(rollbackFor = {Exception.class}, propagation = Propagation.REQUIRED)
    public void saveProduct(ProductDTO productDTO) {
        log.info("Execute saveProduct() dto {}", productDTO);
        try {
            Optional<Category> optionalCategory = categoryRepository.findById(productDTO.getCategoryId());
            if (optionalCategory.isEmpty())
                throw new RayvoraException(404, "Sorry, related category is not found!");

            Optional<User> optionalUser = userRepository.findById(productDTO.getUserId());
            if (optionalUser.isEmpty())
                throw new RayvoraException(404, "Sorry, related user is not found!");

            Product product = new Product();
            product.setProductName(productDTO.getProductName());
            product.setDescription(productDTO.getDescription());
            product.setUnitPrice(productDTO.getUnitPrice());
            product.setBrand(productDTO.getBrand());
            product.setProductName(productDTO.getProductName());
            product.setCategory(optionalCategory.get());

            Product savedProduct = productRepository.save(product);

            Stock stock = new Stock();
            stock.setQuantity(productDTO.getQuantity());
            stock.setLowStockLimit(productDTO.getLowStockLimit());
            stock.setProduct(savedProduct);
            stock.setUser(optionalUser.get());

            stockRepository.save(stock);

            List<ProductImage> productImages = new ArrayList<>();
            int imageCount = 0;
            for (MultipartFile image : productDTO.getProductImages()) {
                if (image != null && !image.isEmpty()) {
                    imageCount += 1;

                    String fileName = UUID.randomUUID() + getExtension(image.getOriginalFilename());
                    Path uploadPath = Paths.get("uploads/images");

                    Files.createDirectories(uploadPath);
                    Path filePath = uploadPath.resolve(fileName);
                    Files.copy(
                            image.getInputStream(),
                            filePath,
                            StandardCopyOption.REPLACE_EXISTING
                    );

                    ProductImage productImage = new ProductImage();
                    productImage.setImageUrl("/uploads/images/" + fileName);
                    productImage.setProduct(savedProduct);

                    productImages.add(productImage);
                }
            }

            productImageRepository.saveAll(productImages);

            if (imageCount == 0) {
                throw new RayvoraException(400, "Please upload image");
            }

        } catch (IOException io) {
            throw new RayvoraException(500, "Failed to save image");

        } catch (Exception e) {
            log.error("Error in saveProduct() : " + e.getMessage());
            throw e;
        }
    }

    @Override
    @Transactional(rollbackFor = {Exception.class}, propagation = Propagation.REQUIRED)
    public void updateProduct(ProductDTO productDTO) {
        log.info("Execute updateProduct() dto {}", productDTO);
        try {
            Optional<Product> optionalProduct = productRepository.findById(productDTO.getProductId());
            if (optionalProduct.isEmpty())
                throw new RayvoraException(404, "Sorry, related product is not found!");

            Optional<Category> optionalCategory = categoryRepository.findById(productDTO.getCategoryId());
            if (optionalCategory.isEmpty())
                throw new RayvoraException(404, "Sorry, related category is not found!");

            Optional<Stock> optionalStock = stockRepository.findById(optionalProduct.get().getStock().getStockId());
            if (optionalStock.isEmpty()) {
                throw new RayvoraException(404, "Sorry, related stock is not found!");
            }

            Product product = optionalProduct.get();
            product.setProductName(productDTO.getProductName());
            product.setDescription(productDTO.getDescription());
            product.setUnitPrice(productDTO.getUnitPrice());
            product.setBrand(productDTO.getBrand());
            product.setProductName(productDTO.getProductName());
            product.setCategory(optionalCategory.get());
            productRepository.save(product);

            Stock stock = optionalStock.get();
            stock.setQuantity(productDTO.getQuantity());
            stock.setLowStockLimit(productDTO.getLowStockLimit());
            stockRepository.save(stock);

        } catch (Exception e) {
            log.error("Error in updateProduct() : " + e.getMessage());
            throw e;
        }
    }

    @Override
    public void updateActiveStatus(long productId) {
        log.info("Execute updateActiveStaus() id {}", productId);
        try {
            Optional<Product> optionalProduct = productRepository.findById(productId);
            if (optionalProduct.isEmpty())
                throw new RayvoraException(404, "Sorry, relatedProduct is not found!");

            Product product = optionalProduct.get();
            product.setStatus(Status.INACTIVE);
            productRepository.save(product);

        } catch (Exception e) {
            log.error("Error in updateActiveStaus() : " + e.getMessage());
            throw e;
        }
    }

    @Override
    public ResponseProductDTO getProductById(long productId) {
        log.info("Execute getProductById() id {}", productId);
        try {
            Optional<Product> optionalProduct = productRepository.findById(productId);
            if (optionalProduct.isEmpty()) {
                throw new RayvoraException(404, "Sorry related product is not found!");
            }
            Product product = optionalProduct.get();
            if (product.getStatus().equals(Status.INACTIVE)) {
                throw new RayvoraException(404, "Product is no longer available.");
            }

            return getResponseProductDTO(product);

        } catch (Exception e) {
            log.error("Error in getProductById() : " + e.getMessage());
            throw e;
        }
    }

    @Override
    public Page<ResponseProductDTO> getProductBySellerAndCategoryName(int page, int size, Long sellerId, String categoryName) {
        log.info("Execute getProductByCategoryName() sellerId {}, categoryName {}", sellerId, categoryName);
        try {
            String passingCategoryName = categoryName;
            if (categoryName.equalsIgnoreCase("All")) {
                passingCategoryName = "ALL";
            }

            Pageable pageable = PageRequest.of(
                    page,
                    size,
                    Sort.by(Sort.Direction.DESC, "createdAt")
            );

            Page<Product> products = productRepository.searchProductsBySellerAndCategoryName(sellerId, passingCategoryName, pageable);

            return products.map(this::getResponseProductDTO);

        } catch (Exception e) {
            log.error("Error in getProductByCategoryName() : " + e.getMessage());
            throw e;
        }
    }

    @Override
    public List<ResponseProductDTO> getLowStockProducts() {
        log.info("Execute getLowStockProducts()");
        try {
            List<Product> allProducts = productRepository.findAllByStatus(Status.ACTIVE);
            List<ResponseProductDTO> lowStockProducts = new ArrayList<>();
            for (Product product : allProducts) {
                if (product.getStock().getQuantity() <= product.getStock().getLowStockLimit()) {
                    ResponseProductDTO responseProductDTO = getResponseProductDTO(product);
                    lowStockProducts.add(responseProductDTO);
                }
            }

            return lowStockProducts;

        } catch (Exception e) {
            log.error("Error in getLowStockProducts() : " + e.getMessage());
            throw e;
        }
    }

    @Override
    public Page<ResponseProductDTO> getAllProducts(int page, int size) {
        log.info("Execute getAllProducts()");
        try {
            Pageable pageable = PageRequest.of(
                    page,
                    size,
                    Sort.by(Sort.Direction.DESC, "createdAt")
            );

            Page<Product> allProducts = productRepository.findByStatus(Status.ACTIVE, pageable);

            return allProducts.map(this::getResponseProductDTO);

        } catch (Exception e) {
            log.error("Error in getAllProducts() : " + e.getMessage());
            throw e;
        }
    }

    @Override
    public Page<ResponseProductDTO> searchProductsByName(int page, int size, String productName) {
        log.info("Execute searchProductsByName() productName {}", productName);
        try {
            Pageable pageable = PageRequest.of(
                    page,
                    size,
                    Sort.by(Sort.Direction.DESC, "createdAt")
            );

            Page<Product> searchedProducts = productRepository.searchProductsByProductName(productName, pageable);

            return searchedProducts.map(this::getResponseProductDTO);

        } catch (Exception e) {
            log.error("Error in searchProductsByName() : " + e.getMessage());
            throw e;
        }
    }

    @Override
    public Page<ResponseProductDTO> searchProductsByNameWithSeller(int page, int size, Long sellerId, String productName) {
        log.info("Execute searchProductsByNameWithSeller() sellerId {}, productName {}", sellerId, productName);
        try {
            Pageable pageable = PageRequest.of(
                    page,
                    size,
                    Sort.by(Sort.Direction.DESC, "createdAt")
            );

            Page<Product> searchedProducts = productRepository
                    .searchProductsByProductNameWithSeller(sellerId, productName, pageable);

            return searchedProducts.map(this::getResponseProductDTO);

        } catch (Exception e) {
            log.error("Error in searchProductsByNameWithSeller() : " + e.getMessage());
            throw e;
        }
    }

    @Override
    public Page<ResponseProductDTO> filterPriceAscOrDesc(int page, int size, String direction) {
        log.info("Execute filterPriceAscOrDesc() direction {}", direction);
        try {
            Sort.Direction sortDirection =
                    direction.equalsIgnoreCase("ASC") ? Sort.Direction.ASC : Sort.Direction.DESC;

            Pageable pageable = PageRequest.of(
                    page,
                    size,
                    Sort.by(sortDirection, "unitPrice")
            );

            Page<Product> sortedProducts = productRepository.findByStatus(Status.ACTIVE, pageable);

            return sortedProducts.map(this::getResponseProductDTO);

        } catch (Exception e) {
            log.error("Error in filterPriceAscOrDesc() : " + e.getMessage());
            throw e;
        }
    }

    @Override
    public Page<ResponseProductDTO> filterProducts(
            int page, int size,
            String searchedProductName,
            String categoryName,
            BigDecimal startPrice,
            BigDecimal lastPrice
    ) {
        log.info("Execute filterProducts() searchedProductName {}, categoryName {}, startPrice {}, lastPrice {}",
                searchedProductName,
                categoryName,
                startPrice,
                lastPrice);
        try {
            String productNameArgument = "";
            String categoryNameArgument = "";
            if (searchedProductName.isEmpty()) {
                productNameArgument = null;

            } else {
                productNameArgument = searchedProductName;
            }

            if (categoryName.isEmpty()) {
                categoryNameArgument = null;

            } else {
                categoryNameArgument = categoryName;
            }

            Pageable pageable = PageRequest.of(
                    page,
                    size,
                    Sort.by(Sort.Direction.DESC, "createdAt")
            );

            Page<Product> filteredProducts =
                    productRepository.filterProducts(productNameArgument, categoryNameArgument, startPrice, lastPrice, pageable);

            return filteredProducts.map(this::getResponseProductDTO);

        } catch (Exception e) {
            log.error("Error in filterProducts() : " + e.getMessage());
            throw e;
        }
    }

    private @NonNull ResponseProductDTO getResponseProductDTO(Product product) {
        ResponseProductDTO responseProductDTO = new ResponseProductDTO();
        responseProductDTO.setProductId(product.getProductId());
        responseProductDTO.setProductName(product.getProductName());
        responseProductDTO.setDescription(product.getDescription());
        responseProductDTO.setUnitPrice(product.getUnitPrice());
        responseProductDTO.setBrand(product.getBrand());

        responseProductDTO.setCategoryName(product.getCategory().getCategoryName());
        responseProductDTO.setShopName(product.getStock().getUser().getAddress().getFullName());

        responseProductDTO.setQuantity(product.getStock().getQuantity());
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