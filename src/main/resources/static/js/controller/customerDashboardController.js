import {router} from "../router.js";
import {
    getAllCategories,
    getAllProducts,
    getSearchedProducts,
    filterProducts,
    filterProductsByPriceDirection
} from "../api.js";



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
    await router("customer-dashboard.html");
});


// Load categories into selection
const loadCategoriesIntoFilter = async () => {
    $("#filterCategorySelect").html(`<option value="">All Categories</option>`);

    try {
        const response = await getAllCategories();

        if (response.status === 500) {
            Alert.error(response.message);
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
    }

    if (response.status === 500) {
        Alert.error(response.message);
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
            <div class="product-card">
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
                    <button type="button" class="add-cart-btn"><i class="fa-solid fa-cart-plus"></i> Add to Cart</button>
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