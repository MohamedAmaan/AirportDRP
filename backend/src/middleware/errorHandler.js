export const errorHandler = (err, req, res, next) => {
    console.error(err.stack); // Log error for debugging
    
    // Determine the status code, default to 500 if unknown or missing status
    const statusCode = err.statusCode || 500;
  
    res.status(statusCode).json({
      status: 'error',
      message: err.message || 'Internal Server Error',
      code: statusCode,
    });
};
