import {router} from "../router.js";
import {
    getAllCategories,
    getAllProducts,
    getSearchedProducts,
    filterProducts,
    filterProductsByPriceDirection,
    getProductById, addProductToCart, getAllCartProducts, updateCartProductQty, removeProductFromCartItems, getUserById
} from "../api.js";
import {checkRole} from "../app.js";
import {auth} from "../auth.js";
import {fillCustomerDetails} from "./customerAccDashboardController.js";



const PRODUCTS_PER_PAGE = 20;

let currentProductPage = 0;
let totalProductPages = 0;

let currentContext = "dashboard";
let currentMode = "all";

let activeFilter = {categoryName: "", startPrice: null, lastPrice: null};
let activeSortDirection = "";
let currentSearchTerm = "";

let pendingSearchTerm = "";



$(document).on("pageRendered", async function () {

    if ($("#shopProductsGrid").length) {
        currentContext = "dashboard";
        currentMode = "all";
        activeFilter = {categoryName: "", startPrice: null, lastPrice: null};
        activeSortDirection = "";

        await loadCategoriesIntoFilter();
        await loadAllProducts(0);
    }

    if ($("#searchResultsGrid").length) {
        currentContext = "search";
        currentMode = "search";
        activeFilter = {categoryName: "", startPrice: null, lastPrice: null};
        activeSortDirection = "";

        $("#searchResultsInput").val(pendingSearchTerm);
        $("#searchResultsTerm").text(pendingSearchTerm);

        await loadCategoriesIntoFilter();
        await loadSearchResults(0, pendingSearchTerm);
    }
});



// Navigate to searched results
const goToSearchResults = async () => {
    const term = $("#searchInput").val().trim();

    if (term === "") {
        return;
    }

    pendingSearchTerm = term;
    await router("customer/search-results.html");
};

$(document).on("click", "#btnSearch", async function (e) {
    e.preventDefault();
    await goToSearchResults();
});

$(document).on("keypress", "#searchInput", async function (e) {
    if (e.key === "Enter") {
        e.preventDefault();
        await goToSearchResults();
    }
});


// Re searching in searched results page
$(document).on("click", "#btnSearchResultsSearch", async function (e) {
    e.preventDefault();

    const term = $("#searchResultsInput").val().trim();

    if (term === "") {
        return;
    }

    pendingSearchTerm = term;
    $("#searchResultsTerm").text(term);

    activeFilter = {categoryName: "", startPrice: null, lastPrice: null};
    activeSortDirection = "";

    await loadSearchResults(0, term);
});

$(document).on("keypress", "#searchResultsInput", async function (e) {
    if (e.key === "Enter") {
        e.preventDefault();
        $("#btnSearchResultsSearch").trigger("click");
    }
});


// Handle back button in searched results page
$(document).on("click", "#btnSearchResultsBack", async function (e) {
    e.preventDefault();
    await checkRole();
});


// Load categories into selection
const loadCategoriesIntoFilter = async () => {
    $("#filterCategorySelect").html(`<option value="">All Categories</option>`);

    try {
        const response = await getAllCategories();

        if (response.status === 500) {
            Alert.error(response.message);
            return;
        }

        if (response.status === 0) {
            let html = `<option value="">All Categories</option>`;

            response.body.forEach((category) => {
                html += `
                    <option value="${category.categoryName}">${category.categoryName}</option>
                `;
            });

            $("#filterCategorySelect").html(html);
        }

    } catch (error) {
        Alert.error("Something went wrong. Please try again.");
        return;
    }
};


// Loaders
const loadAllProducts = async (page = 0) => {
    currentMode = "all";

    try {
        const response = await getAllProducts(page, PRODUCTS_PER_PAGE);
        handleProductsPageResponse(response);

    } catch (error) {
        Alert.error("Something went wrong. Please try again");
        return;
    }
};


const loadFilteredProducts = async (page = 0) => {
    currentMode = "filter";

    try {
        const response = await filterProducts(
            page,
            PRODUCTS_PER_PAGE,
            currentContext === "search" ? currentSearchTerm : "",
            activeFilter.categoryName,
            activeFilter.startPrice,
            activeFilter.lastPrice
        );
        handleProductsPageResponse(response);

    } catch (error) {
        Alert.error("Something went wrong. Please try again");
        return;
    }
};


