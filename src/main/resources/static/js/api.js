import {auth} from "./auth.js";

const API_BASE_URL = "http://localhost:8080/api/v1";


// Users
const getUserById = (userId) => {
    return $.ajax({
        url: API_BASE_URL + "/users/"+userId,
        type: "GET",
        contentType: 'application/json',
        headers: {
            "Authorization": "Bearer " + auth.getJWT()
        }
    });
};

const userSignIn = (object) => {
    return $.ajax({
        url: API_BASE_URL + "/users/signin",
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(object)
    });
};

const signUpCustomer = (object) => {
    return $.ajax({
        url: API_BASE_URL + "/users/signup",
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(object)
    });
};

const signUpSeller = (object) => {
    return $.ajax({
        url: API_BASE_URL + "/users/signup",
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(object)
    });
};

const registerAdmin = (object) => {
    return $.ajax({
        url: API_BASE_URL + "/users/signup",
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(object)
    });
};

const getAllUsers = (role) => {
    let queryParam = $.param({
        "role": role
    });

    return $.ajax({
        url: API_BASE_URL + "/users?" + queryParam,
        type: 'GET',
        contentType: 'application/json',
        headers: {
            'Authorization': 'Bearer ' + auth.getJWT()
        }
    });
};

const searchUserByEmail = (role, email) => {
    let queryParam = $.param({
        "role": role,
        "email": email
    });

    return $.ajax({
        url: API_BASE_URL + "/users/filter-email?" + queryParam,
        type: 'GET',
        contentType: 'application/json',
        headers: {
            'Authorization': 'Bearer ' + auth.getJWT()
        }
    });
};

const updateUser = (object) => {
    return $.ajax({
        url: API_BASE_URL + "/users",
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(object),
        headers: {
            'Authorization': 'Bearer ' + auth.getJWT()
        }
    });
};

const removeUser = (userId) => {
    return $.ajax({
        url: API_BASE_URL + "/users/"+userId,
        type: 'DELETE',
        contentType: 'application/json',
        headers: {
            'Authorization': 'Bearer ' + auth.getJWT()
        }
    });
};


const changePassword = (object) => {
    console.log("Api called");
    return $.ajax({
        url: API_BASE_URL + "/users/change-password",
        type: 'PATCH',
        contentType: 'application/json',
        data: JSON.stringify(object),
        headers: {
            'Authorization': 'Bearer ' + auth.getJWT()
        }
    });
}


// Addresses
const getAddressByCustomerId = (userId) => {
    return $.ajax({
        url: API_BASE_URL + "/addresses/"+userId,
        type: 'GET',
        contentType: 'application/json',
        headers: {
            'Authorization': 'Bearer ' + auth.getJWT()
        }
    });
};


const saveAddress = (object) => {
    return $.ajax({
        url: API_BASE_URL + "/addresses",
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(object),
        headers: {
            'Authorization': 'Bearer ' + auth.getJWT()
        }
    });
};


const updateAddress = (object) => {
    return $.ajax({
        url: API_BASE_URL + "/addresses",
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(object),
        headers: {
            'Authorization': 'Bearer ' + auth.getJWT()
        }
    });
};


// Categories
const getAllCategories = () => {
    return $.ajax({
        url: API_BASE_URL + "/categories",
        type: 'GET',
        contentType: 'application/json',
        headers: {
            'Authorization': 'Bearer ' + auth.getJWT()
        }
    });
};


const addCategory = (form) => {
    let formData = new FormData(form);

    return $.ajax({
        url: API_BASE_URL + "/categories",
        type: 'POST',
        contentType: false,
        processData: false,
        data: formData,
        headers: {
            'Authorization': 'Bearer ' + auth.getJWT()
        }
    });
};


const removeCategory = (categoryId) => {
    return $.ajax({
        url: API_BASE_URL + "/categories/"+categoryId,
        type: 'DELETE',
        contentType: 'application/json',
        headers: {
            'Authorization': 'Bearer ' + auth.getJWT()
        }
    });
};



// Products
const saveProduct = (form) => {
    let formData = new FormData(form);
    formData.append("userId", auth.getUserId());

    return $.ajax({
        url: API_BASE_URL + "/products",
        type: 'POST',
        contentType: false,
        processData: false,
        data: formData,
        headers: {
            'Authorization': 'Bearer ' + auth.getJWT()
        }
    });
};


const updateProduct = (form) => {
    let formData = new FormData(form);
    formData.append("userId", auth.getUserId());

    return $.ajax({
        url: API_BASE_URL + "/products",
        type: 'PUT',
        contentType: false,
        processData: false,
        data: formData,
        headers: {
            'Authorization': 'Bearer ' + auth.getJWT()
        }
    });
};


const getProductsBySellerAndCategory = (sellerId, categoryName, page, size) => {
    let queryParam = $.param({
        "page": page,
        "size": size
    });

    return $.ajax({
        url: API_BASE_URL + `/products/${sellerId}/${categoryName}?`+queryParam,
        type: 'GET',
        contentType: 'application/json',
        headers: {
            'Authorization': 'Bearer ' + auth.getJWT()
        }
    });
};


const getLowStockProducts = () => {
    return $.ajax({
        url: API_BASE_URL + "/products",
        type: 'GET',
        contentType: 'appication/json',
        headers: {
            'Authorization': 'Bearer ' + auth.getJWT()
        }
    });
};


const getProductById = (productId) => {
    return $.ajax({
        url: API_BASE_URL + "/products/"+productId,
        type: 'GET',
        contentType: 'application/json',
        headers: {
            'Authorization': 'Bearer ' + auth.getJWT()
        }
    });
};


