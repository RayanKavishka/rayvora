import {router} from "../router.js";
import {signUpCustomer, signUpSeller} from "../api.js";

$(document).on('click', '#linkSignupCustomer', function() {
    router("signup-customer.html");
});

$(document).on('click', '#linkSignupSeller', function() {
    router("signup-seller.html");
});


// Customer signup
$(document).on('click', '#btnSubmitCustomerSignup', async function () {
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

    try {
        const response = await signUpCustomer(object);

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
            $('#username').val("");
            $('#password').val("");
            $('#firstName').val("");
            $('#lastName').val("");
            $('#email').val("");
            $('#contact').val("");
            $('#confirmPassword').val("");

            Alert.success("Registration successfully!");
        }

    } catch (error) {
        Alert.error("Something went wrong. Please try again.");
    }
});


// Seller signup
$(document).on('click', '#btnSubmitSellerSignup', async function () {
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

    try {
        const response = await signUpSeller(object);

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

            Alert.success("Registration successfully!");
        }

    } catch (error) {
        Alert.error("Something went wrong. Please try again.");
    }
});


$(document).on('click', '#linkToLogin', function () {
    router("login.html");
});