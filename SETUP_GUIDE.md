# World Cup Data Dashboard - Setup Guide

## How to Display Data from collect_data.c in the Dashboard

### Step 1: Generate Data from C Program
```bash
# Navigate to the project directory
cd C:\Users\USER\Desktop\datascience

# Compile the C program
gcc -o collect_data.exe collect_data.c

# Run the program to generate data.json
./collect_data.exe
```

**What this does:** Creates `data.json` file with World Cup match and player data.

---

### Step 2: Start the Server
```bash
# Install dependencies (first time only)
npm install

# Start the server
npm start
```

**What this does:** 
- Starts Express server on `http://localhost:3000`
- Initializes SQLite database with the data

---

### Step 3: View the Dashboard
Open your browser and go to:
```
http://localhost:3000
```

The dashboard will display:
- ⚽ Match Statistics (total matches, goals, teams)
- 📊 Interactive Charts
- 📋 Match Results Table
- 🎮 Upcoming Matches
- 👥 Team Statistics  
- 👤 Player Personal Data

---

## Data Flow

```
collect_data.c  → generates → data.json
                                    ↓
                              server.js (reads & serves)
                                    ↓
                              index.html (displays in browser)
```

---

## Key Features

✅ **Automatic Data Loading** - Dashboard loads `data.json` on page load  
✅ **Real-time Filters** - Filter by year, team, or search matches  
✅ **Interactive Charts** - Visualize goals, wins, player performance  
✅ **Responsive Design** - Works on desktop, tablet, mobile  

---

## Troubleshooting

### If data doesn't appear:
1. Verify `data.json` exists in the project folder
2. Check browser console for errors (F12 → Console)
3. Refresh the page
4. Make sure server is running on port 3000

### If you get compilation errors:
- Ensure you have a C compiler (gcc) installed
- On Windows, you can install [MinGW](https://www.mingw-w64.org/)

---

## To Update Data
Simply run the C program again to regenerate `data.json`, then refresh the dashboard!
