import {router} from "../router.js";
import {auth} from "../auth.js";
import {
    changePassword, getAddressByCustomerId,
    getAllOrdersByCustomer, getUserById, saveAddress, updateAddress, updateOrderStatusWithTime, updateUser
} from "../api.js";
import {isValidContact, isValidEmail} from "../util/regex.js";
import {checkRole} from "../app.js";

// =====================================================================================================================


// Handle back button
$(document).on('click', '#btnAccountBack', async function (e) {
    e.preventDefault();

    await checkRole();
});


// Manage customer account
$(document).on('click', '#navMyProfile a', async function(e) {
    e.preventDefault();
    await router("customer/account/customer-account.html");

    fillCustomerDetails();
});


// Fill customer details
export const fillCustomerDetails = async () => {
    try {
        const response = await getUserById(auth.getUserId());

        if (response.status === 404) {
            Alert.error(response.message);
            return;
        }

        if (response.status === 500) {
            Alert.error(response.message);
            return;
        }

        if (response.status === 0) {
            const customer = response.body;

            $('#accountHeroName').text(`${customer.firstName} ${customer.lastName}`);
            $('#accountHeroEmail').text(customer.email);

            const formattedDate = new Date(customer.createdAt).toDateString();
            $('#accountHeroJoinedDateAndId').html(
                `<i class="fa-solid fa-calendar-check"></i> Member since ${formattedDate}`
            );


            $('#customerId').val(customer.userId);
            $('#customerFirstName').val(customer.firstName);
            $('#customerLastName').val(customer.lastName);
            $('#customerEmail').val(customer.email);
            $('#customerContact').val(customer.contact);
        }

    } catch (error) {
        Alert.error("Something went wrong. Please try again.");
        return;
    }
};


// Update seller
$(document).on('click', '#btnSaveCustomerProfile', async function () {
    let object = {
        "userId": $('#customerId').val().trim(),
        "userRoles": "CUSTOMER",
        "firstName": $('#customerFirstName').val().trim(),
        "lastName": $('#customerLastName').val().trim(),
        "email": $('#customerEmail').val().trim(),
        "contact": $('#customerContact').val().trim()
    };

    if (!object.firstName || !object.lastName || !object.email || !object.contact) {
        Alert.error("Please fill in all your details.");
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
            return;
        }

        if (response.status === 409) {
            Alert.error(response.message);
            return;
        }

        if (response.status === 500) {
            Alert.error(response.message);
            return;
        }

        if (response.status === 0) {
            Alert.success("Your details are updated successfully!");

            $("#customerId").val("");
            $("#customerFirstName").val("");
            $("#customerLastName").val("");
            $("#customerEmail").val("");
            $("#customerContact").val("");

            fillCustomerDetails();
        }

    } catch (error) {
        Alert.error("Something went wrong. Please try again.");
        return;
    }
});


// Change password
$(document).on('click', '#btnVerifyCustomerPassword', async function (e) {
    e.preventDefault();

    if ($('#customerCurrentPassword').val() === "" || $('#customerNewPassword').val() === "") {
        Alert.error("Enter your current & new password to save.");
        return;
    }

    let object = {
        "userId": auth.getUserId(),
        "currentPassword": $('#customerCurrentPassword').val().trim(),
        "newPassword": $('#customerNewPassword').val().trim()
    };

    if (object.newPassword.length < 8) {
        Alert.error("New password must be at least 6 characters long.");
        return;
    }

    if (object.newPassword === object.currentPassword) {
        Alert.error("New password must be different from current password.");
        return;
    }

    try {
        const response = await changePassword(object);

        if (response.status === 400) {
            Alert.error(response.message);
            return;
        }

        if (response.status === 401) {
            Alert.error(response.message);
            return;
        }

        if (response.status === 404) {
            Alert.error(response.message);
            return;
        }

        if (response.status === 500) {
            Alert.error(response.message);
            return;
        }

        if (response.status === 0) {
            $('#customerCurrentPassword').val("");
            $('#customerNewPassword').val("");

            Alert.success("Password is changed successfully!");
        }

    } catch (error) {
        Alert.error("Something went wrong. Please try again.");
        return;
    }
})


// Handle cancel change password
$(document).on('click', '#btnCancelCustomerPasswordChange', function (e) {
    e.preventDefault();

    $('#customerCurrentPassword').val("");
    $('#customerNewPassword').val("");
});


// =====================================================================================================================