const loadSortedProducts = async (page = 0, direction = null) => {
    currentMode = "sort";

    if (direction) {
        activeSortDirection = direction;
    }

    try {
        const response = await filterProductsByPriceDirection(page, PRODUCTS_PER_PAGE, activeSortDirection);
        handleProductsPageResponse(response);

    } catch (error) {
        Alert.error("Something went wrong. Please try again");
        return;
    }
};


const loadSearchResults = async (page = 0, term = null) => {
    currentContext = "search";
    currentMode = "search";

    if (term !== null) {
        currentSearchTerm = term;
    }

    try {
        const response = await getSearchedProducts(page, PRODUCTS_PER_PAGE, currentSearchTerm);
        handleProductsPageResponse(response);

    } catch (error) {
        Alert.error("Something went wrong. Please try again");
        return;
    }
};


const reloadCurrentPage = async (page) => {
    if (currentMode === "all") {
        await loadAllProducts(page);

    } else if (currentMode === "filter") {
        await loadFilteredProducts(page);

    } else if (currentMode === "sort") {
        await loadSortedProducts(page);

    } else if (currentMode === "search") {
        await loadSearchResults(page);
    }
};


const handleProductsPageResponse = (response) => {
    if (response.status === 404) {
        Alert.error(response.message);
        return;
    }

    if (response.status === 500) {
        Alert.error(response.message);
        return;
    }

    if (response.status === 0) {
        const pageData = response.body;

        currentProductPage = pageData.number;
        totalProductPages = pageData.totalPages;

        loadProducts(pageData.content);
        loadProductPagination();
    }
};



// Load Products Card
const getAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) {
        return 0;
    }

    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return total / reviews.length;
};

const buildRatingStarsHtml = (rating) => {
    let html = "";

    for (let i = 1; i <= 5; i++) {
        if (rating >= i) {
            html += `<i class="fa-solid fa-star"></i>`;

        } else if (rating >= i - 0.5) {
            html += `<i class="fa-solid fa-star-half-stroke"></i>`;

        } else {
            html += `<i class="fa-regular fa-star"></i>`;
        }
    }

    return html;
};

const loadProducts = (products) => {
    const gridId = currentContext === "search" ? "#searchResultsGrid" : "#shopProductsGrid";
    const productsGrid = $(gridId);

    if (!products || products.length === 0) {
        productsGrid.html(`
            <div class="no-products">
                <p>No products found.</p>
            </div>
        `);
        return;
    }

    let html = "";
    products.forEach((product) => {
        const averageRating = getAverageRating(product.reviews);
        const reviewCount = product.reviews ? product.reviews.length : 0;
        const thumbnail = (product.imageUrls && product.imageUrls.length > 0)
            ? product.imageUrls[0]
            : "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80";

        html += `
            <div class="product-card" data-product-id="${product.productId}">
                <div class="product-thumb">
                    <img src="${thumbnail}" alt="${product.productName}">
                </div>
                <div class="product-details">
                    <div class="category-card-meta-row">
                        <span class="product-brand-badge">${product.brand}</span>
                        <span class="product-sold-count"><i class="fa-solid fa-fire"></i> Sold ${product.soldCount}+</span>
                    </div>
                    <h3 class="product-title">${product.productName}</h3>
                    <div class="rating-stars">
                        ${buildRatingStarsHtml(averageRating)}
                        <span class="rating-count">(${averageRating.toFixed(1)})${reviewCount ? ` &middot; ${reviewCount}` : ""}</span>
                    </div>
                    <div class="product-price-row">
                        <span class="current-price">LKR ${product.unitPrice}</span>
                    </div>
                    <button onclick="addToCart(${product.productId})" type="button" class="add-cart-btn"><i class="fa-solid fa-cart-plus"></i> Add to Cart</button>
                </div>
            </div>
        `;
    });

    productsGrid.html(html);
};


const loadProductPagination = () => {
    const prefix = currentContext === "search" ? "searchResults" : "shopProducts";

    let html = "";
    for (let i = (currentProductPage - 1); i < currentProductPage + 2; i++) {
        if (i !== -1 && i < totalProductPages) {
            html += `
                <span class="pagination-page ${i === currentProductPage ? "active" : ""}">
                    ${i + 1}
                </span>
            `;
        }
    }
    $(`#${prefix}PageNumbers`).html(html);

    $(`#${prefix}PrevBtn`).prop(
        "disabled",
        currentProductPage === 0
    );

    $(`#${prefix}NextBtn`).prop(
        "disabled",
        totalProductPages === 0 || currentProductPage === totalProductPages - 1
    );
};

