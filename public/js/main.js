document.addEventListener("DOMContentLoaded", function() {
    const today = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = today.toLocaleDateString("en-US", options);

    const dateElement = document.getElementById("current-date");
    if (dateElement) {
        dateElement.textContent = formattedDate;
    }
});

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

function toggleProfileDropdown() {
    const dropdown = document.getElementById('profileDropdown');
    if (dropdown) {
        dropdown.classList.toggle('show-menu');
    }
}

window.addEventListener('click', function(event) {
    const dropdown = document.getElementById('profileDropdown');
    const menuBtn = document.querySelector('.profile-menu-btn');

    if (dropdown && dropdown.classList.contains('show-menu')) {
        if (!menuBtn.contains(event.target) && !dropdown.contains(event.target)) {
            dropdown.classList.remove('show-menu');
        }
    }
});

function showToastMessage(message) {
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.innerHTML = `<span>☕</span> <span>${message}</span>`;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 3500);
}

function toggleLikeCafe(button, cafeId) {
    const isLiking = button.innerText.trim() === '🤍' || button.innerText.includes('Add to Favorites');

    if (button.classList.contains('bookmark-btn')) {
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
        showToastMessage(isLiking ? 'Added to your Saved Cafes!' : 'Removed from your Saved Cafes.');
    })
    .catch(() => {
        button.innerText = isLiking ? '🤍' : '❤️';
        showToastMessage('Action failed. Please make sure you are logged in.');
    });
}

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
                cafeCard.style.opacity = '0';
                cafeCard.style.transform = 'scale(0.95)';
                cafeCard.style.transition = 'all 0.3s ease';
                setTimeout(() => {
                    cafeCard.remove();
                    const grid = document.querySelector('.modern-cafes-grid');
                    if (grid && grid.children.length === 0) window.location.reload();
                }, 300);
            }
            showToastMessage('Cafe removed from your Saved Cafes.');
        } else {
            showToastMessage('Failed to remove the cafe. Please try again.');
        }
    } catch (error) {
        showToastMessage('A network error occurred. Please check your connection.');
    }
}

function toggleAddCafeForm() {
    const formContainer = document.getElementById('inline-add-cafe-container');
    if (formContainer.style.display === 'none' || formContainer.style.display === '') {
        formContainer.style.display = 'block';
    } else {
        formContainer.style.display = 'none';
    }
}

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

function submitEditCafeForm(event, cafeId) {
    event.preventDefault();
    const formElement = document.getElementById(`edit-cafe-form-${cafeId}`);
    if (!formElement) return;

    const formData = new FormData(formElement);

    fetch(`/cafes/${cafeId}`, { method: 'PATCH', body: formData })
    .then(res => {
        if (res.status === 204 || res.ok) {
            showToastMessage('Cafe updated successfully!');
            toggleEditCafeForm(cafeId);
            window.location.reload();
        } else {
            return res.json().then(data => { throw new Error(data.error || 'Failed to update') });
        }
    })
    .catch(err => {
        showToastMessage(`Error: ${err.message || 'Could not update cafe details.'}`);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const forgotCard = document.getElementById("forgot-card");
    if (!forgotCard) return;

    const forgotForm = forgotCard.querySelector("form");
    if (forgotForm) {
        forgotForm.addEventListener("submit", async (event) => {
            event.preventDefault();
            const emailInput = document.getElementById("forgot-email");
            const submitBtn = forgotForm.querySelector(".auth-submit-btn");
            if (!emailInput || !emailInput.value) return;

            const originalBtnText = submitBtn.innerText;
            submitBtn.innerText = "Sending...";
            submitBtn.disabled = true;

            try {
                await fetch("/auth/forgot-password", {
                    method: "POST",
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    body: new URLSearchParams({ email: emailInput.value })
                });
                showToastMessage("Recovery link sent! Please check your email inbox.");
                emailInput.value = "";
            } catch (error) {
                showToastMessage("An error occurred. Please try again later.");
            } finally {
                submitBtn.innerText = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }
});
