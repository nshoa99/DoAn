function errorHandler(err, req, res, next){
    if(err.name === 'UnauthorizedError'){
        return res.status(401).json({message: "Lỗi Unauthorized "})
    }

    if(err.name === 'ValidationError'){
        return res.status(401).json({message: "Lỗi Validation"})
    }

    return res.status(500).json(err);
    
}


module.exports = errorHandler;