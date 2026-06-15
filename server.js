const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, 'worldcup.db');

const db = new sqlite3.Database(DB_FILE, err => {
  if (err) {
    console.error('Failed to open database:', err.message);
    process.exit(1);
  }
});

function initializeDatabase() {
  db.serialize(() => {
    db.run(`DROP TABLE IF EXISTS matches`);
    db.run(`DROP TABLE IF EXISTS players`);

    db.run(`
      CREATE TABLE matches (
        id INTEGER PRIMARY KEY,
        date TEXT,
        year INTEGER,
        stage TEXT,
        homeTeam TEXT,
        awayTeam TEXT,
        homeGoals INTEGER,
        awayGoals INTEGER,
        winner TEXT
      )
    `);

    db.run(`
      CREATE TABLE players (
        id INTEGER PRIMARY KEY,
        name TEXT,
        team TEXT,
        position TEXT,
        age INTEGER,
        jersey INTEGER,
        goals INTEGER,
        assists INTEGER,
        rating REAL
      )
    `);

    const matches = [
      ['2018-06-14', 2018, 'Group', 'Russia', 'Saudi Arabia', 5, 0, 'Russia'],
      ['2018-06-15', 2018, 'Group', 'Egypt', 'Uruguay', 0, 1, 'Uruguay'],
      ['2018-06-16', 2018, 'Group', 'Portugal', 'Spain', 3, 3, 'Draw'],
      ['2014-07-13', 2014, 'Final', 'Germany', 'Argentina', 1, 0, 'Germany'],
      ['2014-07-08', 2014, 'Semi', 'Argentina', 'Netherlands', 0, 0, 'Argentina'],
      ['2010-07-11', 2010, 'Final', 'Spain', 'Netherlands', 1, 0, 'Spain'],
      ['2022-12-18', 2022, 'Final', 'Argentina', 'France', 3, 3, 'Argentina']
    ];

    const players = [
      ['Lionel Messi', 'Argentina', 'Forward', 35, 10, 7, 3, 9.7],
      ['Kylian Mbappé', 'France', 'Forward', 26, 10, 6, 2, 9.4],
      ['Neymar Jr.', 'Brazil', 'Forward', 31, 10, 5, 4, 9.1],
      ['Harry Kane', 'England', 'Forward', 30, 9, 4, 1, 8.8],
      ['Luka Modrić', 'Croatia', 'Midfielder', 38, 10, 2, 5, 8.6]
    ];

    const insertMatch = db.prepare(`
      INSERT INTO matches (date, year, stage, homeTeam, awayTeam, homeGoals, awayGoals, winner)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    matches.forEach(match => insertMatch.run(match));
    insertMatch.finalize();

    const insertPlayer = db.prepare(`
      INSERT INTO players (name, team, position, age, jersey, goals, assists, rating)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    players.forEach(player => insertPlayer.run(player));
    insertPlayer.finalize();
  });
}

app.use(express.static(path.join(__dirname)));

app.get('/api/matches', (req, res) => {
  db.all('SELECT * FROM matches ORDER BY date ASC', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get('/api/players', (req, res) => {
  db.all('SELECT * FROM players ORDER BY goals DESC, assists DESC', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  initializeDatabase();
});
