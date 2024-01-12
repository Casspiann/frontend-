const User = require('../model/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

function isStringInvalid(string) {
    return string === undefined || string.length === 0;
}

// Function to generate JWT access token
function generateAccessToken(id, name, ispremiumuser) {
    
    return jwt.sign({ userId: id, name , ispremiumuser }, 'secretkey');
}

exports.login = async (req, res, next) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        
        // Retrieve the user from the database by email
        const user = await User.findOne({ where: { email } });
        //console.log("................................",user);

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Compare the provided password with the hashed password stored in the database using bcrypt
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch) {
            const token = generateAccessToken(user.id, user.name, user.ispremiumuser);
            res.status(200).json({ message: 'Successfully Logged In', token });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'An error occurred' });
    }
}

exports.signUp = async (req, res, next) => {
    try {
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;

        if (isStringInvalid(name) || isStringInvalid(email) || isStringInvalid(password)) {
            return res.status(401).json({ err: 'Bad Parameter, Something is missing' });
        }
         console.log(name);
        // Hash the password using bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a user with the hashed password
        const createdUser = await User.create({ name, email, password: hashedPassword });

        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred' });
    }
}
