import {auth} from "./auth.js";
import {checkRole} from "./app.js";

const API_BASE_URL = "http://localhost:8080/api/v1";


// Users
const getUserRolesById = async (userId) => {
    try {
        const response = await $.ajax({
            url: API_BASE_URL + "/users/"+userId,
            type: "GET",
            contentType: 'application/json',
            headers: {
                "Authorization": "Bearer " + auth.getJWT()
            }
        });

        if (response.status === 404) {
            alert(response.message);
            return null;
        }

        if (response.status === 500) {
            alert(response.message);
            return null;
        }

        if (response.status === 0) {
            let roles = response.body.userRoles;
            let rolesArray = roles.split(",");

            return rolesArray[0].trim();
        }

    } catch (error) {
        alert("Something went wrong. Please try again.");
        return null;
    }
};

const userSignIn = (object) => {
    $.ajax({
        url: API_BASE_URL + "/users/signin",
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(object),

        success: function (response) {
            if (response.status === 400) {
                alert(response.message);
            }

            if (response.status === 401) {
                alert(response.message);
            }

            if (response.status === 404) {
                alert(response.message);
            }

            if (response.status === 500) {
                alert(response.message);
            }

            if (response.status === 0) {
                $('#username').val("");
                $('#password').val("");

                auth.saveSession(response);
                void checkRole();
            }
        },

        error: function (response) {
            alert("Something went wrong. Please try again.");
        }
    });
};

const signUpCustomer = (object) => {
    $.ajax({
        url: API_BASE_URL + "/users/signup",
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(object),

        success: function(response) {
            if (response.status === 400) {
                alert(response.message);
            }

            if (response.status === 409) {
                alert(response.message);
            }

            if (response.status === 500) {
                alert(response.message);
            }

            if (response.status === 0) {
                $('#username').val("");
                $('#password').val("");
                $('#firstName').val("");
                $('#lastName').val("");
                $('#email').val("");
                $('#contact').val("");
                $('#confirmPassword').val("");

                alert("Registration successfully!");
            }
        },

        error: function (response) {
            alert("Something went wrong. Please try again.");
        }
    });
};

const signUpSeller = (object) => {
    $.ajax({
        url: API_BASE_URL + "/users/signup",
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(object),

        success: function(response) {
            if (response.status === 400) {
                alert(response.message);
            }

            if (response.status === 409) {
                alert(response.message);
            }

            if (response.status === 500) {
                alert(response.message);
            }

            if (response.status === 0) {
                $('#usernameSeller').val("");
                $('#passwordSeller').val("");
                $('#firstNameSeller').val("");
                $('#lastNameSeller').val("");
                $('#emailSeller').val("");
                $('#contactSeller').val("");
                $('#confirmPasswordSeller').val("");

                $('#businessFullName').val("");
                $('#businessContact').val("");
                $('#street').val("");
                $('#city').val("");
                $('#district').val("");
                $('#province').val("");
                $('#zipCode').val("");
                $('#country').val("");

                alert("Registration successfully!");
            }
        },

        error: function (response) {
            alert("Something went wrong. Please try again.");
        }
    });
};

const registerAdmin = (object) => {
    return $.ajax({
        url: API_BASE_URL + "/users/signup",
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(object),

        success: function(response) {
            if (response.status === 400) {
                alert(response.message);
            }

            if (response.status === 409) {
                alert(response.message);
            }

            if (response.status === 500) {
                alert(response.message);
            }

            if (response.status === 0) {
                $('#regUsername').val("");
                $('#regPassword').val("");
                $('#regFirstName').val("");
                $('#regLastName').val("");
                $('#regEmail').val("");
                $('#regContact').val("");

                alert("Registration successfully!");
            }
        },

        error: function (response) {
            alert("Something went wrong. Please try again.");
        }
    });
};

