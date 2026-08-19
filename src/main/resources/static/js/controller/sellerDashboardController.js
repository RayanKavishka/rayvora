import {router} from "../router.js";
import {
    changePassword,
    getAllCategories, getProductById,
    getProductsBySellerAndCategory,
    getUserById,
    saveProduct, removeProduct, updateProduct,
    updateUser, getLowStockProducts, getSearchedProductsForSeller
} from "../api.js";
import {auth} from "../auth.js";
import {isValidContact, isValidEmail} from "../util/regex.js";


// Sales & Earnings
$(document).on('click', '#saleAndEarnings', function (e) {
    e.preventDefault();

    router("seller-dashboard.html");
});


// ======================================================================================================================


let currentProductPage = 0;
let totalProductPages = 0;
const PRODUCTS_PER_PAGE = 8;

let categoryBasedCurrentPage = 0;
let categoryBasedTotalProductPages = 0;

let searchedCurrentPage = 0;
let searchedTotalProductPages = 0;


// Manage Products
$(document).on('click', '#manageProducts', async function (e) {
    e.preventDefault();

    await router("seller/manage-products.html");

    // Fills categories into selection
    $('#productFormCategory').empty();

    try {
        const response = await getAllCategories();

        if (response.status === 500) {
            Alert.error(response.message);
            return;
        }

        if (response.status === 0) {
            let html = `<option value="" disabled selected>Select a category</option>`;

            response.body.forEach((category) => {
                html += `
                    <option value="${category.categoryId}">${category.categoryName}</option>
                `;
            });

            $('#productFormCategory').html(html);
        }

    } catch (error) {
        Alert.error("Something went wrong. Please try again.");
        return;
    }


    // Load category filter selection
    $('#productCategoryFilter').empty();
    try {
        const response = await getAllCategories();

        if (response.status === 500) {
            Alert.error(response.message);
            return;
        }

        if (response.status === 0) {
            let html = `<option value="All" selected>All Categories</option>`;

            response.body.forEach((category) => {
                html += `
                    <option value="${category.categoryName}">${category.categoryName}</option>
                `;
            });

            $('#productCategoryFilter').html(html);
        }

    } catch (error) {
        Alert.error("Something went wrong. Please try again.");
        return;
    }

    await loadProductsBySellerAndCategory();
    await loadLowStockProducts();
});


// Load products when changes selection
$(document).on('change', '#productCategoryFilter', async function () {
    await loadProductsBySellerAndCategory(0);
});

const getSelectedCategory = () => {
    if (!$('#productCategoryFilter').val().startsWith("All")) {
        return $('#productCategoryFilter').val();

    }
    return "All";
};


// Load products by category for relevant seller
const loadProductsBySellerAndCategory = async (page = 0) => {
    try {

        const sellerId = auth.getUserId();
        const categoryName = getSelectedCategory();

        const response = await getProductsBySellerAndCategory(
            sellerId,
            categoryName,
            page,
            PRODUCTS_PER_PAGE
        );

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

            categoryBasedCurrentPage = pageData.number;
            categoryBasedTotalProductPages = pageData.totalPages;

            currentProductPage = categoryBasedCurrentPage;
            totalProductPages = categoryBasedTotalProductPages;

            loadProducts(pageData.content);
            loadProductPagination();
        }

    } catch (error) {
        Alert.error("Something went wrong. Please try again");
        return;
    }
};

