class BaseError extends Error {
  constructor({ message, stack, action, statusCode, errorLocationCode }) {
    super();
    this.name = this.constructor.name;
    this.message = message;
    this.action = action;
    this.statusCode = statusCode || 500;
    this.stack = stack;
    this.errorLocationCode = errorLocationCode;
  }
}

export class ValidationError extends BaseError {
  constructor({ message, action, stack, statusCode, errorLocationCode }) {
    super({
      message: message || 'Um erro de validação ocorreu.',
      action: action || 'Ajuste os dados enviados e tente novamente.',
      statusCode: statusCode || 400,
      stack: stack,
      errorLocationCode: errorLocationCode,
    });
  }
}

export class UnauthorizedError extends BaseError {
  constructor({ message, action, stack, errorLocationCode }) {
    super({
      message: message || 'Usuário não autenticado.',
      action: action || 'Verifique se você está autenticado e tente novamente.',
      statusCode: 401,
      stack: stack,
      errorLocationCode: errorLocationCode,
    });
  }
}