const getAllUsers = async (role) => {
    const queryParam = $.param({
        "role": role
    });

    try {
        const response = await $.ajax({
            url: API_BASE_URL + "/users?" + queryParam,
            type: 'GET',
            contentType: 'application/json',
            headers: {
                'Authorization': 'Bearer ' + auth.getJWT()
            }
        });

        if (response.status === 500) {
            alert(response.message);
            return null;
        }

        if (response.status === 0) {
            return response.body;
        }

    } catch (error) {
        alert("Something went wrong. Please try again.");
        return null;
    }
};

const searchUserByEmail = async (role, email) => {
    const queryParam = $.param({
        "role": role,
        "email": email
    });

    try {
        const response = await $.ajax({
            url: API_BASE_URL + "/users/filter-email?" + queryParam,
            type: 'GET',
            contentType: 'application/json',
            headers: {
                'Authorization': 'Bearer ' + auth.getJWT()
            }
        });

        if (response.status === 500) {
            alert(response.message);
            return null;
        }

        if (response.status === 0) {
            return response.body;
        }

    } catch (error) {
        alert("Something went wrong. Please try again.");
        return null;
    }
};

const updateAdmin = (object) => {
    return $.ajax({
        url: API_BASE_URL + "/users",
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(object),
        headers: {
            'Authorization': 'Bearer ' + auth.getJWT()
        },

        success: function(response) {
            if (response.status === 400) {
                alert(response.message);
            }

            if (response.status === 409) {
                alert(response.message);
            }

            if (response.status === 500) {
                alert(response.message);
            }

            if (response.status === 0) {
                $('#regUsername').val("");
                $('#regFirstName').val("");
                $('#regLastName').val("");
                $('#regEmail').val("");
                $('#regContact').val("");

                $('#updateAdminBtn').css({display: "none"});
                $('#btnSubmitAdminRegister').css({display: "block"});
                $('#regPassword').prop('disabled', false);

                alert("Admin is updated successfully!");
            }
        },

        error: function (response) {
            alert("Something went wrong. Please try again.");
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
        },

        success: function (response) {
            if (response.status === 404) {
                alert(response.message);
            }

            if (response.status === 500) {
                alert(response.message);
            }

            if (response.status === 0) {
                alert("User is removed successfully!");
            }
        },

        error: function (response) {
            alert("Something went wrong. Please try again.");
        }
    });
};


// Categories
const getAllCategories = async () => {
    try {
        const response = await $.ajax({
            url: API_BASE_URL + "/categories",
            type: 'GET',
            contentType: 'application/json',
            headers: {
                'Authorization': 'Bearer ' + auth.getJWT()
            }
        });

        if (response.status === 500) {
            alert(response.message);
            return null;
        }

        if (response.status === 0) {
            return response.body;
        }

    } catch (error) {
        alert("Something went wrong. Please try again.");
        return null;
    }
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
        },

        success: function (response) {
            if (response.status === 400) {
                alert(response.message);
            }

            if (response.status === 500) {
                alert(response.message);
            }

            if (response.status === 0) {
                $('#categoryForm')[0].reset();

                $('#categoryImagePreview')
                    .attr('src', '')
                    .hide();

                $('#fileUploadPlaceholder').show();

                alert("Category is added successfully!");
            }
        },

        error: function (response) {
            alert("Something went wrong. Please try again.");
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
        },

        success: function (response) {
            if (response.status === 404) {
                alert(response.message);
            }

            if (response.status === 500) {
                alert(response.message);
            }

            if (response.status === 0) {
                alert("Category is removed successfully!");
            }
        },

        error: function (response) {
            alert("Something went wrong. Please try again.");
        }
    });
};





export {
    getUserRolesById,
    userSignIn,
    signUpCustomer,
    signUpSeller,
    registerAdmin,
    getAllUsers,
    updateAdmin,
    removeUser,
    searchUserByEmail,
    getAllCategories,
    addCategory,
    removeCategory
}