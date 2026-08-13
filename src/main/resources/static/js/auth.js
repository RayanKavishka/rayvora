import {getUserById} from "./api.js";
import {router} from "./router.js";

export const auth = {
    saveSession: function (response) {
        localStorage.setItem("JWT", response.body.token);
        localStorage.setItem("userId", response.body.userId);
    },

    getJWT: function () {
        return localStorage.getItem("JWT");
    },

    getUserId: function () {
        return localStorage.getItem("userId");
    },

    getUserRoles: async function () {
        try {
            const response = await getUserById(this.getUserId());

            if (response.status === 404) {
                Alert.error(response.message);
                return null;
            }

            if (response.status === 500) {
                Alert.error(response.message);
                return null;
            }

            if (response.status === 0) {
                let roles = response.body.userRoles;
                let rolesArray = roles.split(",");

                return rolesArray[0].trim();
            }

        } catch (error) {
            Alert.error("Something went wrong. Please try again.")
        }
    },

    isLoggedIn: function () {
        return this.getJWT() !== null;
    },

    logout: function () {
        localStorage.removeItem("JWT");
        localStorage.removeItem("userId");

        router("login.html");
    }
}