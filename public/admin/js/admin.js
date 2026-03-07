// Global variables for admin context
let currentUser = null;

// Auth check on load (except login page)
document.addEventListener('DOMContentLoaded', () => {
    const isLoginPage = window.location.pathname.includes('login.html');

    // Check local storage for token
    const token = localStorage.getItem('basaveshwar_admin_token');
    const role = localStorage.getItem('basaveshwar_admin_role');

    if (!token && !isLoginPage) {
        window.location.href = '/admin/login.html';
        return;
    }

    if (token && isLoginPage) {
        // Redirect based on role if already logged in
        redirectBasedOnRole(role);
    }

    if (token) {
        fetchCurrentUser(token);
    }
});

async function fetchCurrentUser(token) {
    try {
        const response = await fetch('/api/auth/me', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            currentUser = await response.json();
            updateUIWithUser(currentUser);
        } else {
            // Token invalid or expired
            logout();
        }
    } catch (e) {
        console.error('Error fetching user:', e);
    }
}

function updateUIWithUser(user) {
    const nameEl = document.getElementById('user-name');
    const roleEl = document.getElementById('user-role');
    if (nameEl) nameEl.innerText = user.username.toUpperCase();
    if (roleEl) roleEl.innerText = user.role.charAt(0).toUpperCase() + user.role.slice(1);
}

function redirectBasedOnRole(role) {
    if (role === 'manager') window.location.href = '/admin/manager.html';
    else if (role === 'cashier') window.location.href = '/admin/cashier.html';
    else if (role === 'waiter') window.location.href = '/admin/waiter.html';
}

function logout() {
    localStorage.removeItem('basaveshwar_admin_token');
    localStorage.removeItem('basaveshwar_admin_role');
    localStorage.removeItem('basaveshwar_admin_id');
    window.location.href = '/admin/login.html';
}

// Utility API Call function
async function apiCall(endpoint, method = 'GET', body = null) {
    const token = localStorage.getItem('basaveshwar_admin_token');
    if (!token) {
        logout();
        throw new Error('No authentication token');
    }

    const headers = {
        'Authorization': `Bearer ${token}`
    };

    if (body) {
        headers['Content-Type'] = 'application/json';
    }

    const config = {
        method,
        headers,
    };

    if (body) {
        config.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(endpoint, config);

        if (response.status === 401 || response.status === 403) {
            logout();
            throw new Error('Authentication required');
        }

        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
            const data = await response.json();
            return { ok: response.ok, data, status: response.status };
        } else {
            return { ok: response.ok, status: response.status };
        }
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}
