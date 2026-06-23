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