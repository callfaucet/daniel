import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Initialize Supabase Client (Admin context if needed, but using anon for now as placeholder)
const SUPABASE_URL = 'https://xzqicfaliuzwfcfzfuum.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6cWljZmFsaXV6d2ZjZnpmdXVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg4MTYyMDAsImV4cCI6MjA4NDM5MjIwMH0.J2rGIgF6OYjRpGPG2ouckgFYzIdC_ss6m3tOpyrhve0';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Middleware to check for auth header
const authMiddleware = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Missing token' });

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
        return res.status(401).json({ error: 'Invalid token' });
    }

    (req as any).user = user;
    next();
};

app.get('/', (req, res) => {
    res.send('Secure Backend API Running');
});

// Example protected route
app.get('/api/protected', authMiddleware, (req, res) => {
    res.json({ message: 'This is protected data', user: (req as any).user });
});

app.listen(port, () => {
    console.log(`Backend listening at http://localhost:${port}`);
});
