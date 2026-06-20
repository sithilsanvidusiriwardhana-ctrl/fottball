# 📊 World Cup Data Dashboard - User Guide

## Overview
Your World Cup dashboard is now fully functional with real-time data updates. When you add new matches or players, they automatically appear in the dashboard!

## ✨ Key Features

### 1. **Real-Time Data Updates**
- Dashboard automatically refreshes every 10 seconds
- New data appears immediately after adding
- Statistics update automatically

### 2. **Add Data**
Click the **➕ Add Data** button to:
- **Add a Match**: Fill in date, teams, score, stage, and venue
- **Add a Player**: Fill in name, team, position, stats, and rating

### 3. **View Statistics**
- Total Matches count
- Total Goals scored
- Average Goals per Match
- Total Teams involved

### 4. **Charts & Visualizations**
- Goals by Team (Bar chart)
- Wins by Team (Bar chart)
- Player Performance (Bar chart)

### 5. **Tables**
- Match Results (completed matches)
- Upcoming Matches (future matches)
- Team Statistics (wins, losses, goals)
- Player Data (rankings by performance)

### 6. **Filters**
- Filter by Year
- Filter by Team
- Search by team/stage name
- Apply or Reset filters

## 🚀 How to Use

### Starting the Server
```bash
cd c:\Users\USER\Desktop\datascience
node server.js
```
Then open http://localhost:3000 in your browser.

### Adding a Match
1. Click **➕ Add Data**
2. Fill in the Match form:
   - **Date**: (required) YYYY-MM-DD format
   - **Year**: Tournament year
   - **Stage**: Group, Round 16, Quarter, Semi, or Final
   - **Home Team**: (required) Team name
   - **Away Team**: (required) Team name
   - **Home Goals**: Number of goals
   - **Away Goals**: Number of goals
   - **Winner**: Team name or "Draw"
   - **Venue**: Stadium/location
3. Click **Add Match**
4. Form closes and dashboard updates

### Adding a Player
1. Click **➕ Add Data**
2. Fill in the Player form:
   - **Name**: (required) Player name
   - **Team**: (required) Team name
   - **Position**: Goalkeeper, Defender, Midfielder, or Forward
   - **Age**: Player age
   - **Jersey**: Jersey number
   - **Goals**: Goals scored
   - **Assists**: Assists
   - **Rating**: Performance rating (0-10)
3. Click **Add Player**
4. Dashboard updates with new player data

## 📁 File Structure
```
datascience/
├── server.js                 # Express server
├── index.html               # Dashboard UI
├── package.json             # Dependencies
├── worldcup.db             # SQLite database (auto-created)
├── data.json               # Static data (fallback)
├── DASHBOARD_GUIDE.md      # This file
└── SETUP_GUIDE.md          # Original setup guide
```

## 💾 Database
- **Database**: SQLite (worldcup.db)
- **Tables**:
  - `matches` - All match data
  - `players` - All player data
- Automatically creates tables on first run

## 🔧 Technical Stack
- **Backend**: Node.js + Express
- **Database**: SQLite3
- **Frontend**: HTML5 + Vanilla JavaScript
- **Charts**: Chart.js
- **Styling**: CSS3

## 🌐 API Endpoints
```
GET  /api/matches           # Get all matches
GET  /api/players           # Get all players
POST /api/matches           # Add new match
POST /api/players           # Add new player
GET  /data.json            # Static data (fallback)
```

### Example API Requests
```javascript
// Add a match
fetch('/api/matches', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    date: '2026-12-10',
    year: 2026,
    stage: 'Group',
    homeTeam: 'Canada',
    awayTeam: 'Mexico',
    homeGoals: 2,
    awayGoals: 1,
    winner: 'Canada',
    venue: 'Toronto'
  })
})

// Add a player
fetch('/api/players', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'John Doe',
    team: 'Canada',
    position: 'Forward',
    age: 28,
    jersey: 10,
    goals: 5,
    assists: 3,
    rating: 8.5
  })
})
```

## ✅ Features Summary
- ✅ Add matches with real-time updates
- ✅ Add players with ratings
- ✅ View statistics automatically
- ✅ Filter data by year and team
- ✅ Search functionality
- ✅ Visual charts
- ✅ Responsive design
- ✅ Auto-refresh every 10 seconds
- ✅ Database persistence
- ✅ Error handling

## 🎯 What's New
1. **Improved Data Loading**: Now fetches from API endpoints first
2. **Better Error Handling**: More informative error messages
3. **Auto-Refresh**: Dashboard updates every 10 seconds
4. **Form Clearing**: Forms clear after successful submission
5. **Better Feedback**: Success messages with emoji indicators

## 🐛 Troubleshooting

### Server won't start
- Check if port 3000 is available
- Delete `worldcup.db` and restart

### Data not updating
- Wait 10 seconds for auto-refresh
- Or click "Apply Filters" to refresh manually

### Database errors
- Delete `worldcup.db` file
- Restart the server - it will recreate the database

---

**Enjoy your World Cup Data Explorer Dashboard! 🎉⚽**
