const errorHandler = (err, req, res, next) => {
    res.send(err.massage)
}

module.exports = errorHandler;