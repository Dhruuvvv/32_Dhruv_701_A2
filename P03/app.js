// app.js
import express from 'express';
import session from 'express-session';
import { createClient } from 'redis';
import { RedisStore } from 'connect-redis';

const app = express();
const PORT = 3000;

// Create Redis client
const redisClient = createClient();
await redisClient.connect();

// Create Redis session store
const store = new RedisStore({
  client: redisClient,
});

app.use(express.urlencoded({ extended: true }));

// Setup session middleware
app.use(
  session({
    store: store,
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60000 }, // 1 minute
  })
);

// Login route
app.post('/login', (req, res) => {
  const { username } = req.body;
  if (username) {
    req.session.user = username;
    res.send(`✅ Logged in as ${username}`);
  } else {
    res.status(400).send('❌ Username is required');
  }
});

// Protected route
app.get('/dashboard', (req, res) => {
  if (req.session.user) {
    res.send(`👋 Welcome back, ${req.session.user}`);
  } else {
    res.status(401).send('🔒 Please log in first');
  }
});

// Logout route
app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.send('👋 Logged out');
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
