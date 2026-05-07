import jwt from "jsonwebtoken";
const createToken = (payload, secret, { expiresIn }) => {
    const token = jwt.sign(payload, secret, { expiresIn });
    return token;
};
const verifyToken = (token, secret) => {
    try {
        const decode = jwt.verify(token, secret);
        return {
            success: true,
            data: decode,
        };
    }
    catch (err) {
        return {
            success: false,
            message: err.message,
            err,
        };
    }
};
const decodeToken = (token) => {
    const decoded = jwt.decode(token);
    return decoded;
};
export const jwtUtils = {
    createToken,
    verifyToken,
    decodeToken,
};
