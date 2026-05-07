export const validateRequest = (zodSchema) => {
    return (req, res, next) => {
        try {
            if (req.body.data) {
                req.body = JSON.parse(req.body.data);
            }
        }
        catch (error) {
            return next(error);
        }
        const parseResult = zodSchema.safeParse(req.body);
        if (!parseResult.success) {
            return next(parseResult.error);
        }
        // sanitized and validated data
        req.body = parseResult.data;
        return next();
    };
};