const loadProducts = (products) => {
    const productsGrid = $("#productsGrid");

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
        html += `
            <div class="category-card">
                <div class="category-card-image">
                    <img src="${product.imageUrls[0]}" alt="Rayvora SonicPro Headphones">
                </div>
                <div class="category-card-body">
                    <div class="category-card-meta-row">
                        <span class="product-brand-badge">${product.brand}</span>
                        <span class="product-sold-count"><i class="fa-solid fa-fire"></i>Sold ${product.soldCount}+</span>
                    </div>
                    <h4 class="category-card-title">${product.productName}</h4>
                    <p class="category-card-desc">${product.description}</p>
                    <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.4rem;">
                        Product ID: ${product.productId}
                    </p>
                    <p style="font-size: 0.9rem; font-weight: 800;">
                        LKR ${product.unitPrice} &nbsp;
                        <span style="font-weight: 600; color: var(--text-muted); font-size: 0.8rem;">
                            | Qty: ${product.quantity}
                        </span>
                    </p>
                </div>
                <div class="category-card-actions">
                    <button onclick="loadProductIntoForm(${product.productId})" type="button" class="btn btn-sm btn-outline btn-update-product">
                        <i class="fa-solid fa-pen"></i> Update
                    </button>
                    <button onclick="removeProduct(${product.productId})" type="button" class="btn btn-sm btn-orange btn-delete-product">
                        <i class="fa-solid fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `;
    });

    productsGrid.html(html);
};

const loadProductPagination = () => {
    let html = "";

    for (let i = (currentProductPage - 1); i < currentProductPage + 2; i++) {
        if (i !== -1) {
            html += `
            <span class="pagination-page ${i === currentProductPage ? "active" : ""}">
                ${i + 1}
            </span>
        `;
        }

    }
    $("#productsPageNumbers").html(html);

    $("#productsPrevBtn").prop(
        "disabled",
        currentProductPage === 0
    );

    $("#productsNextBtn").prop(
        "disabled",
        currentProductPage === totalProductPages - 1
    );
};

$(document).on("click", "#productsPrevBtn", async function () {
    if (currentProductPage > 0) {
        await loadProductsBySellerAndCategory(currentProductPage - 1);
    }
});

$(document).on("click", "#productsNextBtn", async function () {
    console.log("clicked");

    if (currentProductPage < totalProductPages - 1) {
        await loadProductsBySellerAndCategory(currentProductPage + 1);
    }
});


// Load low stock products
const loadLowStockProducts = async () => {

    const response = await getLowStockProducts();

    if (response.status === 500) {
        Alert.error(response.message);
        return;
    }

    if (response.status === 0) {
        $('#lowStockProductsGrid').html('');

        const products = response.body;

        let html = "";
        products.forEach((product) => {

            let classLabel = (product.quantity === 0) ? "badge badge-brown" : "badge badge-orange";
            let valueOfLabel = (product.quantity === 0) ? "OUT OF STOCK" : "LOW STOCK";

            html += `
                <div class="category-card" data-product-id="P-20211" data-category="electronics" data-page="1" style="border: 1.5px solid var(--c-orange);">
                    <div class="category-card-image" style="position: relative;">
                        <img src="${product.imageUrls[0]}" alt="Smart Watch Series 9">
                        <span class="${classLabel}" style="position: absolute; top: 0.6rem; left: 0.6rem;">${valueOfLabel}</span>
                    </div>
                    <div class="category-card-body">
                        <div class="category-card-meta-row">
                            <span class="product-brand-badge">${product.brand}</span>
                            <span class="product-sold-count"><i class="fa-solid fa-fire"></i> Sold ${product.soldCount}+</span>
                        </div>
                        <h4 class="category-card-title">${product.productName}</h4>
                        <p class="category-card-desc">${product.description}</p>
                        <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.4rem;">Product ID: ${product.productId}</p>
                        <p style="font-size: 0.9rem; font-weight: 800;">
                            LKR ${product.unitPrice} &nbsp;
                            <span style="font-weight: 600; color: var(--c-orange); font-size: 0.8rem;">
                                | Qty: ${product.quantity} (Limit: ${product.lowStockLimit})
                            </span>
                        </p>
                    </div>
                    <div class="category-card-actions">
                        <button onclick="loadProductIntoForm(${product.productId})" type="button" class="btn btn-sm btn-outline btn-update-product"><i class="fa-solid fa-pen"></i> Update</button>
                        <button onclick="removeProduct(${product.productId})" type="button" class="btn btn-sm btn-orange btn-delete-product"><i class="fa-solid fa-trash"></i> Delete</button>
                    </div>
                </div>
            `;

            if (product.lowStockLimit > 0) {
                $('#labelOfStocks').addClass("");
            }
        });

        $('#lowStockProductsGrid').html(html);
    }
};


