document.addEventListener("DOMContentLoaded", function() {
    const today = new Date();
    
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = today.toLocaleDateString("en-US", options);
    
    const dateElement = document.getElementById("current-date");
    if (dateElement) {
        dateElement.textContent = formattedDate;
    }
});

/**
 * Toggles visibility between the Login and Register cards
 */
function toggleAuthPages() {
    const loginCard = document.getElementById('login-card');
    const registerCard = document.getElementById('register-card');

    if (loginCard.classList.contains('id-active')) {
        // Hide Login, Show Register
        loginCard.classList.remove('id-active');
        loginCard.classList.add('id-hidden');
        
        registerCard.classList.remove('id-hidden');
        registerCard.classList.add('id-active');
    } else {
        // Hide Register, Show Login
        registerCard.classList.remove('id-active');
        registerCard.classList.add('id-hidden');
        
        loginCard.classList.remove('id-hidden');
        loginCard.classList.add('id-active');
    }
}

/**
 * Toggles the visibility of the Michelin profile dropdown menu
 */
function toggleProfileDropdown() {
    const dropdown = document.getElementById('profileDropdown');
    if (dropdown) {
        dropdown.classList.toggle('show-menu');
    }
}

// Automatically closes the dropdown if the user clicks anywhere outside of it
window.addEventListener('click', function(event) {
    const dropdown = document.getElementById('profileDropdown');
    const menuBtn = document.querySelector('.profile-menu-btn');
    
    // Check if dropdown is currently active and the click was outside the container elements
    if (dropdown && dropdown.classList.contains('show-menu')) {
        if (!menuBtn.contains(event.target) && !dropdown.contains(event.target)) {
            dropdown.classList.remove('show-menu');
        }
    }
});

function toggleLikeCafe(button, cafeId) {
    const isLiking = button.innerText.trim() === '🤍' || button.innerText.includes('Add to Favorites');
    
    if(button.classList.contains('bookmark-btn')) {
        button.innerText = isLiking ? '🔖 Saved in Favorites' : '🔖 Add to Favorites';
    } else {
        button.innerText = isLiking ? '❤️' : '🤍';
    }

    const url = isLiking ? `/cafes/${cafeId}/bookmark` : `/cafes/${cafeId}/unbookmark`;

    fetch(url, { method: 'POST' })
    .then(res => {
        if (!res.ok) throw new Error();
    })
    .catch(() => {
        button.innerText = isLiking ? '🤍' : '❤️';
        alert('Action failed. Please make sure you are logged in.');
    });
}

function removeBookmark(cafeId) {
    fetch(`/cafes/${cafeId}/unbookmark`, { method: 'POST' })
    .then(res => {
        if (res.ok) {
            document.getElementById(`saved-cafe-${cafeId}`).remove();
        }
    });
}

// Function to toggle the visibility of the inline Add Cafe form in User Profile
function toggleAddCafeForm() {
    const formContainer = document.getElementById('inline-add-cafe-container');
    
    // Check the current display status and toggle it
    if (formContainer.style.display === 'none' || formContainer.style.display === '') {
        formContainer.style.display = 'block';
    } else {
        formContainer.style.display = 'none';
    }
}

// Toggle Forgot Password Card View
function showForgotPassword() {
    const loginCard = document.getElementById('login-card');
    const forgotCard = document.getElementById('forgot-card');
    
    if (loginCard && forgotCard) {
        loginCard.classList.replace('id-active', 'id-hidden');
        forgotCard.classList.replace('id-hidden', 'id-active');
    }
}

function hideForgotPassword() {
    const loginCard = document.getElementById('login-card');
    const forgotCard = document.getElementById('forgot-card');
    
    if (loginCard && forgotCard) {
        forgotCard.classList.replace('id-active', 'id-hidden');
        loginCard.classList.replace('id-hidden', 'id-active');
    }
}