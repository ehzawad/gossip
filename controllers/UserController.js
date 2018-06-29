var log = require('logger').createLogger();
var logger = require('logger').createLogger('development.log'); // logs to a file


exports.get_user = function(req, res){
    try {
        log.info("success");

        res.status(200).json({
            success: true,
            message: "get user data",
            data: {
                    title: "lala",
                    description: "mumu"
                }

        })
    } catch(error){
        log.error(error);
        logger.error(error);

        res.status(500).json({
            success: false,
            message: error,
            data: []
        })

    }
}

exports.get_user = function(req, res){
    try {
        log.info("success");

        res.status(200).json({
            success: true,
            message: "get single blog data for id "+req.params.id,
            data: {
                title: "lala",
                description: "mumu"
            }

        })
    } catch(error){

        log.error(error);
        logger.error(error);

        res.status(500).json({
            success: false,
            message: error,
            data: []
        })

    }

}



exports.post_user = function(req, res){

    try {
        log.info("success");

        res.status(200).json({
            success: true,
            message: "Post blog data",
            data: req.body
        })
    } catch(error){
        log.error(error);
        logger.error(error);

        res.status(500).json({
            success: false,
            message: error,
        })

    }

}


exports.put_user = function(req, res){
    try {
        log.info("success");

        res.status(200).json({
            success: true,
            message: "Updated single blog data for id "+req.params.id,
            data: {
                title: "lala",
                description: "mumu"
            }

        })
    } catch(error){

        log.error(error);
        logger.error(error);

        res.status(500).json({
            success: false,
            message: error,
        })

    }


}



exports.delete_user = function(req, res){
    try {
        log.info("success");

        res.status(200).json({
            success: true,
            message: "get single blog data for id "+req.params.id,
        });

    } catch(error){

        log.error(error);
        logger.error(error);

        res.status(500).json({
            success: false,
            message: error,
        })

    }

}