// Load product into form for update
window.loadProductIntoForm = async function (productId) {
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


            let category = $('#productFormCategory option').filter((index, option) => {
                return $(option).text().trim() === product.categoryName;
            });
            $('#productFormCategory').val(category.val());

            $('#productFormId').val(product.productId);
            $('#productFormName').val(product.productName);
            $('#productFormDescription').val(product.description);
            $('#productFormPrice').val(product.unitPrice);
            $('#productFormBrand').val(product.brand);
            $('#productFormQuantity').val(product.quantity);
            $('#productFormLowStockLimit').val(product.lowStockLimit);

            $('#productImagesInput').prop('disabled', true);

            $('#btnSubmitProduct')
                .text("Update Product")
                .css({background: "var(--c-sky)"});
        }

    } catch (error) {
        Alert.error("Something went wrong. Please try again.");
        return;
    }
}


// Remove product
window.removeProduct = async (productId) => {
    Alert.confirm("Do you want to remove this product ?", async () => {
        try {
            const response = await removeProduct(productId);

            if (response.status === 404) {
                Alert.error(response.message);
                return;
            }

            if (response.status === 500) {
                Alert.error(response.message);
                return;
            }

            if (response.status === 0) {
                Alert.success("Category is removed successfully!");
                await loadProductsBySellerAndCategory(currentProductPage);
                await loadLowStockProducts();
            }

        } catch (error) {
            Alert.error("Something went wrong. Please try again.");
            return;
        }
    });
}


// Save or Update product
$(document).on('click', '#btnSubmitProduct', async function (e) {
    e.preventDefault();

    const buttonText = $('#btnSubmitProduct').text().trim();

    if (buttonText === "Save Product") {

        const form = $('#productForm')[0];

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const response = await saveProduct(form);

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
            $('#productForm')[0].reset();

            $('#productImagesPreviewGrid')
                .html('')
                .hide();
            $('#file-upload-placeholder').show();

            Alert.success("Product is saved successfully");
            await loadProductsBySellerAndCategory(currentProductPage);
        }
    }

    if (buttonText === "Update Product") {

        const form = $('#productForm')[0];


        if (!$('#productFormCategory').val()) {
            Alert.error("Please select a category.");
            return;
        }

        if (!$('#productFormName').val().trim()) {
            Alert.error("Please enter product name.");
            return;
        }

        if (!$('#productFormDescription').val().trim()) {
            Alert.error("Please enter product description.");
            return;
        }

        if (!$('#productFormPrice').val()) {
            Alert.error("Please enter unit price.");
            return;
        }

        if (!$('#productFormBrand').val().trim()) {
            Alert.error("Please enter brand.");
            return;
        }

        if (!$('#productFormQuantity').val()) {
            Alert.error("Please enter quantity.");
            return;
        }

        if (!$('#productFormLowStockLimit').val()) {
            Alert.error("Please enter low stock limit.");
            return;
        }


        const response = await updateProduct(form);

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
            $('#productForm')[0].reset();

            $('#productImagesPreviewGrid')
                .html('')
                .hide();
            $('#file-upload-placeholder').show();

            $('#btnSubmitProduct')
                .text("Save Product")
                .css({background: "var(--c-primary)"});

            $('#productImagesInput').prop('disabled', false);

            Alert.success("Product is updated successfully");
            await loadProductsBySellerAndCategory(currentProductPage);
            await loadLowStockProducts();
        }
    }
});


