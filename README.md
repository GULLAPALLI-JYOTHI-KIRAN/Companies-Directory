# Companies-Directory
To design and implement a React-based frontend application that consumes APIs and displays “Company” data with filtering features.
Companies Directory

# Hosting in Netlify
URL: https://gjk-companies-directory.netlify.app/

A responsive and interactive Companies Directory built with React.
It allows users to search, filter, sort, and paginate through a list of companies fetched from a JSON file (/companies.json).

# Features

🔍 Search by company name, description, or industry (with debounced input)

📍 Filter by location and industry

↕️ Sort by name or number of employees

📄 Pagination with dynamic page count

⚡ Debounced search for better performance

🧠 Built using React hooks (useState, useEffect, useMemo)

🎨 Clean and modern Tailwind CSS styling

🧩 Tech Stack

React 18+

Tailwind CSS

Vite / Create React App (any bundler works)

JSON data from /companies.json

📂 Project Structure
src/
 ├── components/
 │    └── CompaniesDirectory.jsx   # Main directory component
 ├── data/
 │    └── companies.json           # Static company data (sample dataset)
 ├── App.jsx
 ├── main.jsx
 └── index.css

# Installation & Setup

Clone the repository

git clone https://github.com/GULLAPALLI-JYOTHI-KIRAN/Companies-Directory.git
cd companies-directory


# Install dependencies

npm install

# Run the development server

npm run dev


# Build for production

npm run build

# Example companies.json

Here’s a sample of the expected data format:
[
{
"id": 1,
    "name": "TechNova Solutions",
    "location": "Bangalore",
    "industry": "Software",
    "employees": 320,
    "website": "https://technova.com",
    "description": "Leading provider of enterprise software solutions."
  },
{
    "id": 2,
    "name": "GreenFields Agro",
    "location": "Hyderabad",
    "industry": "Agriculture",
    "employees": 150,
    "website": "https://greenfieldsagro.com",
    "description": "Innovative sustainable farming solutions."
}
]

# Key React Concepts Used

useState() → manages component state

useEffect() → fetches and debounces data

useMemo() → optimizes derived lists and filtering

Debouncing → delays search input for smoother UX

Pagination logic → slices filtered data for current page

# UI Preview
Feature	Description
🧠 Search	Type keywords to find matching companies
🌍 Filters	Choose by location or industry
⚙️ Sorting	Sort by name or employees
📑 Pagination	Navigate through multiple pages of results
🤝 Contributing

Contributions, feedback, and suggestions are always welcome!
Feel free to fork this repo, make changes, and open a pull request.

# License
This project is licensed under the MIT License – feel free to use and modify.
