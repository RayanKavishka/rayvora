import {userSignIn} from "../api.js";
import {auth} from "../auth.js";

$(document).on('click', '#btnSubmitLogin', function () {
    let object = {
        "username": $('#username').val().trim(),
        "password": $('#password').val().trim()
    };

    userSignIn(object);
});

$(document).on('click', '#logoutBtn', function () {
    auth.logout();
});