// Handle cancel btn
$(document).on('click', '#btnCancelProductForm', function (e) {
    e.preventDefault();

    if ($('#btnSubmitProduct') .text() === "Update Product") {
        $('#btnSubmitProduct')
            .text("Save Product")
            .css({background: "var(--c-primary)"});

        $('#productImagesInput').prop('disabled', false);
    }

    $('#productForm')[0].reset();
    $('#productImagesPreviewGrid')
        .html('')
        .hide();
});


// Handle images preview
$(document).on('change', '#productImagesInput', function (e) {
    e.preventDefault();

    let files = Array.from(this.files);

    if (!files) {
        $('#productImagesPreviewGrid').hide();
        $('#file-upload-placeholder').show();
        return;
    }

    files.forEach((file) => {
        if (!file.type.startsWith('image/')) {
            Alert.error("Please select only images.");
            return;
        }
    });

    let html = '';
    files.forEach((image) => {
        let imageUrl = URL.createObjectURL(image);

        html += `
            <div class="product-image-thumb" style="position: relative; width: 92px;">
                <img src="${imageUrl}" alt="Preview" style="width: 92px; height: 92px; border-radius: 10px; object-fit: cover;">
            </div>
        `;
    });
    $('#productImagesPreviewGrid')
        .html(html)
        .show();
    $('#file-upload-placeholder').hide();
})


// Handle search products in All products section
let searchedProduct = '';
$(document).on('input', '#productsSearchInput',function (e) {
    e.preventDefault();

    searchedProduct = $(this).val().trim();

    if (searchedProduct === '') {
        $("#productsGrid").html('');
        return;
    }

    loadSearchedProducts(0);
});

const loadSearchedProducts = async (page = 0) => {
    try {
        const response = await getSearchedProductsForSeller(page, PRODUCTS_PER_PAGE, auth.getUserId(), searchedProduct);

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

            searchedCurrentPage = pageData.number;
            searchedTotalProductPages = pageData.totalPages;

            currentProductPage = searchedCurrentPage;
            totalProductPages = searchedTotalProductPages;

            loadProducts(pageData.content);
            loadProductPagination();
        }

    } catch (error) {
        Alert.error("Something went wrong. Please try again");
        return;
    }
};


// Handle refresh button
$(document).on('click', '#productsRefreshBtn', async function (e) {
    e.preventDefault();

    $('#productsSearchInput').val("");
    await loadProductsBySellerAndCategory(0);
});


// ======================================================================================================================


// Customer Reviews
$(document).on('click', '#customerReviews', function (e) {
    e.preventDefault();

    router("seller/customer-reviews.html");
});


// ======================================================================================================================


// Profile & Address
$(document).on('click', '#profileAndAddress', function (e) {
    e.preventDefault();

    router("seller/profile-address.html");

    fillSellerDetails();
});


// Fill seller details
const fillSellerDetails = async () => {
    try {
        const response = await getUserById(auth.getUserId());

        if (response.status === 404) {
            Alert.error(response.message);
            return;
        }

        if (response.status === 500) {
            Alert.error(response.message);
            return;
        }

        if (response.status === 0) {
            const seller = response.body;
            const address = response.body.addressDTO;

            $('#sellerId').val(seller.userId);
            $('#sellerFirstName').val(seller.firstName);
            $('#sellerLastName').val(seller.lastName);
            $('#sellerEmail').val(seller.email);
            $('#sellerContact').val(seller.contact);

            $('#sellerBusinessName').val(address.fullName);
            $('#sellerBusinessContact').val(address.contact);
            $('#sellerStreet').val(address.street);
            $('#sellerCity').val(address.city);
            $('#sellerDistrict').val(address.district);
            $('#sellerProvince').val(address.province);
            $('#sellerZipCode').val(address.zipCode);
            $('#sellerCountry').val(address.country);
        }

    } catch (error) {
        Alert.error("Something went wrong. Please try again.");
        return;
    }
};


