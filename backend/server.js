const path = require('node:path');
const express = require('express');
require('./database/init');
const catalogRoutes = require('./routes/catalog.routes');
const { notFound, errorHandler } = require('./middlewares/error-handler');

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const frontendPath = path.join(__dirname, '..', 'frontend');

app.disable('x-powered-by');
app.use(express.json({ limit: '100kb' }));

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok', service: 'confeitaria-api' });
});

app.use('/api', catalogRoutes);
app.use(express.static(frontendPath));
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Confeitaria disponível em http://localhost:${PORT}`);
});