// Manage customer address
$(document).on('click', '#navManageAddress a', async function(e) {
    e.preventDefault();
    await router("customer/account/customize-address.html");

    await fillCustomerDetails();
    await loadAddress();
});


// Get address by customer
let hasAddress = true;
const loadAddress = async () => {
    try {
        const response = await getAddressByCustomerId(auth.getUserId());

        if (response.status === 404) {
            hasAddress = false;
            $('#btnCancelAddress').show();

            $('#btnSaveAddress').html(`
                    <i class="fa-solid fa-plus"></i> Save Address
            `);

            Alert.warning(response.message);
            return;
        }

        if (response.status === 500) {
            Alert.error(response.message);
            return;
        }

        if (response.status === 0) {

            if (response.body) {
                hasAddress = true;
                $('#btnCancelAddress').hide();

                $("#fullNameForAddress").val(response.body.fullName);
                $("#addressContact").val(response.body.contact);
                $("#addressStreet").val(response.body.street);
                $("#addressCity").val(response.body.city);
                $("#addressDistrict").val(response.body.district);
                $("#addressProvince").val(response.body.province);
                $("#addressZipCode").val(response.body.zipCode);
                $("#addressCountry").val(response.body.country);


                $('#btnSaveAddress').html(`
                    <i class="fa-solid fa-pen"></i> Update Address
                `);

                let html = `
                    <div id="addressCard" class="address-card is-default" data-address-id="ADR-001">
                        <div class="address-card-top">
                            <span class="address-card-label-badge">
                                <i class="fa-solid fa-house"></i> Home
                            </span>
    
                            <span class="badge badge-primary">Default</span>
                        </div>
    
                        <p class="address-card-text">
                            ${response.body.fullName}<br>
                            ${response.body.street},<br>
                            ${response.body.city}, ${response.body.district}, ${response.body.province}, ${response.body.zipCode}<br>
                            ${response.body.country}  ·  ${response.body.contact}
                        </p>
           
                    </div>
                `;

                $('#addressesGrid').html(html);
            }
        }

    } catch (error) {
        Alert.error("Something went wrong. Please try again.");
        return;
    }
};


// Save or Update address
$(document).on('click', '#btnSaveAddress', async function (e) {
    e.preventDefault();

    let object = {
        "fullName": $("#fullNameForAddress").val().trim(),
        "contact":  $("#addressContact").val().trim(),
        "street": $("#addressStreet").val().trim(),
        "city": $("#addressCity").val().trim(),
        "district": $("#addressDistrict").val().trim(),
        "province": $("#addressProvince").val().trim(),
        "zipCode": $("#addressZipCode").val().trim(),
        "country": $("#addressCountry").val().trim(),
        "userId": auth.getUserId()
    };

    if (!hasAddress) {
        $('#btnCancelAddress').show();

        try {
            const response = await saveAddress(object);

            if (response.status === 400) {
                Alert.error(response.message);
                return;
            }

            if (response.status === 404) {
                Alert.error(response.message);
                return;
            }

            if (response.status === 500) {
                Alert.error(response.message);
                return;
            }

            if (response.status === 0) {
                Alert.success("Address is saved successfully!");

                loadAddress();
            }

        } catch (error) {
            Alert.error("Something went wrong. Please try again.");
            return;
        }


    } else {
        $('#btnCancelAddress').hide();

        try {
            const response = await updateAddress(object);

            if (response.status === 400) {
                Alert.error(response.message);
                return;
            }

            if (response.status === 404) {
                Alert.error(response.message);
                return;
            }

            if (response.status === 500) {
                Alert.error(response.message);
                return;
            }

            if (response.status === 0) {
                Alert.success("Address is updated successfully!");
                $("#fullNameForAddress").val("");
                $("#addressContact").val("");
                $("#addressStreet").val("");
                $("#addressCity").val("");
                $("#addressDistrict").val("");
                $("#addressProvince").val("");
                $("#addressZipCode").val("");
                $("#addressCountry").val("");

                loadAddress();
            }

        } catch (error) {
            Alert.error("Something went wrong. Please try again.");
            return;
        }
    }
});


// Handle cancel button
$(document).on('click', '#btnCancelAddress', function (e) {
   e.preventDefault();

    $("#fullNameForAddress").val("");
    $("#addressContact").val("");
    $("#addressStreet").val("");
    $("#addressCity").val("");
    $("#addressDistrict").val("");
    $("#addressProvince").val("");
    $("#addressZipCode").val("");
    $("#addressCountry").val("");

});



// =====================================================================================================================


