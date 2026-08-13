import {userSignIn} from "../api.js";
import {auth} from "../auth.js";
import {checkRole} from "../app.js";

$(document).on('click', '#btnSubmitLogin', async function () {
    let object = {
        "username": $('#username').val().trim(),
        "password": $('#password').val().trim()
    };

    try {
        const response = await userSignIn(object);

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
            auth.saveSession(response);
            await checkRole();

            $('#username').val("");
            $('#password').val("");
        }

    } catch (error) {
        Alert.error("Something went wrong. Please try again.");
    }
});

$(document).on('click', '#logoutBtn', function () {
    auth.logout();
});