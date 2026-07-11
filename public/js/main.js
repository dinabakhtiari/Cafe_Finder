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
        loginCard.classList.remove('id-active');
        loginCard.classList.add('id-hidden');
        registerCard.classList.remove('id-hidden');
        registerCard.classList.add('id-active');
    } else {
        registerCard.classList.remove('id-active');
        registerCard.classList.add('id-hidden');
        loginCard.classList.remove('id-hidden');
        loginCard.classList.add('id-active');
    }
}

/**
 * Toggles the visibility of the profile dropdown menu
 */
function toggleProfileDropdown() {
    const dropdown = document.getElementById('profileDropdown');
    if (dropdown) {
        dropdown.classList.toggle('show-menu');
    }
}

// Automatically closes the dropdown if clicked outside
window.addEventListener('click', function(event) {
    const dropdown = document.getElementById('profileDropdown');
    const menuBtn = document.querySelector('.profile-menu-btn');
    
    if (dropdown && dropdown.classList.contains('show-menu')) {
        if (!menuBtn.contains(event.target) && !dropdown.contains(event.target)) {
            dropdown.classList.remove('show-menu');
        }
    }
});

/**
 * Syncs bookmark logic with Henrique's favorites.js routing (POST/DELETE)
 */
/**
 * Syncs bookmark logic with Henrique's favorites.js routing (POST/DELETE)
 */
function toggleLikeCafe(button, cafeId) {
    const isLiking = button.innerText.trim() === '🤍' || button.innerText.includes('Add to Favorites');
    
    if(button.classList.contains('bookmark-btn')) {
        button.innerText = isLiking ? '🔖 Saved in Favorites' : '🔖 Add to Favorites';
    } else {
        button.innerText = isLiking ? '❤️' : '🤍';
    }

    fetch('/favorites', { 
        method: isLiking ? 'POST' : 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cafe_id: cafeId })
    })
    .then(res => {
        if (!res.ok) throw new Error();
    })
    .catch(() => {
        button.innerText = isLiking ? '🤍' : '❤️';
        alert('Action failed. Please make sure you are logged in.');
    });
}

// Function to toggle the visibility of the inline Add Cafe form
function toggleAddCafeForm() {
    const formContainer = document.getElementById('inline-add-cafe-container');
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

// Toggle Inline Edit Cafe Form Row View
function toggleEditCafeForm(cafeId) {
    const editFormContainer = document.getElementById(`inline-edit-cafe-${cafeId}`);
    if (editFormContainer) {
        if (editFormContainer.classList.contains('id-hidden')) {
            editFormContainer.classList.replace('id-hidden', 'id-active');
        } else {
            editFormContainer.classList.replace('id-active', 'id-hidden');
        }
    }
}

/**
 * Handles smooth AJAX removal of bookmarks using the favorites.js endpoint
 */
async function removeBookmark(cafeId) {
    const confirmRemove = confirm("Are you sure you want to remove this cafe from your saved favorites?");
    
    if (!confirmRemove) return;

    try {
        const response = await fetch('/favorites', { 
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cafe_id: cafeId })
        });

        if (response.ok) {
            const cafeCard = document.getElementById(`saved-cafe-${cafeId}`);
            if (cafeCard) {
                // Keep the smooth animation!
                cafeCard.style.opacity = '0';
                cafeCard.style.transform = 'scale(0.95)';
                cafeCard.style.transition = 'all 0.3s ease';
                
                setTimeout(() => {
                    cafeCard.remove();
                    const grid = document.querySelector('.modern-cafes-grid');
                    // If that was the last cafe, reload the page to trigger the EJS empty state template
                    if (grid && grid.children.length === 0) {
                        window.location.reload();
                    }
                }, 300);
            }
        } else {
            alert("Failed to remove the cafe. Please try again.");
        }
    } catch (error) {
        console.error("Error removing bookmark:", error);
        alert("A network error occurred. Please check your connection.");
    }
}

/**
 * Captures edit form updates and asynchronously sends them via standard HTTP PATCH to the MVC backend
 */
function submitEditCafeForm(event, cafeId) {
    event.preventDefault();

    const formElement = document.getElementById(`edit-cafe-form-${cafeId}`);
    if (!formElement) return;

    // Collects files and texts seamlessly
    const formData = new FormData(formElement);

    fetch(`/cafes/${cafeId}`, {
        method: 'PATCH',
        body: formData
    })
    .then(res => {
        if (res.status === 204 || res.ok) {
            alert('Cafe updated successfully! 💾');
            toggleEditCafeForm(cafeId);
            window.location.reload(); // Refreshes page to view latest content changes
        } else {
            return res.json().then(data => { throw new Error(data.error || 'Failed to update') });
        }
    })
    .catch(err => {
        console.error('Update operation error:', err);
        alert(`Error: ${err.message || 'Could not update cafe details.'}`);
    });
}