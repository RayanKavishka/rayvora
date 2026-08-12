import {router} from "../router.js";
import {signUpCustomer, signUpSeller} from "../api.js";

$(document).on('click', '#linkSignupCustomer', function() {
    router("signup-customer.html");
});

$(document).on('click', '#linkSignupSeller', function() {
    router("signup-seller.html");
});


// Customer signup
$(document).on('click', '#btnSubmitCustomerSignup', function () {
    const password = $('#password').val().trim();
    const confirmedPassword = $('#confirmPassword').val().trim();

    if (password !== confirmedPassword) {
        alert("Your password not matched with confirm password!");
        return;
    }

    let object = {
        "username": $('#username').val().trim(),
        "password": password,
        "userRoles": "CUSTOMER",
        "firstName": $('#firstName').val().trim(),
        "lastName": $('#lastName').val().trim(),
        "email": $('#email').val().trim(),
        "contact": $('#contact').val().trim(),
    };

    signUpCustomer(object);
});


// Seller signup
$(document).on('click', '#btnSubmitSellerSignup', function () {
    const password = $('#passwordSeller').val().trim();
    const confirmedPassword = $('#confirmPasswordSeller').val().trim();

    if (password !== confirmedPassword) {
        alert("Your password not matched with confirm password!");
        return;
    }

    let object = {
        "username": $('#usernameSeller').val().trim(),
        "password": password,
        "userRoles": "SELLER",
        "firstName": $('#firstNameSeller').val().trim(),
        "lastName": $('#lastNameSeller').val().trim(),
        "email": $('#emailSeller').val().trim(),
        "contact": $('#contactSeller').val().trim(),
        "addressDTO": {
            "fullName": $('#businessFullName').val().trim(),
            "contact": $('#businessContact').val().trim(),
            "street": $('#street').val().trim(),
            "city": $('#city').val().trim(),
            "district": $('#district').val().trim(),
            "province": $('#province').val().trim(),
            "zipCode": $('#zipCode').val().trim(),
            "country": $('#country').val().trim()
        }
    };

    signUpSeller(object);
});


$(document).on('click', '#linkToLogin', function () {
    router("login.html");
});