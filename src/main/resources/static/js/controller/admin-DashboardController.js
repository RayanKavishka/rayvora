import {router} from "../router.js";
import {registerAdmin, getAllUsers, updateAdmin, removeUser, searchUserByEmail, getUserRolesById} from "../api.js";

// Overview & Analytics
$(document).on('click', '#defaultAdminDashboard', function(e) {
    e.preventDefault();
    router("admin-dashboard.html");
});

// =====================================================================================================================

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

    let rows = '';
    response.forEach((row) => {

        const joinedDate = new Date(row.createdAt)
            .toLocaleDateString("en-GB");

        rows += `
            <tr>
                <td>${row.userId}</td>
                <td>${row.firstName}</td>
                <td>${row.lastName}</td>
                <td>${row.email}</td>
                <td>${row.contact}</td>
                <td>${joinedDate}</td>
                <td>
                    <button onclick="handleUpdateAdmin(${row.userId})"
                            class="btn btn-sm btn-outline">
                        <i class="fa-solid fa-pen"></i>
                    </button>

                    <button onclick="handleSetInactiveUser(${row.userId})"
                            class="btn btn-sm btn-orange">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });

    $('#adminsTableBody').html(rows);
};


// Search admin
$(document).on('input', '#adminSearchInput', async function () {
    const email = $(this).val().trim();

    if (email === '') {
        $('#adminsTableBody').empty();
        return;
    }

    const response = await searchUserByEmail("ADMIN", email);

    let rows = '';
    response.forEach((row) => {

        const joinedDate = new Date(row.createdAt)
            .toLocaleDateString("en-GB");

        rows += `
            <tr>
                <td>${row.userId}</td>
                <td>${row.firstName}</td>
                <td>${row.lastName}</td>
                <td>${row.email}</td>
                <td>${row.contact}</td>
                <td>${joinedDate}</td>
                <td>
                    <button onclick="handleUpdateAdmin(${row.userId})"
                            class="btn btn-sm btn-outline">
                        <i class="fa-solid fa-pen"></i>
                    </button>

                    <button onclick="handleSetInactiveUser(${row.userId})"
                            class="btn btn-sm btn-orange">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });

    $('#adminsTableBody').html(rows);
});

$(document).on('click', '#refreshAdmins', async function (e) {
    e.preventDefault();

    $('#adminSearchInput').val("");
    await loadAdminsTable();
});


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
window.handleSetInactiveUser = async function (userId) {
    await removeUser(userId);

    if (await getUserRolesById(userId) === "ADMIN") {
        await loadAdminsTable();
    }

    if (await getUserRolesById(userId) === "CUSTOMER") {
        await loadCustomersTable();
    }

    if (await getUserRolesById(userId) === "SELLER") {
        await loadSellersTable();
    }
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


// =====================================================================================================================

// Manage Customers
$(document).on('click', '#manageCustomers', async function(e) {
    e.preventDefault();
    await router("admin/manage-customers.html");
    await loadCustomersTable();
});


// Load All customers
const loadCustomersTable = async () => {
    $('#customersTableBody').empty();

    const response = await getAllUsers("CUSTOMER");

    let rows = '';
    response.forEach((row) => {

        const joinedDate = new Date(row.createdAt)
            .toLocaleDateString("en-GB");

        rows += `
            <tr>
                <td>${row.userId}</td>
                <td>${row.firstName}</td>
                <td>${row.lastName}</td>
                <td>${row.email}</td>
                <td>${row.contact}</td>
                <td>${joinedDate}</td>
                <td>
                    <button onclick="handleSetInactiveUser(${row.userId})"
                            class="btn btn-sm btn-orange">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });

    $('#customersTableBody').html(rows);
};


// Search customer
$(document).on('input', '#customerSearchInput', async function () {
    const email = $(this).val().trim();

    if (email === '') {
        $('#customersTableBody').empty();
        return;
    }

    const response = await searchUserByEmail("CUSTOMER", email);

    let rows = '';
    response.forEach((row) => {

        const joinedDate = new Date(row.createdAt)
            .toLocaleDateString("en-GB");

        rows += `
            <tr>
                <td>${row.userId}</td>
                <td>${row.firstName}</td>
                <td>${row.lastName}</td>
                <td>${row.email}</td>
                <td>${row.contact}</td>
                <td>${joinedDate}</td>
                <td>
                    <button onclick="handleSetInactiveUser(${row.userId})"
                            class="btn btn-sm btn-orange">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });

    $('#customersTableBody').html(rows);
});

$(document).on('click', '#refreshCustomers', async function (e) {
    e.preventDefault();

    $('#customerSearchInput').val("");
    await loadCustomersTable();
});


// =====================================================================================================================

// Manage Sellers
$(document).on('click', '#manageSellers', async function(e) {
    e.preventDefault();
    await router("admin/manage-sellers.html");
    await loadSellersTable();
});


// Load all sellers
const loadSellersTable = async () => {
    $('#sellersTableBody').empty();

    const response = await getAllUsers("SELLER");

    let rows = '';
    response.forEach((row) => {

        const joinedDate = new Date(row.createdAt)
            .toLocaleDateString("en-GB");

        rows += `
            <tr>
                <td>${row.userId}</td>
                <td>${row.firstName}</td>
                <td>${row.lastName}</td>
                <td>${row.email}</td>
                <td>${row.contact}</td>
                <td>${joinedDate}</td>
                <td>
                    <button onclick="handleSetInactiveUser(${row.userId})"
                            class="btn btn-sm btn-orange">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });

    $('#sellersTableBody').html(rows);
};


// Search seller
$(document).on('input', '#sellerSearchInput', async function () {
    const email = $(this).val().trim();

    if (email === '') {
        $('#sellersTableBody').empty();
        return;
    }

    const response = await searchUserByEmail("SELLER", email);

    let rows = '';
    response.forEach((row) => {

        const joinedDate = new Date(row.createdAt)
            .toLocaleDateString("en-GB");

        rows += `
            <tr>
                <td>${row.userId}</td>
                <td>${row.firstName}</td>
                <td>${row.lastName}</td>
                <td>${row.email}</td>
                <td>${row.contact}</td>
                <td>${joinedDate}</td>
                <td>
                    <button onclick="handleSetInactiveUser(${row.userId})"
                            class="btn btn-sm btn-orange">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });

    $('#sellersTableBody').html(rows);
});

$(document).on('click', '#refreshSellers', async function (e) {
    e.preventDefault();

    $('#sellerSearchInput').val("");
    await loadSellersTable();
});


