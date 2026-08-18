package lk.ijse.rayvora.controller;

import jakarta.validation.Valid;
import lk.ijse.rayvora.constant.CommonResponse;
import lk.ijse.rayvora.constant.ResponseCode;
import lk.ijse.rayvora.constant.ResponseMessage;
import lk.ijse.rayvora.dto.ProductDTO;
import lk.ijse.rayvora.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;

@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
public class ProductController {
    private final ProductService productService;

    // Only seller
    @PostMapping(
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public CommonResponse saveProduct(@Valid @ModelAttribute ProductDTO productDTO) {
        productService.saveProduct(productDTO);
        return new CommonResponse(
                ResponseCode.OPERATION_SUCCESS,
                ResponseMessage.SUCCESS_MESSAGE
        );
    }

    // Only seller
    @PutMapping(
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public CommonResponse updateProduct(@Valid @ModelAttribute ProductDTO productDTO) {
        productService.updateProduct(productDTO);
        return new CommonResponse(
                ResponseCode.OPERATION_SUCCESS,
                ResponseMessage.SUCCESS_MESSAGE
        );
    }

    // Only seller
    @DeleteMapping(value = "/{productId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public CommonResponse updateActiveStatus(@PathVariable long productId) {
        productService.updateActiveStatus(productId);
        return new CommonResponse(
                ResponseCode.OPERATION_SUCCESS,
                ResponseMessage.SUCCESS_MESSAGE
        );
    }

    // Only seller
    @GetMapping(value = "/{sellerId}/{categoryName}", produces = MediaType.APPLICATION_JSON_VALUE)
    public CommonResponse getProductsBySellerAndCategory(
            @RequestParam(value = "page") int page,
            @RequestParam(value = "size") int size,
            @PathVariable long sellerId, @PathVariable String categoryName
    ) {
        return new CommonResponse(
                ResponseCode.OPERATION_SUCCESS,
                productService.getProductBySellerAndCategoryName(page, size, sellerId, categoryName),
                ResponseMessage.SUCCESS_MESSAGE
        );
    }

    // Only seller
    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public CommonResponse getLowStockProducts() {
        return new CommonResponse(
                ResponseCode.OPERATION_SUCCESS,
                productService.getLowStockProducts(),
                ResponseMessage.SUCCESS_MESSAGE
        );
    }

    // Only seller
    @GetMapping(value = "/search-products-seller", produces = MediaType.APPLICATION_JSON_VALUE)
    public CommonResponse searchProducts(
            @RequestParam(value = "page") int page,
            @RequestParam(value = "size") int size,
            @RequestParam(value = "sellerId") long sellerId,
            @RequestParam(value = "productName") String productName
    ) {
        return new CommonResponse(
                ResponseCode.OPERATION_SUCCESS,
                productService.searchProductsByNameWithSeller(page, size, sellerId, productName),
                ResponseMessage.SUCCESS_MESSAGE
        );
    }

    @GetMapping(value = "/{productId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public CommonResponse getProductById(@PathVariable long productId) {
        return new CommonResponse(
                ResponseCode.OPERATION_SUCCESS,
                productService.getProductById(productId),
                ResponseMessage.SUCCESS_MESSAGE
        );
    }

    @GetMapping(value = "/all-products", produces = MediaType.APPLICATION_JSON_VALUE)
    public CommonResponse getAllProducts(
            @RequestParam(value = "page") int page,
            @RequestParam(value = "size") int size
    ) {
        return new CommonResponse(
                ResponseCode.OPERATION_SUCCESS,
                productService.getAllProducts(page, size),
                ResponseMessage.SUCCESS_MESSAGE
        );
    }

    @GetMapping(value = "/search-products", produces = MediaType.APPLICATION_JSON_VALUE)
    public CommonResponse searchProducts(
            @RequestParam(value = "page") int page,
            @RequestParam(value = "size") int size,
            @RequestParam(value = "productName") String productName
    ) {
        return new CommonResponse(
               ResponseCode.OPERATION_SUCCESS,
               productService.searchProductsByName(page, size, productName),
               ResponseMessage.SUCCESS_MESSAGE
        );
    }

    @GetMapping(value = "/filter-products/prices-direction", produces = MediaType.APPLICATION_JSON_VALUE)
    public CommonResponse filterProductByPriceOrder(
            @RequestParam(value = "page") int page,
            @RequestParam(value = "size") int size,
            @RequestParam(value = "direction") String direction
    ) {
        return new CommonResponse(
                ResponseCode.OPERATION_SUCCESS,
                productService.filterPriceAscOrDesc(page, size, direction),
                ResponseMessage.SUCCESS_MESSAGE
        );
    }

    @GetMapping(value = "/filter-products", produces = MediaType.APPLICATION_JSON_VALUE)
    public CommonResponse filterProducts(
            @RequestParam(value = "page") int page,
            @RequestParam(value = "size") int size,
            @RequestParam(value = "searchedProductName", required = false) String searchedProductName,
            @RequestParam(value = "categoryName", required = false) String categoryName,
            @RequestParam(value = "startPrice", required = false) BigDecimal startPrice,
            @RequestParam(value = "lastPrice", required = false) BigDecimal lastPrice
    ) {
        return new CommonResponse(
                ResponseCode.OPERATION_SUCCESS,
                productService.filterProducts(
                        page, size,
                        searchedProductName,
                        categoryName,
                        startPrice,
                        lastPrice),
                ResponseMessage.SUCCESS_MESSAGE
        );
    }
}