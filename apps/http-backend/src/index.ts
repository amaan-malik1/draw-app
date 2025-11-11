import express from 'express';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.router';
// import chatRouter from './routes/chat.router';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());

app.post('/api/v1/auth', authRouter);
// app.post('/api/v1/chat', chatRouter);

app.listen(PORT, () => {
    console.log(`HTTP backend server is running on port ${PORT}`);
});