const removeProduct = (productId) => {
    return $.ajax({
        url: API_BASE_URL + "/products/"+productId,
        type: 'DELETE',
        contentType: 'application/json',
        headers: {
            'Authorization': 'Bearer ' + auth.getJWT()
        }
    });
};


const getSearchedProductsForSeller = (page, size, sellerId, productName) => {
    const queryParam = $.param({
        "page": page,
        "size": size,
        "sellerId": sellerId,
        "productName": productName
    });

    return $.ajax({
        url: API_BASE_URL + "/products/search-products-seller?"+queryParam,
        type: 'GET',
        contentType: 'application/json',
        headers: {
            'Authorization': 'Bearer ' + auth.getJWT()
        }
    });
};


const getSearchedProducts = (page, size, productName) => {
    const queryParam = $.param({
        "page": page,
        "size": size,
        "productName": productName
    });

    return $.ajax({
        url: API_BASE_URL + "/products/search-products?"+queryParam,
        type: 'GET',
        contentType: 'application/json',
        headers: {
            'Authorization': 'Bearer ' + auth.getJWT()
        }
    });
};


const getAllProducts = (page, size) => {
    const queryParam = $.param({
        "page": page,
        "size": size
    });

    return $.ajax({
        url: API_BASE_URL + "/products/all-products?"+queryParam,
        type: 'GET',
        contentType: 'application/json',
        headers: {
            'Authorization': 'Bearer ' + auth.getJWT()
        }
    });
};


const filterProducts = (page, size, searchedProductName, categoryName, startPrice, lastPrice) => {
    let params = {
        "page": page,
        "size": size,
        "searchedProductName": searchedProductName ? searchedProductName : "",
        "categoryName": categoryName ? categoryName : ""
    };

    if (startPrice !== null && startPrice !== undefined && startPrice !== "") {
        params.startPrice = startPrice;
    }

    if (lastPrice !== null && lastPrice !== undefined && lastPrice !== "") {
        params.lastPrice = lastPrice;
    }

    const queryParam = $.param(params);

    return $.ajax({
        url: API_BASE_URL + "/products/filter-products?"+queryParam,
        type: 'GET',
        contentType: 'application/json',
        headers: {
            'Authorization': 'Bearer ' + auth.getJWT()
        }
    });
};


const filterProductsByPriceDirection = (page, size, direction) => {
    const queryParam = $.param({
        "page": page,
        "size": size,
        "direction": direction
    });

    return $.ajax({
        url: API_BASE_URL + "/products/filter-products/prices-direction?"+queryParam,
        type: 'GET',
        contentType: 'application/json',
        headers: {
            'Authorization': 'Bearer ' + auth.getJWT()
        }
    });
};



// Cart
const addProductToCart = (cartDTO) => {
    return $.ajax({
        url: API_BASE_URL + "/carts",
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(cartDTO),
        headers: {
            'Authorization': 'Bearer ' + auth.getJWT()
        }
    });
};


const updateCartProductQty = (updateCartDTO) => {
    return $.ajax({
        url: API_BASE_URL + "/carts",
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(updateCartDTO),
        headers: {
            'Authorization': 'Bearer ' + auth.getJWT()
        }
    });
};


const getAllCartProducts = (userId) => {
    return $.ajax({
        url: API_BASE_URL + "/carts/"+userId,
        type: 'GET',
        contentType: 'application/json',
        headers: {
            'Authorization': 'Bearer ' + auth.getJWT()
        }
    });
};


const removeProductFromCartItems = (updateCartDTO) => {
    return $.ajax({
        url: API_BASE_URL + "/carts",
        type: 'DELETE',
        contentType: 'application/json',
        data: JSON.stringify(updateCartDTO),
        headers: {
            'Authorization': 'Bearer ' + auth.getJWT()
        }
    });
};



// Orders
const saveOrder = (object) => {
    return $.ajax({
        url: API_BASE_URL + "/orders",
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(object),
        headers: {
            'Authorization': 'Bearer ' + auth.getJWT()
        }
    });
};


const getAllOrdersBySeller = (sellerId) => {
    return $.ajax({
        url: API_BASE_URL + "/orders/sellers-orders/"+sellerId,
        type: 'GET',
        contentType: 'application/json',
        headers: {
            'Authorization': 'Bearer ' + auth.getJWT()
        }
    });
};


const getAllOrdersByCustomer = (customerId, orderStatus) => {
    return $.ajax({
        url: API_BASE_URL + "/orders/customers-orders/"+customerId+"/"+orderStatus,
        type: 'GET',
        contentType: 'application/json',
        headers: {
            'Authorization': 'Bearer ' + auth.getJWT()
        }
    });
};


const updateOrderStatusWithTime = (orderId, orderStatus) => {
    return $.ajax({
        url: API_BASE_URL + "/orders/"+orderId+"/"+orderStatus,
        type: 'PATCH',
        contentType: 'application/json',
        headers: {
            'Authorization': 'Bearer ' + auth.getJWT()
        }
    });
};



export {
    getUserById,
    userSignIn,
    signUpCustomer,
    signUpSeller,
    registerAdmin,
    getAllUsers,
    updateUser,
    removeUser,
    searchUserByEmail,
    getAddressByCustomerId,
    saveAddress,
    updateAddress,
    getAllCategories,
    addCategory,
    removeCategory,
    changePassword,
    saveProduct,
    updateProduct,
    getProductsBySellerAndCategory,
    getLowStockProducts,
    getProductById,
    removeProduct,
    getSearchedProductsForSeller,
    getSearchedProducts,
    getAllProducts,
    filterProducts,
    filterProductsByPriceDirection,
    addProductToCart,
    getAllCartProducts,
    updateCartProductQty,
    removeProductFromCartItems,
    saveOrder,
    getAllOrdersBySeller,
    getAllOrdersByCustomer,
    updateOrderStatusWithTime
}