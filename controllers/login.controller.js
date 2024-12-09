const jwt = require('jsonwebtoken');

const secretKey = process.env.secretKey; // 
function jwtfn(req, res, next) {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, secretKey, (err, user) => {
            if (err) {
                return res.status(403).json({ error: 'Invalid token' });
            }
            req.user = user; // Attach user information to the request
            next();
        });
    } else {
        res.status(401).json({ error: 'Authorization token is missing' });
    }
};

function login(req, res) {
    
    if(req.body.username){
        const { username } = req.body;
        
        // Simple example, replace this with actual user authentication logic
        if ( username!='naveen') {
            return res.status(400).json({ error: 'Username is not valid' });
        }

        // Generate a token
        const token = jwt.sign({ username }, secretKey, { expiresIn: '24h' });
        res.json({ token });
    }else{
        res.json({status:400,error:"username not found"})
    }
    
}

module.exports={login,jwtfn};