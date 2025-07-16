import express from 'express'
import { errHandler } from './middleware/ErrorHandler'
import DbConnection from './database/db_connection';
import gameRouter from './routes/gameRoute';
import moveRouter from './routes/moveRoute';
import userRouter from './routes/userRoute';
import { NextFunction, Request, Response } from 'express';

const app = express()
const PORT: string = process.env.APP_PORT || '3000';

app.get('/', (req, res) => {
  res.send('Hello TypeScript!')
})
app.use(express.json());

app.use('/api', userRouter);
app.use('/api', gameRouter);
app.use('/api', moveRouter);


DbConnection.init();
app.use(errHandler);
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})

