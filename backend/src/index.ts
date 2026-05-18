import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes (serão implementadas pelos colegas)
// import routes from './routes';
// app.use('/api', routes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'API VitaLink Online' });
});

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`📚 Documentação em http://localhost:${PORT}/api-docs`);
});