// Manage customer orders
$(document).on('click', '#navMyOrders a', async function(e) {
    e.preventDefault();
    await router("customer/account/your-orders.html");

    await fillCustomerDetails();
    await loadOrdersByCustomer("ALL");
});


// Create Html for each order
const createOrderCardHtml = (order) => {

    const productsHtml = order.products.map((product) => `
        <div class="order-item-row">
            <div class="order-item-thumb"><img src="${product.imageUrls[0]}" alt="image-${product.productName}"></div>
            <div>
                <div class="order-item-name">${product.productName}</div>
                <div class="order-item-qty">Qty: ${product.quantity}</div>
            </div>
        </div>
    `).join('');

    return `
        <div class="order-card" data-order-id="${order.orderId}" data-status="${order.orderStatus.toLowerCase()}">
            <div class="order-card-header">
                <div>
                    <div class="order-card-id">Order #${order.orderId}</div>
                    <div class="order-card-date">Placed on ${order.orderDate.split("T")[0]}</div>
                    <div class="order-card-date">Estimated delivery on ${order.estimatedDeliveryTo}</div>
                </div>
                <span class="order-status-badge status-${order.orderStatus.toLowerCase()}">
                    <i class="fa-solid fa-rotate"></i> ${order.orderStatus}
                </span>
            </div>
            <div class="order-card-items">
                ${productsHtml}
            </div>
            <div class="order-card-footer">
                <div class="order-total-amount"><span>Total:</span> LKR ${order.totalAmount}</div>
                <div class="order-card-actions">
                    <button type="button" class="btn btn-sm btn-outline">View Details</button>
                    ${order.orderStatus === 'CONFIRMED'
                        ? `<button onclick="cancelOrder(${order.orderId})" type="button" class="btn btn-sm btn-outline">Cancel Order</button>`
                        : ''}
                </div>
            </div>
        </div>
    `;
};


// Load orders by order status
const loadOrdersByCustomer = async (orderStatus) => {
    try {
        const response = await getAllOrdersByCustomer(auth.getUserId(), orderStatus);

        if (response.status === 404) {
            Alert.error(response.message);
            return;
        }

        if (response.status === 500) {
            Alert.error(response.message);
            return;
        }

        if (response.status === 0) {
            $('#ordersList').html('');

            let finalHtml = response.body.map((order) => createOrderCardHtml(order)).join('');

            $('#ordersList').html(finalHtml);
        }

    } catch (error) {
        Alert.error("Something went wrong. Please try again");
        return;
    }
};


// Handle filter btn clicks
$(document).on('click', '.order-filter-tab', function (e) {
    e.preventDefault();

    $('.order-filter-tab').removeClass("active");

    if ($(this).text() === "All Orders") {
        $(this).addClass("active");
        loadOrdersByCustomer("ALL");

    } else if ($(this).text() === "Confirmed") {
        $(this).addClass("active");
        loadOrdersByCustomer("CONFIRMED");

    } else if ($(this).text() === "Shipped") {
        $(this).addClass("active");
        loadOrdersByCustomer("SHIPPED");

    } else if ($(this).text() === "Delivered") {
        $(this).addClass("active");
        loadOrdersByCustomer("COMPLETED");

    } else {
        $(this).addClass("active");
        loadOrdersByCustomer("CANCELLED");
    }
});


// Handle cancel order
window.cancelOrder = function (orderId) {
    Alert.confirm(`Do you want to cancel order - #${orderId} ? `, async () => {
        try {
            const response = await updateOrderStatusWithTime(orderId, "CANCELLED");

            if (response.status === 404) {
                Alert.error(response.message);
                return;
            }

            if (response.status === 409) {
                Alert.error(response.message);
                return;
            }

            if (response.status === 500) {
                Alert.error(response.message);
                return;
            }

            if (response.status === 0) {
                Alert.info(`Order - #${orderId} is cancelled.`);
                await router("customer/account/your-orders.html");
                await fillCustomerDetails();
                await loadOrdersByCustomer("ALL");
            }

        } catch (error) {
            Alert.error("Something went wrong. Please try again.");
            return;
        }
    });
};


// =====================================================================================================================


// Manage customer reviews
$(document).on('click', '#navMyReviews a', async function (e) {
    e.preventDefault();
    await router("customer/account/your-reviews.html");

    await fillCustomerDetails();
});


// =====================================================================================================================


// Handle logout
$(document).on('click', '#navAccountLogout a', function (e) {
    e.preventDefault();
    auth.logout();
});