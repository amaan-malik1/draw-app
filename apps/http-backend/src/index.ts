import express from 'express';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.router';
import { connectDB } from './model/Db';
// import chatRouter from './routes/chat.router';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cookieParser());

app.use('/api/v1/auth', authRouter);
// app.post('/api/v1/chat', chatRouter);


async function startServer() {
    try {
        await connectDB(); // connect to Mongo first
        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Server failed to start:", error);
    }
}

startServer();
