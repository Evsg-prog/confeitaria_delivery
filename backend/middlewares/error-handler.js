//backend/middlewares/error-handler.js

function notFound(_request, response) {
  response.status(404).json({ error: 'Rota não encontrada.' });
}

function errorHandler(error, _request, response, _next) {
  const status = Number.isInteger(error.status) ? error.status : 500;
  if (status >= 500) console.error(error);
  response.status(status).json({
    error: status === 500 ? 'Ocorreu um erro interno.' : error.message
  });
}

module.exports = { notFound, errorHandler };
