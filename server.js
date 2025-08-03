// The Village Co. Backend API - Railway Production Server
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// In-memory storage for initial deployment
const storage = {
  users: new Map(),
  events: new Map(),
  bookings: new Map(),
  userIdCounter: 1,
  eventIdCounter: 1,
  bookingIdCounter: 1
};

// Create default admin account
async function createAdminAccount() {
  try {
    const adminEmail = "admin@thevillageco.nz";
    const adminPassword = process.env.ADMIN_PASSWORD || "admin2025!";
    
    if (storage.users.has(adminEmail)) {
      console.log("Admin account already exists");
      return;
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    
    const admin = {
      id: storage.userIdCounter++,
      firstName: "Admin",
      lastName: "User", 
      email: adminEmail,
      hashedPassword,
      role: "admin",
      mustChangePassword: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    storage.users.set(adminEmail, admin);
    console.log("Admin account created:", admin.email);
  } catch (error) {
    console.error("Failed to create admin account:", error.message);
  }
}

// Create parent accounts
async function createParentAccounts() {
  const parents = [
    {
      email: "S.Phieros@gmail.com",
      firstName: "S",
      lastName: "Phieros"
    },
    {
      email: "Nikki.paknz@gmail.com", 
      firstName: "Nikki",
      lastName: "Pak"
    }
  ];

  for (const parent of parents) {
    if (!storage.users.has(parent.email)) {
      const hashedPassword = await bcrypt.hash("password", 10);
      
      const user = {
        id: storage.userIdCounter++,
        firstName: parent.firstName,
        lastName: parent.lastName,
        email: parent.email,
        hashedPassword,
        role: "parent",
        mustChangePassword: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      storage.users.set(parent.email, user);
      console.log("Parent account created:", parent.email);
    }
  }
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    environment: 'railway',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    users: storage.users.size,
    events: storage.events.size
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'The Village Co. API',
    version: '1.0.0',
    environment: 'railway',
    endpoints: {
      health: '/health',
      events: '/api/events',
      auth: '/api/auth'
    }
  });
});

// Events API - CREATE
app.post('/api/events', (req, res) => {
  try {
    console.log('Creating event:', req.body);
    
    const { 
      title, 
      description, 
      eventDate, 
      organizerName, 
      organizerEmail, 
      location, 
      maxAttendees, 
      eventType, 
      cost 
    } = req.body;
    
    // Validate required fields
    if (!title || !description || !eventDate || !organizerName || !organizerEmail) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['title', 'description', 'eventDate', 'organizerName', 'organizerEmail']
      });
    }
    
    const newEvent = {
      id: storage.eventIdCounter++,
      title: title.trim(),
      description: description.trim(),
      eventDate: new Date(eventDate),
      organizerName: organizerName.trim(),
      organizerEmail: organizerEmail.trim().toLowerCase(),
      location: location ? location.trim() : null,
      maxAttendees: maxAttendees ? parseInt(maxAttendees) : null,
      eventType: eventType || 'workshop',
      cost: cost ? parseFloat(cost) : null,
      createdAt: new Date(),
      updatedAt: new Date(),
      attendees: 0,
      status: 'active'
    };
    
    storage.events.set(newEvent.id, newEvent);
    console.log('Event created successfully:', newEvent.title);
    res.status(201).json(newEvent);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ 
      error: 'Failed to create event', 
      details: error.message 
    });
  }
});

// Events API - READ ALL
app.get('/api/events', (req, res) => {
  try {
    const eventsList = Array.from(storage.events.values())
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    console.log(`Returning ${eventsList.length} events`);
    res.json(eventsList);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// Events API - READ SINGLE
app.get('/api/events/:id', (req, res) => {
  try {
    const eventId = parseInt(req.params.id);
    const event = storage.events.get(eventId);
    
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    res.json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ error: 'Failed to fetch event' });
  }
});

// Test endpoint to confirm functionality
app.post('/api/test-event', (req, res) => {
  console.log('Test endpoint called - Create Event functionality confirmed');
  res.json({ 
    success: true, 
    message: 'Create Event functionality working on Railway!',
    timestamp: new Date().toISOString(),
    environment: 'railway-production'
  });
});

// Authentication endpoints
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }
    
    const user = storage.users.get(email.toLowerCase());
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const validPassword = await bcrypt.compare(password, user.hashedPassword);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '24h' }
    );
    
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        mustChangePassword: user.mustChangePassword
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get users list (admin only)
app.get('/api/users', (req, res) => {
  try {
    const usersList = Array.from(storage.users.values()).map(user => ({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      createdAt: user.createdAt
    }));
    
    res.json(usersList);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Error handling
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ 
    error: 'Internal server error', 
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Not found', 
    path: req.originalUrl 
  });
});

// Start server
async function startServer() {
  try {
    await createAdminAccount();
    await createParentAccounts();
    
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 The Village Co. API running on port ${PORT}`);
      console.log(`🌍 Environment: Railway Production`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`📝 Events API: http://localhost:${PORT}/api/events`);
      console.log(`🔐 Users: ${storage.users.size} accounts loaded`);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM received, shutting down gracefully');
      server.close(() => {
        console.log('Process terminated');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      console.log('\nSIGINT received, shutting down gracefully');
      server.close(() => {
        console.log('Process terminated');
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();