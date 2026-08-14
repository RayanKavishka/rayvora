import {router} from "../router.js";
import {changePassword, getUserById, updateUser} from "../api.js";
import {auth} from "../auth.js";
import {isValidContact, isValidEmail} from "../util/regex.js";


// Sales & Earnings
$(document).on('click', '#saleAndEarnings', function (e) {
    e.preventDefault();

    router("seller-dashboard.html");
});


// ======================================================================================================================


// Manage Products
$(document).on('click', '#manageProducts', function (e) {
    e.preventDefault();

    router("seller/manage-products.html");
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
        }

        if (response.status === 500) {
            Alert.error(response.message);
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
        Alert.error("Please fill in all seller details.");
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
        }

        if (response.status === 409) {
            Alert.error(response.message);
        }

        if (response.status === 500) {
            Alert.error(response.message);
        }

        if (response.status === 0) {
            Alert.success("Seller is updated successfully!");

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
        console.log("before");
        const response = await changePassword(object);
        console.log("after");

        if (response.status === 400) {
            Alert.error(response.message);
        }

        if (response.status === 401) {
            Alert.error(response.message);
        }

        if (response.status === 404) {
            Alert.error(response.message);
        }

        if (response.status === 500) {
            Alert.error(response.message);
        }

        if (response.status === 0) {
            $('#currentPassword').val("");
            $('#newPassword').val("");

            Alert.success("Password is changed successfully!");
        }

    } catch (error) {
        Alert.error("Something went wrong. Please try again.");
    }
})


// Handle cancel change password
$(document).on('click', '#btnCancelPasswordChange', function (e) {
    e.preventDefault();

    $('#currentPassword').val("");
    $('#newPassword').val("");
});