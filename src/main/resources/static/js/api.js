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
    const queryParam = $.param({
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
    const queryParam = $.param({
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
    const formData = new FormData(form);

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
    getAllCategories,
    addCategory,
    removeCategory,
    changePassword
}