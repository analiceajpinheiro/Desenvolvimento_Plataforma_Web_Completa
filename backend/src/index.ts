import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes';
import {
  errorHandler,
  jsonErrorHandler,
  requestLoggerMiddleware,
} from './middlewares';

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(jsonErrorHandler);
app.use(requestLoggerMiddleware);

// Routes
app.use('/api', routes);

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'API VitaLink Online', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Rota não encontrada',
    code: 'NOT_FOUND',
    path: req.path,
  });
});

// Error handler (deve ser o último middleware)
app.use(errorHandler);

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`📚 Documentação em http://localhost:${PORT}/api-docs`);
  console.log(`🏥 VitaLink Backend iniciado com sucesso!`);
});
