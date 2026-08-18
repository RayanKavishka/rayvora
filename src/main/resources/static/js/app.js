import {auth} from "./auth.js";
import {router} from "./router.js";
import {getAllCategories, getUserById} from "./api.js";

$(document).ready(function () {
    if (!auth.isLoggedIn()) {
        router("login.html");

    } else {
        checkRole();
    }
});

export async function checkRole()  {
    const role = await auth.getUserRoles();

    if (role === "ADMIN") {
        router("admin-dashboard.html");
    }

    if (role === "SELLER") {
        router("seller-dashboard.html");
    }

    if (role === "CUSTOMER") {
        router("customer-dashboard.html");

        loadCategoriesAndUserName();
    }
}



const loadCategoriesAndUserName = async () => {
    try {
        const response = await getUserById(auth.getUserId());

        if (response.status === 404) {
            Alert.error(response.message);
        }

        if (response.status === 500) {
            Alert.error(response.message);
        }

        if (response.status === 0) {
            $('#usernameLogo').html(
                `${response.body.username} <i class="fa-solid fa-chevron-down" style="font-size: 0.68rem; color: var(--c-orange)"></i>`
            );
        }

    } catch (error) {
        Alert.error("Something went wrong. Please try again.")
    }

    try {
        const response = await getAllCategories();

        if (response.status === 500) {
            Alert.error(response.message);
        }

        if (response.status === 0) {
            let html = '';

            response.body.forEach((category) => {
                html += `
                    <li class="category-item"><a href=""><i class="fa-solid fa-layer-group"></i> ${category.categoryName}</a></li>
                `;
            });

            $('#cusCategoryExplore').html(html);
        }

    } catch (error) {
        Alert.error("Something went wrong. Please try again.");
    }
};


// Theme changing implementation
const initThemeManager = () => {
    const savedTheme = localStorage.getItem('rayvora_theme') || 'light';
    setTheme(savedTheme);

    const themeToggleBtn = document.getElementById('themeToggleBtn');
    if (themeToggleBtn) {
        themeToggleBtn.onclick = () => {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            setTheme(newTheme);
        };
    }
};

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    document.body.className = `theme-${theme}`;
    localStorage.setItem('rayvora_theme', theme);

    const themeIcon = document.getElementById('themeIcon');
    const themeLabel = document.getElementById('themeLabel');

    if (themeIcon) {
        themeIcon.className = theme === 'dark' ? 'fa-solid fa-moon theme-toggle-icon' : 'fa-solid fa-sun theme-toggle-icon';
    }
    if (themeLabel) {
        themeLabel.textContent = theme === 'dark' ? 'Dark' : 'Light';
    }
}

document.addEventListener('DOMContentLoaded', initThemeManager);
document.addEventListener('pageRendered', initThemeManager);
