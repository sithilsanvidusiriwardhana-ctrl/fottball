const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, 'worldcup.db');

// Validation & Sanitization Utilities
const validators = {
  isValidDate: (dateStr) => {
    const date = new Date(dateStr);
    return date instanceof Date && !isNaN(date) && /^\d{4}-\d{2}-\d{2}$/.test(dateStr);
  },
  isValidEmail: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
  isValidYear: (year) => Number.isInteger(year) && year >= 1930 && year <= 2100,
  isValidPosition: (pos) => ['Forward', 'Midfielder', 'Defender', 'Goalkeeper'].includes(pos),
  isValidRating: (rating) => Number(rating) >= 0 && Number(rating) <= 10,
  isValidAge: (age) => Number.isInteger(age) && age >= 15 && age <= 50,
  sanitizeString: (str) => String(str).trim().slice(0, 255),
  sanitizeInt: (val) => {
    const num = parseInt(val, 10);
    return isNaN(num) ? 0 : num;
  },
  sanitizeFloat: (val) => {
    const num = parseFloat(val);
    return isNaN(num) ? 0 : num;
  }
};

// Custom Error Class
class ValidationError extends Error {
  constructor(message, field = null) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
    this.statusCode = 400;
  }
}

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Global error handler (must be defined after all routes)
const errorHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${err.name}: ${err.message}`);
  
  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json({
      error: err.message,
      field: err.field,
      timestamp: new Date().toISOString()
    });
  }
  
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
    timestamp: new Date().toISOString()
  });
};

const db = new sqlite3.Database(DB_FILE, err => {
  if (err) {
    console.error('Failed to open database:', err.message);
    process.exit(1);
  }
  console.log('Database connected successfully');
});

// Handle database errors
db.on('error', (err) => {
  console.error('Database error:', err);
});

function initializeDatabase() {
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS matches (
        id INTEGER PRIMARY KEY,
        date TEXT,
        year INTEGER,
        stage TEXT,
        homeTeam TEXT,
        awayTeam TEXT,
        homeGoals INTEGER,
        awayGoals INTEGER,
        winner TEXT,
        venue TEXT
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS players (
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

    db.run(`
      CREATE TABLE IF NOT EXISTS contacts (
        id INTEGER PRIMARY KEY,
        name TEXT,
        email TEXT,
        message TEXT,
        submittedAt TEXT
      )
    `);

    db.get('SELECT COUNT(*) AS count FROM matches', (err, row) => {
      if (!err && row.count === 0) {
        const matches = [
          ['2018-06-14', 2018, 'Group', 'Russia', 'Saudi Arabia', 5, 0, 'Russia', ''],
          ['2018-06-15', 2018, 'Group', 'Egypt', 'Uruguay', 0, 1, 'Uruguay', ''],
          ['2018-06-16', 2018, 'Group', 'Portugal', 'Spain', 3, 3, 'Draw', ''],
          ['2014-07-13', 2014, 'Final', 'Germany', 'Argentina', 1, 0, 'Germany', ''],
          ['2014-07-08', 2014, 'Semi', 'Argentina', 'Netherlands', 0, 0, 'Argentina', ''],
          ['2010-07-11', 2010, 'Final', 'Spain', 'Netherlands', 1, 0, 'Spain', ''],
          ['2022-12-18', 2022, 'Final', 'Argentina', 'France', 3, 3, 'Argentina', ''],
          ['2026-11-20', 2026, 'Group', 'United States', 'Germany', 0, 0, '', ''],
          ['2026-11-21', 2026, 'Group', 'Brazil', 'Spain', 0, 0, '', '']
        ];

        const insertMatch = db.prepare(`
          INSERT INTO matches (date, year, stage, homeTeam, awayTeam, homeGoals, awayGoals, winner, venue)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        matches.forEach(match => insertMatch.run(match));
        insertMatch.finalize();
      }
    });

    db.get('SELECT COUNT(*) AS count FROM players', (err, row) => {
      if (!err && row.count === 0) {
        const players = [
          ['Lionel Messi', 'Argentina', 'Forward', 35, 10, 7, 3, 9.7],
          ['Kylian Mbappé', 'France', 'Forward', 26, 10, 6, 2, 9.4],
          ['Neymar Jr.', 'Brazil', 'Forward', 31, 10, 5, 4, 9.1],
          ['Harry Kane', 'England', 'Forward', 30, 9, 4, 1, 8.8],
          ['Luka Modrić', 'Croatia', 'Midfielder', 38, 10, 2, 5, 8.6]
        ];

        const insertPlayer = db.prepare(`
          INSERT INTO players (name, team, position, age, jersey, goals, assists, rating)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);
        players.forEach(player => insertPlayer.run(player));
        insertPlayer.finalize();
      }
    });
  });
}

app.use(express.static(path.join(__dirname), {
  etag: false,
  lastModified: false,
  setHeaders: (res, filePath) => {
    if (path.basename(filePath) === 'data.json') {
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    }
  }
}));

app.get('/data.json', (req, res) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.sendFile(path.join(__dirname, 'data.json'));
});

app.get('/api/matches', (req, res, next) => {
  db.all('SELECT * FROM matches ORDER BY date ASC', (err, rows) => {
    if (err) {
      return next(new Error('Failed to fetch matches: ' + err.message));
    }
    res.json({
      success: true,
      count: rows.length,
      data: rows
    });
  });
});

app.get('/api/players', (req, res, next) => {
  db.all('SELECT * FROM players ORDER BY goals DESC, assists DESC', (err, rows) => {
    if (err) {
      return next(new Error('Failed to fetch players: ' + err.message));
    }
    res.json({
      success: true,
      count: rows.length,
      data: rows
    });
  });
});

// Add new match
app.post('/api/matches', (req, res, next) => {
  try {
    const { date, year, stage, homeTeam, awayTeam, homeGoals, awayGoals, winner, venue } = req.body;
    
    // Validate required fields
    if (!date) throw new ValidationError('Date is required', 'date');
    if (!homeTeam) throw new ValidationError('Home team is required', 'homeTeam');
    if (!awayTeam) throw new ValidationError('Away team is required', 'awayTeam');
    
    // Validate date format
    if (!validators.isValidDate(date)) {
      throw new ValidationError('Invalid date format. Use YYYY-MM-DD', 'date');
    }
    
    // Validate teams are different
    if (homeTeam.toLowerCase() === awayTeam.toLowerCase()) {
      throw new ValidationError('Home and away teams cannot be the same', 'awayTeam');
    }
    
    // Validate year
    const matchYear = year || new Date(date).getFullYear();
    if (!validators.isValidYear(matchYear)) {
      throw new ValidationError('Invalid year. Must be between 1930 and 2100', 'year');
    }
    
    // Validate goals
    const homeGoalsNum = validators.sanitizeInt(homeGoals);
    const awayGoalsNum = validators.sanitizeInt(awayGoals);
    if (homeGoalsNum < 0 || awayGoalsNum < 0) {
      throw new ValidationError('Goals cannot be negative', 'homeGoals');
    }

    const sanitizedData = {
      date,
      year: matchYear,
      stage: validators.sanitizeString(stage || ''),
      homeTeam: validators.sanitizeString(homeTeam),
      awayTeam: validators.sanitizeString(awayTeam),
      homeGoals: homeGoalsNum,
      awayGoals: awayGoalsNum,
      winner: validators.sanitizeString(winner || ''),
      venue: validators.sanitizeString(venue || '')
    };

    db.run(
      `INSERT INTO matches (date, year, stage, homeTeam, awayTeam, homeGoals, awayGoals, winner, venue)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [sanitizedData.date, sanitizedData.year, sanitizedData.stage, sanitizedData.homeTeam, 
       sanitizedData.awayTeam, sanitizedData.homeGoals, sanitizedData.awayGoals, 
       sanitizedData.winner, sanitizedData.venue],
      function(err) {
        if (err) {
          return next(new ValidationError('Failed to add match: ' + err.message));
        }
        res.status(201).json({ 
          id: this.lastID, 
          message: 'Match added successfully',
          data: { ...sanitizedData, id: this.lastID }
        });
      }
    );
  } catch (err) {
    next(err);
  }
});

