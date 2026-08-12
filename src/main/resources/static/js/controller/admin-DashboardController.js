import {router} from "../router.js";


$(document).on('click', '#defaultAdminDashboard', function(e) {
    e.preventDefault();
    router("admin-dashboard.html");
});

$(document).on('click', '#manageAdmins', function(e) {
    e.preventDefault();
    router("admin/manage-admins.html");
});