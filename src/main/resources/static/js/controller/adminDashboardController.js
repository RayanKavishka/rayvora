import {router} from "../router.js";
import {isValidContact, isValidEmail} from "../util/regex.js";
import {
    registerAdmin,
    getAllUsers,
    removeUser,
    searchUserByEmail,
    getUserById,
    getAllCategories, addCategory, removeCategory, updateUser
} from "../api.js";


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

    try {
        const response = await getAllUsers("ADMIN");

        if (response.status === 500) {
            Alert.error(response.message);
        }

        if (response.status === 0) {
            let rows = '';
            response.body.forEach((row) => {

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
        }

    } catch (error) {
        Alert.error("Something went wrong. Please try again.");
    }
};


// Search admin
$(document).on('input', '#adminSearchInput', async function () {
    const email = $(this).val().trim();

    if (email === '') {
        $('#adminsTableBody').empty();
        return;
    }

    try {
        const response = await searchUserByEmail("ADMIN", email);

        if (response.status === 500) {
            Alert.error(response.message);
        }

        if (response.status === 0) {
            let rows = '';
            response.body.forEach((row) => {

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
        }

    } catch (error) {
        Alert.error("Something went wrong. Please try again.");
    }
});

$(document).on('click', '#refreshAdmins', async function (e) {
    e.preventDefault();

    $('#adminSearchInput').val("");
    await loadAdminsTable();
});


// Update admin
window.handleUpdateAdmin = async function (userId) {
    if (!userId) {
        Alert.error("Invalid admin selected.");
        return;
    }

    $('#updateAdminBtn').css({display: "block"});
    $('#btnSubmitAdminRegister').css({display: "none"});

    try {
        const response = await getAllUsers("ADMIN");

        if (response.status === 500) {
            Alert.error(response.message);
        }

        if (response.status === 0) {
            const toBeUpdateUser = response.body.find((user) => user.userId === userId);

            $('#regPassword').prop('disabled', true);

            $('#adminId').val(toBeUpdateUser.userId);
            $('#regFirstName').val(toBeUpdateUser.firstName);
            $('#regLastName').val(toBeUpdateUser.lastName);
            $('#regEmail').val(toBeUpdateUser.email);
            $('#regContact').val(toBeUpdateUser.contact);
        }

    } catch (error) {
        Alert.error("Something went wrong. Please try again.");
    }
}

$(document).on('click', '#updateAdminBtn', async function () {
    let object = {
        "userId": $('#adminId').val(),
        "userRoles": "ADMIN, SELLER, CUSTOMER",
        "firstName": $('#regFirstName').val().trim(),
        "lastName": $('#regLastName').val().trim(),
        "email": $('#regEmail').val().trim(),
        "contact": $('#regContact').val().trim(),
    };

    if (!object.firstName || !object.lastName || !object.email || !object.contact) {
        Alert.error("Please fill in all fields.");
        return;
    }

    if (!isValidEmail(object.email)) {
        Alert.error("Please enter a valid email address.");
        return;
    }

    if (!isValidContact(object.contact)) {
        Alert.error("Please enter a valid contact number.");
        return;
    }

    try {
        const response = await updateUser(object);

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
            $('#regFirstName').val("");
            $('#regLastName').val("");
            $('#regEmail').val("");
            $('#regContact').val("");

            $('#updateAdminBtn').css({display: "none"});
            $('#btnSubmitAdminRegister').css({display: "block"});
            $('#regPassword').prop('disabled', false);

            Alert.success("Admin is updated successfully!");
        }

    } catch (error) {
        Alert.error("Something went wrong. Please try again.");
    }

    await loadAdminsTable();
});


// Set status as inactive
window.handleSetInactiveUser = function (userId) {
    if (!userId) {
        Alert.error("Invalid user selected.");
        return;
    }

    Alert.confirm("Do you want to remove this user ?", async () => {
        try {
            const response = await removeUser(userId);

            if (response.status === 404) {
                Alert.error(response.message);
            }

            if (response.status === 500) {
                Alert.error(response.message);
            }

            if (response.status === 0) {
                Alert.success("User is removed successfully!");
            }

        } catch (error) {
            Alert.error("Something went wrong. Please try again.");
        }

        try {
            const response = await getUserById(userId);

            if (response.status === 404) {
                Alert.error(response.message);
            }

            if (response.status === 500) {
                Alert.error(response.message);
            }

            if (response.status === 0) {
                let roles = response.body.userRoles;
                let role = roles.split(",")[0].trim();

                if (role === "ADMIN") {
                    await loadAdminsTable();
                } else if (role === "CUSTOMER") {
                    await loadCustomersTable();
                } else if (role === "SELLER") {
                    await loadSellersTable();
                }
            }

        } catch (error) {
            Alert.error("Something went wrong. Please try again.");
        }
    });
};


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

    if (!object.username || !object.password || !object.firstName || !object.lastName || !object.email || !object.contact) {
        Alert.error("Please fill in all fields.");
        return;
    }

    if (object.password.length < 6) {
        Alert.error("Password must be at least 6 characters long.");
        return;
    }

    if (!isValidEmail(object.email)) {
        Alert.error("Please enter a valid email address.");
        return;
    }

    if (!isValidContact(object.contact)) {
        Alert.error("Please enter a valid contact number.");
        return;
    }

    try {
        const response = await registerAdmin(object);

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
            $('#regUsername').val("");
            $('#regPassword').val("");
            $('#regFirstName').val("");
            $('#regLastName').val("");
            $('#regEmail').val("");
            $('#regContact').val("");

            Alert.success("Registration successfully!");
        }

    } catch (error) {
        Alert.error("Something went wrong. Please try again.");
    }

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

    try {
        const response = await getAllUsers("CUSTOMER");

        if (response.status === 500) {
            Alert.error(response.message);
        }

        if (response.status === 0) {
            let rows = '';
            response.body.forEach((row) => {

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
        }

    } catch (error) {
        Alert.error("Something went wrong. Please try again.");
    }
};


// Search customer
$(document).on('input', '#customerSearchInput', async function () {
    const email = $(this).val().trim();

    if (email === '') {
        $('#customersTableBody').empty();
        return;
    }

    try {
        const response = await searchUserByEmail("CUSTOMER", email);

        if (response.status === 500) {
            Alert.error(response.message);
        }

        if (response.status === 0) {
            let rows = '';
            response.body.forEach((row) => {

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
        }

    } catch (error) {
        Alert.error("Something went wrong. Please try again.");
    }
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

    try {
        const response = await getAllUsers("SELLER");

        if (response.status === 500) {
            Alert.error(response.message);
        }

        if (response.status === 0) {
            let rows = '';
            response.body.forEach((row) => {

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
        }

    } catch (error) {
        Alert.error("Something went wrong. Please try again.");
    }
};


// Search seller
$(document).on('input', '#sellerSearchInput', async function () {
    const email = $(this).val().trim();

    if (email === '') {
        $('#sellersTableBody').empty();
        return;
    }

    try {
        const response = await searchUserByEmail("SELLER", email);

        if (response.status === 500) {
            Alert.error(response.message);
        }

        if (response.status === 0) {
            let rows = '';
            response.body.forEach((row) => {

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
        }

    } catch (error) {
        Alert.error("Something went wrong. Please try again.");
    }
});

$(document).on('click', '#refreshSellers', async function (e) {
    e.preventDefault();

    $('#sellerSearchInput').val("");
    await loadSellersTable();
});


// =====================================================================================================================


// Manage Categories
$(document).on('click', '#manageCategories', async function(e) {
    e.preventDefault();
    await router("admin/manage-categories.html");
    await loadAllCategories();
});


// Load all categories
const loadAllCategories = async () => {
    $('#categoriesGrid').html("");

    try {
        const response = await getAllCategories();

        if (response.status === 500) {
            Alert.error(response.message);
        }

        if (response.status === 0) {
            let categories = '';

            response.body.forEach((category) => {
                categories += `
                    <div class="category-card">
                        <div class="category-card-image">
                            <img src="${category.imageUrl}" alt="">
                        </div>
                        <div class="category-card-body">
                            <h4 class="category-card-title">${category.categoryName}</h4>
                            <p class="category-card-desc">${category.description}</p>
                        </div>
                        <div class="category-card-actions">
                            <button onclick="handleDeleteCategory(${category.categoryId})" class="btn btn-sm btn-orange"><i class="fa-solid fa-trash"></i> Delete</button>
                        </div>
                    </div>
                `;
            });

            $('#categoriesGrid').html(categories);
        }

    } catch (error) {
        Alert.error("Something went wrong. Please try again.");
    }
};


// Add new category
$(document).on('click', '#btnSubmitCategory', async function (e) {
    e.preventDefault();

    const form = $('#categoryForm')[0];

    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const imageInput = $('#categoryImageInput')[0];

    if (imageInput && imageInput.files.length === 0) {
        Alert.error("Please select a category image.");
        return;
    }

    try {
        const response = await addCategory(form);

        if (response.status === 400) {
            Alert.error(response.message);
        }

        if (response.status === 500) {
            Alert.error(response.message);
        }

        if (response.status === 0) {
            $('#categoryForm')[0].reset();

            $('#categoryImagePreview')
                .attr('src', '')
                .hide();

            $('#fileUploadPlaceholder').show();

            Alert.success("Category is added successfully!");
        }

    } catch (error) {
        Alert.error("Something went wrong. Please try again.");
    }

    await loadAllCategories();
});

$(document).on('change', '#categoryImageInput', function () {
    const file = this.files[0];

    if (!file) {
        $('#categoryImagePreview').hide();
        $('#fileUploadPlaceholder').show();
        return;
    }

    if (!file.type.startsWith('image/')) {
        alert('Please select an image file.');
        this.value = '';
        return;
    }

    const imageUrl = URL.createObjectURL(file);

    $('#categoryImagePreview')
        .attr('src', imageUrl)
        .show();

    $('#fileUploadPlaceholder').hide();
});


// Set status as inactive
window.handleDeleteCategory = function (categoryId) {
    if (!categoryId) {
        Alert.error("Invalid category selected.");
        return;
    }

    Alert.confirm("Do you want to remove this category ?", async () => {
        try {
            const response = await removeCategory(categoryId);

            if (response.status === 404) {
                Alert.error(response.message);
            }

            if (response.status === 500) {
                Alert.error(response.message);
            }

            if (response.status === 0) {
                Alert.success("Category is removed successfully!");
                await loadAllCategories();
            }

        } catch (error) {
            Alert.error("Something went wrong. Please try again.");
        }


    });
};