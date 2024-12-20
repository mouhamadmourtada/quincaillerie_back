const { AppError } = require('../utils/errors');
const { ValidationError: SequelizeValidationError, DatabaseError, UniqueConstraintError } = require('sequelize');

const handleSequelizeValidationError = (err) => {
    const message = Object.values(err.errors).map(val => val.message).join('. ');
    return new AppError(message, 400);
};

const handleSequelizeUniqueConstraintError = (err) => {
    const field = err.errors[0].path;
    return new AppError(`${field} already exists`, 409);
};

const handleSequelizeDatabaseError = (err) => {
    console.error('Database error:', err);
    return new AppError('Database operation failed', 500);
};

const handleJWTError = () => new AppError('Invalid token. Please log in again.', 401);

const handleJWTExpiredError = () => new AppError('Your token has expired. Please log in again.', 401);

const sendErrorDev = (err, res) => {
    console.error('Error:', err);
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message
    });
};

const sendErrorProd = (err, res) => {
    // Erreur opérationnelle : envoyer le message à l'utilisateur
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
    } 
    // Erreur de programmation : ne pas divulguer les détails
    else {
        console.error('ERROR:', err);
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong'
        });
    }
};

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    } else {
        let error = { ...err };
        error.message = err.message;

        if (err instanceof SequelizeValidationError) error = handleSequelizeValidationError(err);
        if (err instanceof UniqueConstraintError) error = handleSequelizeUniqueConstraintError(err);
        if (err instanceof DatabaseError) error = handleSequelizeDatabaseError(err);
        if (err.name === 'JsonWebTokenError') error = handleJWTError();
        if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();

        sendErrorProd(error, res);
    }
};
