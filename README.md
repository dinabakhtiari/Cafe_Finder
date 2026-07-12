# ☕ Cafe Finder

Cafe Finder is a dynamic web application built for students and remote workers to discover, share, and review the best study spots and productive workspaces across various cities in Germany.

## 🚀 Features

- **Explore by City:** Quickly browse curated lists of top study spots in major cities like Stuttgart, Mannheim, Heidelberg, Frankfurt, and Munich.
- **Advanced Filtering:** Filter cafes based on crucial remote-work amenities like Fast Wi-Fi, Power Outlets, Quiet Environment, and Student Discounts.
- **Dynamic User Profiles:** Contribute new cafes to the platform, edit existing details, and manage your personal reviews.
- **Saved Cafes:** Bookmark your favorite remote-work spots for quick access.
- **Community Reviews:** Share ratings and detailed feedback about your experiences.

## 🛠️ Tech Stack

- **Frontend:** HTML5, CSS3 (Modern Michelin-Style Design), JavaScript (AJAX for Bookmarking)
- **Template Engine:** EJS (Embedded JavaScript templates)
- **Backend:** Node.js, Express.js
- **Database:** MySQL / PostgreSQL (Structured data storage for cafes, users, and reviews)

## 📦 Installation & Setup

Follow these steps to run the project locally:

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd cafe-finder

2. **Install dependencies:**
   ```bash
   npm install

3. **Database Configuration:**
- Import the SQL schema provided in the `/sql-schema` directory into your local database.
- Configure your environment variables or connection settings in `middleware/connectionDB.js`.

4. **Start the Application**

Run the following command in your terminal to start the server:

```bash
npm start

## 👥 Contributors

- **Dina** (Frontend Development & UI Design)
- **Henrique** (Backend Architecture & Git Sync)
- **Taha** (Backend & Dynamic Logic)