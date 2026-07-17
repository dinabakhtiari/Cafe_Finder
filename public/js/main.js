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
    const isFavorited = button.dataset.favorited === 'true';

    button.disabled = true;
    fetch('/favorites', {
        method: isFavorited ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ cafe_id: cafeId })
    })
        .then(res => {
            if (!res.ok) throw new Error(res.status);
            const nowFavorited = !isFavorited;
            button.dataset.favorited = nowFavorited;
            button.innerText = nowFavorited ? '❤️ Saved' : '🤍 Save to Favorites';
        })
        .catch((err) => {
            if (err.message === '401') {
                showToastMessage('Please log in to save cafes.');
            } else {
                showToastMessage('Something went wrong. Please try again.');
            }
        })
        .finally(() => {
            button.disabled = false;
        });
}

async function removeBookmark(cafeId) {
    const confirmRemove = confirm("Are you sure you want to remove this cafe from your saved favorites?");
    if (!confirmRemove) return;

    try {
        const response = await fetch('/favorites', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
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

function toggleEditReviewForm(reviewId) {
    const form = document.getElementById(`edit-review-${reviewId}`);
    if (!form) return;
    if (form.classList.contains('id-hidden')) {
        form.classList.replace('id-hidden', 'id-active');
    } else {
        form.classList.replace('id-active', 'id-hidden');
    }
}

function submitEditReviewForm(event, reviewId) {
    event.preventDefault();
    const formElement = document.getElementById(`edit-review-form-${reviewId}`);
    if (!formElement) return;

    const formData = new FormData(formElement);
    const body = {};
    formData.forEach((value, key) => body[key] = value);
    ['wifi', 'outlets', 'quiet', 'tables', 'outdoor', 'ac', 'parking', 'student_discount', 'specialty_coffee', 'snacks']
        .forEach(tag => { if (!body[tag]) body[tag] = 0; });

    fetch(`/reviews/${reviewId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body)
    })
        .then(res => {
            if (res.ok) {
                window.location.reload();
            } else {
                showToastMessage('Failed to update the review.');
            }
        })
        .catch(() => showToastMessage('A network error occurred. Please try again.'));
}

async function deleteReview(reviewId) {
    if (!confirm('Are you sure you want to delete this review?')) return;

    try {
        const response = await fetch(`/reviews/${reviewId}`, {
            method: 'DELETE',
            credentials: 'include'
        });
        if (response.ok) {
            showToastMessage('Review deleted.');
            window.location.reload();
        } else {
            showToastMessage('Failed to delete the review.');
        }
    } catch (error) {
        showToastMessage('A network error occurred. Please try again.');
    }
}

async function deleteCafe(cafeId) {
    if (!confirm('Are you sure you want to delete this cafe permanently?')) return;

    try {
        const response = await fetch(`/cafes/${cafeId}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        }); if (response.ok) {
            showToastMessage('Cafe deleted successfully.');
            window.location.reload();
        } else {
            showToastMessage('Failed to delete the cafe. You may not have permission.');
        }
    } catch (error) {
        showToastMessage('A network error occurred. Please try again.');
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
    const body = {};
    formData.forEach((value, key) => body[key] = value);

    fetch(`/cafes/${cafeId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body)
    })
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
