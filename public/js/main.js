document.addEventListener("DOMContentLoaded", function() {
    const today = new Date();
    
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = today.toLocaleDateString("en-US", options);
    
    const dateElement = document.getElementById("current-date");
    if (dateElement) {
        dateElement.textContent = formattedDate;
    }
});