$(document).on("click", "#shopProductsPrevBtn, #searchResultsPrevBtn", async function () {
    if (currentProductPage > 0) {
        await reloadCurrentPage(currentProductPage - 1);
    }
});

$(document).on("click", "#shopProductsNextBtn, #searchResultsNextBtn", async function () {
    if (currentProductPage < totalProductPages - 1) {
        await reloadCurrentPage(currentProductPage + 1);
    }
});


// Filter & Sort
$(document).on("click", "#btnOpenFilter", function (e) {
    e.preventDefault();
    e.stopPropagation();

    $("#sortDropdownPanel").removeClass("open");
    $("#filterDropdownPanel").toggleClass("open");
});

$(document).on("click", "#btnOpenSort", function (e) {
    e.preventDefault();
    e.stopPropagation();

    $("#filterDropdownPanel").removeClass("open");
    $("#sortDropdownPanel").toggleClass("open");
});


// Close dropdown using clicks anywhere
$(document).on("click", function (e) {
    if (!$(e.target).closest("#filterDropdownPanel, #btnOpenFilter").length) {
        $("#filterDropdownPanel").removeClass("open");
    }

    if (!$(e.target).closest("#sortDropdownPanel, #btnOpenSort").length) {
        $("#sortDropdownPanel").removeClass("open");
    }
});


$(document).on("click", "#filterDropdownPanel, #sortDropdownPanel", function (e) {
    e.stopPropagation();
});


// Apply filter
$(document).on("click", "#btnApplyFilter", async function (e) {
    e.preventDefault();

    activeFilter = {
        categoryName: $("#filterCategorySelect").val() || "",
        startPrice: $("#filterMinPrice").val().trim(),
        lastPrice: $("#filterMaxPrice").val().trim()
    };

    $("#filterDropdownPanel").removeClass("open");
    await loadFilteredProducts(0);
});


// Clear filter
$(document).on("click", "#btnClearFilter", async function (e) {
    e.preventDefault();

    $("#filterMinPrice").val("");
    $("#filterMaxPrice").val("");
    $("#filterCategorySelect").val("");

    activeFilter = {categoryName: "", startPrice: null, lastPrice: null};

    $("#filterDropdownPanel").removeClass("open");

    if (currentContext === "search") {
        await loadSearchResults(0);

    } else {
        await loadAllProducts(0);
    }
});


// Sort by price
$(document).on("click", "#sortLowToHighOption", async function (e) {
    e.preventDefault();

    $("#sortDropdownPanel").removeClass("open");
    $(".sort-option-item").removeClass("active-sort");
    $(this).addClass("active-sort");

    await loadSortedProducts(0, "ASC");
});

$(document).on("click", "#sortHighToLowOption", async function (e) {
    e.preventDefault();

    $("#sortDropdownPanel").removeClass("open");
    $(".sort-option-item").removeClass("active-sort");
    $(this).addClass("active-sort");

    await loadSortedProducts(0, "DESC");
});


// Handle product Details Card Pane
let pdImages = [];
let pdCurrentImageIndex = 0;


