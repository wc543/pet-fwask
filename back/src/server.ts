import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import userRouter from './routes/userRoutes';
import petRouter from './routes/petRoutes';
import formRouter from './routes/formRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.send("Pet Adoption Site API");
});

app.use('/api/users', userRouter);
app.use('/api/pets', petRouter);
app.use('/api/forms', formRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});