// Add new player
app.post('/api/players', (req, res, next) => {
  try {
    const { name, team, position, age, jersey, goals, assists, rating } = req.body;
    
    // Validate required fields
    if (!name) throw new ValidationError('Player name is required', 'name');
    if (!team) throw new ValidationError('Team is required', 'team');
    
    // Validate optional fields if provided
    const ageNum = age !== undefined ? validators.sanitizeInt(age) : 0;
    const jerseyNum = jersey !== undefined ? validators.sanitizeInt(jersey) : 0;
    const goalsNum = goals !== undefined ? validators.sanitizeInt(goals) : 0;
    const assistsNum = assists !== undefined ? validators.sanitizeInt(assists) : 0;
    const ratingNum = rating !== undefined ? validators.sanitizeFloat(rating) : 0;
    
    if (age !== undefined && !validators.isValidAge(ageNum)) {
      throw new ValidationError('Age must be between 15 and 50', 'age');
    }
    
    if (jerseyNum < 0 || jerseyNum > 99) {
      throw new ValidationError('Jersey number must be between 0 and 99', 'jersey');
    }
    
    if (goalsNum < 0 || assistsNum < 0) {
      throw new ValidationError('Goals and assists cannot be negative', 'goals');
    }
    
    if (position && !validators.isValidPosition(position)) {
      throw new ValidationError('Invalid position. Must be Forward, Midfielder, Defender, or Goalkeeper', 'position');
    }
    
    if (ratingNum !== 0 && !validators.isValidRating(ratingNum)) {
      throw new ValidationError('Rating must be between 0 and 10', 'rating');
    }

    const sanitizedData = {
      name: validators.sanitizeString(name),
      team: validators.sanitizeString(team),
      position: position ? validators.sanitizeString(position) : '',
      age: ageNum,
      jersey: jerseyNum,
      goals: goalsNum,
      assists: assistsNum,
      rating: ratingNum
    };

    db.run(
      `INSERT INTO players (name, team, position, age, jersey, goals, assists, rating)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [sanitizedData.name, sanitizedData.team, sanitizedData.position, sanitizedData.age, 
       sanitizedData.jersey, sanitizedData.goals, sanitizedData.assists, sanitizedData.rating],
      function(err) {
        if (err) {
          return next(new ValidationError('Failed to add player: ' + err.message));
        }
        res.status(201).json({ 
          id: this.lastID, 
          message: 'Player added successfully',
          data: { ...sanitizedData, id: this.lastID }
        });
      }
    );
  } catch (err) {
    next(err);
  }
});

app.post('/api/contact', (req, res, next) => {
  try {
    const { name, email, message } = req.body;
    
    // Validate required fields
    if (!name) throw new ValidationError('Name is required', 'name');
    if (!email) throw new ValidationError('Email is required', 'email');
    if (!message) throw new ValidationError('Message is required', 'message');
    
    // Validate email format
    if (!validators.isValidEmail(email)) {
      throw new ValidationError('Invalid email format', 'email');
    }
    
    // Validate message length
    if (String(message).trim().length < 10) {
      throw new ValidationError('Message must be at least 10 characters', 'message');
    }
    if (String(message).length > 5000) {
      throw new ValidationError('Message must not exceed 5000 characters', 'message');
    }

    const sanitizedData = {
      name: validators.sanitizeString(name),
      email: validators.sanitizeString(email).toLowerCase(),
      message: validators.sanitizeString(message),
      submittedAt: new Date().toISOString()
    };

    db.run(
      `INSERT INTO contacts (name, email, message, submittedAt)
       VALUES (?, ?, ?, ?)`,
      [sanitizedData.name, sanitizedData.email, sanitizedData.message, sanitizedData.submittedAt],
      function(err) {
        if (err) {
          return next(new ValidationError('Failed to save contact message: ' + err.message));
        }
        res.status(201).json({ 
          id: this.lastID, 
          message: 'Contact message received successfully',
          data: { id: this.lastID, email: sanitizedData.email, submittedAt: sanitizedData.submittedAt }
        });
      }
    );
  } catch (err) {
    next(err);
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  initializeDatabase();
});

// 404 handler (must be after all routes)
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString()
  });
});

// Global error handler (must be last)
app.use(errorHandler);