const injectProductDetailsModal = () => {
    if ($("#productDetailsModal").length) {
        return;
    }

    const modalHtml = `
        <div class="modal-overlay" id="productDetailsModal">
            <div class="product-details-modal-pane">
                <button type="button" class="modal-close-btn" id="btnCloseProductDetails" aria-label="Cancel">
                    <i class="fa-solid fa-xmark"></i> Cancel
                </button>

                <div class="product-details-modal-body">
                    <!-- Image Carousel -->
                    <div class="pd-carousel">
                        <div class="pd-carousel-track" id="pdCarouselTrack"></div>
                        <button type="button" class="pd-carousel-arrow pd-carousel-prev" id="pdCarouselPrev" aria-label="Previous image">
                            <i class="fa-solid fa-chevron-left"></i>
                        </button>
                        <button type="button" class="pd-carousel-arrow pd-carousel-next" id="pdCarouselNext" aria-label="Next image">
                            <i class="fa-solid fa-chevron-right"></i>
                        </button>
                        <div class="pd-carousel-dots" id="pdCarouselDots"></div>
                    </div>

                    <!-- Product Info -->
                    <div class="pd-info">
                        <div class="pd-info-top-row">
                            <span class="product-brand-badge" id="pdBrand"></span>
                            <span class="pd-shop-name"><i class="fa-solid fa-store"></i> <span id="pdShopName"></span></span>
                        </div>

                        <h2 class="pd-title" id="pdProductName"></h2>

                        <div class="pd-rating-row">
                            <div class="rating-stars" id="pdStars"></div>
                            <span class="rating-count" id="pdRatingCount"></span>
                        </div>

                        <div class="pd-price-row">
                            <span class="current-price" id="pdUnitPrice"></span>
                        </div>

                        <div class="pd-meta-grid">
                            <div class="pd-meta-item">
                                <i class="fa-solid fa-layer-group"></i>
                                <div>
                                    <span class="pd-meta-label">Category</span>
                                    <span class="pd-meta-value" id="pdCategoryName"></span>
                                </div>
                            </div>
                            <div class="pd-meta-item">
                                <i class="fa-solid fa-boxes-stacked"></i>
                                <div>
                                    <span class="pd-meta-label">Avl QTY</span>
                                    <span class="pd-meta-value" id="pdQuantity"></span>
                                </div>
                            </div>
                        </div>

                        <div class="pd-description">
                            <h4>Description</h4>
                            <p id="pdDescription"></p>
                        </div>

                        <div class="pd-reviews-section">
                            <h4>Customer Reviews</h4>
                            <div id="pdReviewsList" class="pd-reviews-list"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    $("body").append(modalHtml);
};


const renderPdCarousel = () => {
    let trackHtml = "";
    pdImages.forEach((image) => {
        trackHtml += `<div class="pd-carousel-slide"><img src="${image}" alt="Product image"></div>`;
    });
    $("#pdCarouselTrack").html(trackHtml);

    let dotsHtml = "";
    pdImages.forEach((image, index) => {
        dotsHtml += `<span class="pd-carousel-dot ${index === pdCurrentImageIndex ? "active" : ""}" data-index="${index}"></span>`;
    });
    $("#pdCarouselDots").html(dotsHtml);

    const hasMultipleImages = pdImages.length > 1;
    $("#pdCarouselPrev, #pdCarouselNext, #pdCarouselDots").toggleClass("pd-carousel-nav-hidden", !hasMultipleImages);

    updatePdCarouselPosition();
};


const updatePdCarouselPosition = () => {
    $("#pdCarouselTrack").css("transform", `translateX(-${pdCurrentImageIndex * 100}%)`);

    $(".pd-carousel-dot").removeClass("active");
    $(`.pd-carousel-dot[data-index="${pdCurrentImageIndex}"]`).addClass("active");
};


const renderPdReviews = (reviews) => {
    if (!reviews || reviews.length === 0) {
        $("#pdReviewsList").html(`<p class="pd-no-reviews">No reviews yet for this product.</p>`);
        return;
    }

    let html = "";
    reviews.forEach((review) => {
        const reviewDate = review.createdAt ? new Date(review.createdAt).toLocaleDateString() : "";

        html += `
            <div class="pd-review-item">
                <div class="pd-review-header">
                    <div class="rating-stars">${buildRatingStarsHtml(review.rating)}</div>
                    <span class="pd-review-date">${reviewDate}</span>
                </div>
                <p class="pd-review-comment">${review.comment}</p>
            </div>
        `;
    });

    $("#pdReviewsList").html(html);
};


const renderProductDetails = (product) => {
    pdImages = (product.imageUrls && product.imageUrls.length > 0)
        ? product.imageUrls
        : ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80"];
    pdCurrentImageIndex = 0;

    renderPdCarousel();

    $("#pdBrand").text(product.brand);
    $("#pdShopName").text(product.shopName);
    $("#pdProductName").text(product.productName);
    $("#pdUnitPrice").text(`LKR ${product.unitPrice}`);
    $("#pdCategoryName").text(product.categoryName);
    $("#pdQuantity").text(`${product.quantity} in stock`);
    $("#pdDescription").text(product.description);

    const averageRating = getAverageRating(product.reviews);
    const reviewCount = product.reviews ? product.reviews.length : 0;

    $("#pdStars").html(buildRatingStarsHtml(averageRating));
    $("#pdRatingCount").text(
        reviewCount
            ? `(${averageRating.toFixed(1)}) &middot; ${reviewCount} review${reviewCount > 1 ? "s" : ""}`
            : "No reviews yet"
    );

    renderPdReviews(product.reviews);
};


const closeProductDetailsModal = () => {
    $("#productDetailsModal").removeClass("open");
    $("body").removeClass("modal-open-lock");
};


const openProductDetailsModal = async (productId) => {
    injectProductDetailsModal();

    $("#productDetailsModal").addClass("open");
    $("body").addClass("modal-open-lock");

    $("#pdCarouselTrack").html(`<div class="pd-carousel-loading"><i class="fa-solid fa-spinner fa-spin"></i></div>`);
    $("#pdCarouselDots").empty();
    $("#pdProductName").text("Loading...");
    $("#pdDescription, #pdBrand, #pdShopName, #pdCategoryName, #pdQuantity, #pdUnitPrice, #pdStars, #pdRatingCount").empty();
    $("#pdReviewsList").empty();

    try {
        const response = await getProductById(productId);

        if (response.status === 404) {
            Alert.error(response.message);
            closeProductDetailsModal();
            return;
        }

        if (response.status === 500) {
            Alert.error(response.message);
            closeProductDetailsModal();
            return;
        }

        if (response.status === 0) {
            renderProductDetails(response.body);
        }

    } catch (error) {
        Alert.error("Something went wrong. Please try again");
        closeProductDetailsModal();
        return;
    }
};


// Open the pane
$(document).on("click", ".product-card", async function (e) {
    if ($(e.target).closest(".add-cart-btn").length) {
        return;
    }

    const productId = $(this).data("product-id");

    if (productId) {
        await openProductDetailsModal(productId);
    }
});


// Carousel controls
$(document).on("click", "#pdCarouselPrev", function () {
    pdCurrentImageIndex = (pdCurrentImageIndex - 1 + pdImages.length) % pdImages.length;
    updatePdCarouselPosition();
});

$(document).on("click", "#pdCarouselNext", function () {
    pdCurrentImageIndex = (pdCurrentImageIndex + 1) % pdImages.length;
    updatePdCarouselPosition();
});

$(document).on("click", ".pd-carousel-dot", function () {
    pdCurrentImageIndex = parseInt($(this).data("index"), 10);
    updatePdCarouselPosition();
});


// Close handlers
$(document).on("click", "#btnCloseProductDetails", function () {
    closeProductDetailsModal();
});

$(document).on("click", "#productDetailsModal", function (e) {
    if (e.target.id === "productDetailsModal") {
        closeProductDetailsModal();
    }
});

$(document).on("keydown", function (e) {
    if (e.key === "Escape" && $("#productDetailsModal").hasClass("open")) {
        closeProductDetailsModal();
    }
});


// ====================================================================================================================
// Manage cart


// Handle cart icon click and load cart products with total
$(document).on('click', '#cartNavBtn', function (e) {
    e.preventDefault();

    router("customer/cart-view.html")
    loadCartProductsAndCount();
});


const loadCartProductsAndCount = async () => {
    try {
        const response = await getAllCartProducts(auth.getUserId());

        if (response.status === 404) {
            Alert.error(response.message);
            return;
        }

        if (response.status === 500) {
            Alert.error(response.message);
            return;
        }

        if (response.status === 0) {
            const products = response.body.cartProduct;

            $('#cartItemsList').html('');

            let html = '';
            let productsCount = 0;
            let totalAmount = 0.0;
            products.forEach((product) => {

                html += `
                    <div class="cart-item-row" data-cart-item-id="${product.productId}">
                        <div class="cart-item-thumb">
                          <img src="${product.cartProductImageUrl}" alt="${product.productName}-image">
                        </div>
            
                        <div class="cart-item-info">
                          <h4 class="cart-item-name">${product.productName}</h4>
                          <span class="cart-item-seller"><i class="fa-solid fa-store"></i> ${product.shopName}</span>
                          <span class="cart-item-price">LKR ${product.unitPrice}</span>
                        </div>
            
                        <div class="cart-item-actions">
                            <div class="qty-stepper">
                                <button onclick="updateCartProductQty(${product.productId}, 'Minus')" type="button" class="qty-btn qty-minus-btn" aria-label="Decrease quantity">
                                    <i class="fa-solid fa-minus"></i>
                                </button>
                                    <span class="qty-value">${product.quantity}</span>
                                <button onclick="updateCartProductQty(${product.productId}, 'Plus')" type="button" class="qty-btn qty-plus-btn" aria-label="Increase quantity">
                                    <i class="fa-solid fa-plus"></i>
                                </button>
                            </div>
            
                            <button onclick="removeProductFromCart(${product.productId})" type="button" class="cart-item-delete-btn" aria-label="Remove item">
                                <i class="fa-solid fa-trash-can"></i>
                            </button>
                        </div>
                    </div>
                `;


                // Calculate count
                if (product.productId !== null) {
                    productsCount += 1;
                }

                // Calculate total
                totalAmount += (product.unitPrice * product.quantity);
            });

            $('#cartItemsList').html(html);

            let formattedTotAmount = Number(totalAmount).toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });

            $('#cartTotal').text("LKR " + formattedTotAmount);
            $('#cartSubtotal').text("LKR " + formattedTotAmount);

            $('#productsCountInCartView').text(productsCount);
            $('#cartItemCount').text(productsCount + " Items");
        }

    } catch (error) {
        Alert.error("Something went wrong. Please try again.")
        return;
    }
}


// Handle add cart, when btn clicks
window.addToCart = async function (productId) {
    try {
        const response = await addProductToCart({
            "userId": auth.getUserId(),
            "product": {
                "productId": productId,
                "quantity": 1
            }
        });

        if (response.status === 404) {
            Alert.error(response.message);
            return;
        }

        if (response.status === 500) {
            Alert.error(response.message)
            return;
        }

        if (response.status === 0) {
            let cartProductsCount = $('#cartProductsCountOnIcon').text();
            $('#cartProductsCountOnIcon').text(Number(cartProductsCount) + 1);

            Alert.success("Added to cart!");
        }

    } catch (error) {
        Alert.error("Something went wrong. Please try again.")
        return;
    }
};


// Handle Plus And Minus button in cart item
window.updateCartProductQty = async function (productId, action) {
    const cartItem = $(`.cart-item-row[data-cart-item-id="${productId}"]`);

    let currentQty = Number(cartItem.find('.qty-value').text());

    if (action === 'Minus') {
        if (currentQty === 1) {
            Alert.warning("Quantity can't go below 1.");
            return;
        }

        currentQty -= 1;
    }

    if (action === 'Plus') {
        try {
            const response = await getProductById(productId);

            if (response.status === 404) {
                Alert.error(response.message);
                return;
            }

            if (response.status === 500) {
                Alert.error(response.message);
                return;
            }

            if (response.status === 0) {
                const product = response.body;

                if (currentQty === product.quantity) {
                    Alert.warning("Not enough stock available.");
                    return;
                }

                currentQty += 1;
            }

        } catch (error) {
            Alert.error("Something went wrong. Please try again.");
            return;
        }
    }

    const response = await updateCartProductQty({
        "productId": productId,
        "quantity": currentQty,
        "userId": auth.getUserId()
    });

    if (response.status === 400) {
        Alert.error(response.message);
        return;
    }

    if (response.status === 404) {
        Alert.error(response.message);
        return;
    }

    if (response.status === 500) {
        Alert.error(response.message);
        return;
    }

    if (response.status === 0) {
        cartItem.find('.qty-value').text(currentQty);

        let newTotal = 0.0;
        $('.cart-item-row').toArray().forEach((cartItem) => {
            let quantity = Number(
                $(cartItem).find('.qty-value').text()
            );
            let unitPrice = Number(
                $(cartItem).find('.cart-item-price').text().replace("LKR ", "")
            );

            newTotal += quantity * unitPrice;
        });

        let formattedTotAmount = Number(newTotal).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

        $('#cartTotal').text("LKR " + formattedTotAmount);
        $('#cartSubtotal').text("LKR " + formattedTotAmount);
    }
};


// Handle remove btn in cart item
window.removeProductFromCart = async function (productId) {

    const response = await removeProductFromCartItems({
        "productId": productId,
        "userId": auth.getUserId()
    });

    if (response.status === 400) {
        Alert.error(response.message);
        return;
    }

    if (response.status === 404) {
        Alert.error(response.message);
        return;
    }

    if (response.status === 500) {
        Alert.error(response.message);
        return;
    }

    if (response.status === 0) {
        Alert.success("Product is removed from cart");
        loadCartProductsAndCount();
    }
};


// Handle back btn in cart view
$(document).on('click', '#btnCartBack', function (e) {
    e.preventDefault();

    checkRole();
});


// Handle customer profile nav
$(document).on('click', '#customerProfileNav', function (e) {
    e.preventDefault();

    router("customer/account/customer-account.html");
    fillCustomerDetails();
});