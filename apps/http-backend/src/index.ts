import express from 'express';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.router';
import roomRouter from './routes/room.router'

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cookieParser());

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/room', roomRouter);


async function startServer() {
    try {
        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Server failed to start:", error);
    }
}

startServer();
