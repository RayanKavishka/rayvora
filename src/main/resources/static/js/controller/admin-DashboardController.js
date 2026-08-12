import {router} from "../router.js";
import {registerAdmin, getAllUsers, updateAdmin, removeAdmin} from "../api.js";

// Overview & Analytics
$(document).on('click', '#defaultAdminDashboard', function(e) {
    e.preventDefault();
    router("admin-dashboard.html");
});


// Manage Admins
$(document).on('click', '#manageAdmins', async function(e) {
    e.preventDefault();
    await router("admin/manage-admins.html");
    await loadAdminsTable();
});

// Load all admins
const loadAdminsTable = async () => {
    $('#adminsTableBody').empty();

    const response = await getAllUsers("ADMIN");
    response.forEach((row) => {

        const localDateTime = row.createdAt;
        const joinedDate = new Date(localDateTime).toLocaleDateString("en-GB");

        let newRow = `<tr>
            <td>${row.userId}</td>
            <td>${row.firstName}</td>
            <td>${row.lastName}</td>
            <td>${row.email}</td>
            <td>${row.contact}</td>
            <td>${joinedDate}</td>
            <td>
                <button onclick="handleUpdateAdmin(${row.userId})" class="btn btn-sm btn-outline"><i class="fa-solid fa-pen"></i></button>
                <button onclick="handleSetInactiveAdmin(${row.userId})" class="btn btn-sm btn-orange"><i class="fa-solid fa-trash"></i></button>
            </td>
        </tr>`

        $('#adminsTableBody').append(newRow);
    });
};

// Update admin
window.handleUpdateAdmin = async function (userId) {
    $('#updateAdminBtn').css({display: "block"});
    $('#btnSubmitAdminRegister').css({display: "none"});

    const response = await getAllUsers("ADMIN");
    const toBeUpdateUser = response.find((user) => user.userId === userId);

    $('#regPassword').prop('disabled', true);

    $('#adminId').val(toBeUpdateUser.userId);
    $('#regUsername').val(toBeUpdateUser.username);
    $('#regFirstName').val(toBeUpdateUser.firstName);
    $('#regLastName').val(toBeUpdateUser.lastName);
    $('#regEmail').val(toBeUpdateUser.email);
    $('#regContact').val(toBeUpdateUser.contact);
}

$(document).on('click', '#updateAdminBtn', async function () {
    let object = {
        "userId": $('#adminId').val(),
        "username": $('#regUsername').val().trim(),
        "userRoles": "ADMIN, SELLER, CUSTOMER",
        "firstName": $('#regFirstName').val().trim(),
        "lastName": $('#regLastName').val().trim(),
        "email": $('#regEmail').val().trim(),
        "contact": $('#regContact').val().trim(),
    };

    await updateAdmin(object);
    await loadAdminsTable();
});

// Set status as inactive
window.handleSetInactiveAdmin = async function (userId) {
    await removeAdmin(userId);
    await loadAdminsTable();
}

// Signup Admin
$(document).on('click', '#btnSubmitAdminRegister', async function (e) {
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

    await registerAdmin(object);
    await loadAdminsTable();
});