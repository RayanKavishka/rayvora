import {getUserRolesById} from "./api.js";
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

    getUserRoles: function () {
        return getUserRolesById(this.getUserId());
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