import {registerAdmin} from "../api.js";


$(document).on('click', '#btnSubmitAdminRegister', function (e) {
    e.preventDefault();

    let object = {
        "username": $('#regUsername').val().trim(),
        "password": $('#regPassword').val().trim(),
        "userRoles": "ADMIN, SELLER, CUSTOMER",
        "firstName": $('#regFirstName').val().trim(),
        "lastName": $('#regLastName').val().trim(),
        "email": $('#regEmail').val().trim(),
        "contact": $('#regContact').val().trim(),
    };

    registerAdmin(object);
});