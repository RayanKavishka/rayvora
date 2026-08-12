import {auth} from "./auth.js";
import {router} from "./router.js";

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
    }
}


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