// Update seller
$(document).on('click', '#btnSaveSellerProfile', async function () {
    let object = {
        "userId": $('#sellerId').val().trim(),
        "userRoles": "SELLER",
        "firstName": $('#sellerFirstName').val().trim(),
        "lastName": $('#sellerLastName').val().trim(),
        "email": $('#sellerEmail').val().trim(),
        "contact": $('#sellerContact').val().trim(),
        "addressDTO": {
            "fullName": $('#sellerBusinessName').val().trim(),
            "contact": $('#sellerBusinessContact').val().trim(),
            "street": $('#sellerStreet').val().trim(),
            "city": $('#sellerCity').val().trim(),
            "district": $('#sellerDistrict').val().trim(),
            "province": $('#sellerProvince').val().trim(),
            "zipCode": $('#sellerZipCode').val().trim(),
            "country": $('#sellerCountry').val().trim()
        }
    };

    if (!object.firstName || !object.lastName || !object.email || !object.contact) {
        Alert.error("Please fill in all your details.");
        return;
    }

    if (!isValidEmail(object.email)) {
        Alert.error("Please enter a valid email address.");
        return;
    }

    if (!isValidContact(object.contact)) {
        Alert.error("Please enter a valid contact number.");
        return;
    }

    if (!object.addressDTO.fullName || !object.addressDTO.contact || !object.addressDTO.street ||
        !object.addressDTO.city || !object.addressDTO.district || !object.addressDTO.province ||
        !object.addressDTO.zipCode || !object.addressDTO.country) {
        Alert.error("Please fill in all business address details.");
        return;
    }

    if (!isValidContact(object.addressDTO.contact)) {
        Alert.error("Please enter a valid business contact number.");
        return;
    }

    try {
        const response = await updateUser(object);

        if (response.status === 400) {
            Alert.error(response.message);
            return;
        }

        if (response.status === 409) {
            Alert.error(response.message);
            return;
        }

        if (response.status === 500) {
            Alert.error(response.message);
            return;
        }

        if (response.status === 0) {
            Alert.success("Your details are updated successfully!");

            $("#sellerId").val("");
            $("#sellerFirstName").val("");
            $("#sellerLastName").val("");
            $("#sellerEmail").val("");
            $("#sellerContact").val("");

            $("#sellerBusinessName").val("");
            $("#sellerBusinessContact").val("");
            $("#sellerStreet").val("");
            $("#sellerCity").val("");
            $("#sellerDistrict").val("");
            $("#sellerProvince").val("");
            $("#sellerZipCode").val("");
            $("#sellerCountry").val("");

            fillSellerDetails();
        }

    } catch (error) {
        Alert.error("Something went wrong. Please try again.");
        return;
    }
});


// Change password
$(document).on('click', '#btnVerifyPassword', async function (e) {
    e.preventDefault();

    if ($('#currentPassword').val() === "" || $('#newPassword').val() === "") {
        Alert.error("Enter your current & new password to save.");
        return;
    }

    let object = {
        "userId": auth.getUserId(),
        "currentPassword": $('#currentPassword').val().trim(),
        "newPassword": $('#newPassword').val().trim()
    };

    if (object.newPassword.length < 8) {
        Alert.error("New password must be at least 6 characters long.");
        return;
    }

    if (object.newPassword === object.currentPassword) {
        Alert.error("New password must be different from current password.");
        return;
    }

    try {
        const response = await changePassword(object);

        if (response.status === 400) {
            Alert.error(response.message);
            return;
        }

        if (response.status === 401) {
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
            $('#currentPassword').val("");
            $('#newPassword').val("");

            Alert.success("Password is changed successfully!");
        }

    } catch (error) {
        Alert.error("Something went wrong. Please try again.");
        return;
    }
})


// Handle cancel change password
$(document).on('click', '#btnCancelPasswordChange', function (e) {
    e.preventDefault();

    $('#currentPassword').val("");
    $('#newPassword').val("");
});