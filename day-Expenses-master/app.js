/*const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Sequelize = require('sequelize');

const User = require('./model/user');
const Expense = require('./model/expenses');
const sequelize = require('./util/database');
const { error } = require('console');
const bcrypt = require('bcrypt');
const jwt  = require('jsonwebtoken');


const app = express();
app.use(express.json());
app.use(cors());


app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

function isStringInvalid(string){
  if(string == undefined || string.length === 0){
    return true;
  }
  else
{
  return false;
}
}


function generateAccessToken(id,name){
  return jwt.sign({userId : id, name : name},'8565566ksjdnjsncjsdsjidsdbiskodvbijbvciudiuchdiufcuic');
}
app.post('/users/login', async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    // Retrieve the user from the database by email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Compare the provided password with the hashed password stored in the database using bcrypt
    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'An error occurred while comparing passwords' });
      }

      if (result) {
        res.status(200).json({ message: 'Successfully Logged In',token : generateAccessToken(user[0].id,user[0].name) });
      } else {
        res.status(401).json({ message: 'Invalid email or password' });
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'An error occurred' });
  }
});

app.post('/users/signup', async (req, res, next) => {
  try {
    const name = req.body.name; // Lowercase 'name' variable
    const email = req.body.email;
    const password = req.body.password;

    // Check if any of the input fields are invalid
    if (isStringInvalid(name) || isStringInvalid(email) || isStringInvalid(password)) {
      return res.status(401).json({ err: "Bad Parameter, Something is missing" });
    }

    // Hash the password using bcrypt
    bcrypt.hash(password, 10, async (err, hash) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'An error occurred while hashing the password' });
      }

      // Create a user with the hashed password
      try {
        const createdUser = await User.create({ name, email, password: hash });
        res.status(201).json({ message: 'User created successfully' });
      } catch (userCreationError) {
        console.error(userCreationError);
        res.status(500).json({ message: 'An error occurred while creating the user' });
      }
    });

  } catch (error) {
    // Handle errors here and send an appropriate error response
    console.error(error);
    res.status(500).json({ message: 'An error occurred' });
  }
});


app.post('/expenses/addExpens', async (req, res, next) => {
  try {
    const Expens = req.body.expen;
    const Description = req.body.desc;
    const Category = req.body.cate;

    // Validate input here if needed

    const data = await Expense.create({
      expenceAmmount: Expens, // Corrected property names
      description: Description, // Corrected property names
      category: Category, // Corrected property names
    });

    res.status(201).json({ newExpense: data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.get("/expenses/get-expenses", async(req,res,next)=>{
  try {
    const expenses = await Expense.findAll();
    res.status(200).json({ allExpence: expenses });
} catch (error) {
    res.status(500).json({ error: error });
  }
})

app.delete("/expenses/delete-expens/:id", async (req, res, next) => {
  try {
    const uid = req.params.id;
    console.log(uid);

    if (!uid) {
      return res.status(400).json({ error: "Id is Missing" });
    }

    await Expense.destroy({ where: { id: uid } });
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
  }
});


User.hasMany(Expense);
Expense.belongsTo(User);



sequelize.sync({force: true}).
then((result)=>{
 // console.log(result);
  app.listen(4000, () => {
    console.log('Server is running on port 4000');
  });

})
.catch((error)=>{
  console.log(error);
})
*/
/*
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./util/database');
const userRoutes = require('./routes/user');
const expenseRoutes = require('./routes/expense');

const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

const User = require('./model/user');
const Expense = require('./model/expenses');
User.hasMany(Expense);
Expense.belongsTo(User);


// Helper function to check if a string is invalid
function isStringInvalid(string) {
  return string === undefined || string.length === 0;
}

// Function to generate JWT access token
function generateAccessToken(id, name) {
  const jwtSecretKey = process.env.JWT_SECRET_KEY || 'default-secret-key';
  return jwt.sign({ userId: id, name }, jwtSecretKey);
}

app.use("user",userRoutes);
app.use("expenses",expenseRoutes);
// User login endpoint

app.post('/users/login', async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    // Retrieve the user from the database by email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Compare the provided password with the hashed password stored in the database using bcrypt
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      const token = generateAccessToken(user.id, user.name);
      res.status(200).json({ message: 'Successfully Logged In', token });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'An error occurred' });
  }
});

// User signup endpoint
app.post('/users/signup', async (req, res, next) => {
  try {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    if (isStringInvalid(name) || isStringInvalid(email) || isStringInvalid(password)) {
      return res.status(401).json({ err: 'Bad Parameter, Something is missing' });
    }

    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a user with the hashed password
    const createdUser = await User.create({ name, email, password: hashedPassword });

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred' });
  }
});

// Add expense endpoint
app.post('/expenses/addExpens', async (req, res, next) => {
  try {
    const Expens = req.body.expen;
    const Description = req.body.desc;
    const Category = req.body.cate;

    const data = await Expense.create({
      expenseAmount: Expens,
      description: Description,
      category: Category,
    });

    res.status(201).json({ newExpense: data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

// Get all expenses endpoint
app.get('/expenses/get-expenses', async (req, res, next) => {
  try {
    const expenses = await Expense.findAll();
    res.status(200).json({ allExpense: expenses });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

// Delete expense by ID endpoint
app.delete('/expenses/delete-expens/:id', async (req, res, next) => {
  try {
    const uid = req.params.id;

    if (!uid) {
      return res.status(400).json({ error: 'Id is Missing' });
    }

    await Expense.destroy({ where: { id: uid } });
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
  }
});

// Define associations between User and Expense models


// Sync Sequelize and start the server
sequelize.sync({ force: true }).then((result) => {
  app.listen(4000, () => {
    console.log('Server is running on port 4000');
  });
}).catch((error) => {
  console.log(error);
});*/

const path = require('path');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./util/database');
const helmet = require('helmet');
const morgan = require('morgan'); 
const compression = require('compression');
const userRoutes = require('./routes/user');
const expenseRoutes = require('./routes/expense');
const purchaseRoutes = require('./routes/purchase');
const resetPasswordRoutes = require('./routes/resetpassword')

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Expense = require('./model/expenses');
const Order = require('./model/orders');
const Forgotpassword = require('./model/forgotpassword');
const premiumFeatureRoutes = require('./routes/premiumFeature');


const accessLogStream = fs.createWriteStream(
  path.join(__dirname,'access.log'),
  {
    flags:'a'
  }
)


const app = express();
app.use(express.json());
const dotenv = require('dotenv');

// get config vars
dotenv.config();
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(morgan('combined',{stream:accessLogStream}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

const User = require('./model/user');
//const Expense = require('./model/expenses');

// Define associations between User and Expense models


app.use('/users', userRoutes);
app.use('/expenses', expenseRoutes);
app.use('/purchase',purchaseRoutes);
app.use('/premium', premiumFeatureRoutes );
app.use('/password', resetPasswordRoutes);




User.hasMany(Expense);
Expense.belongsTo(User);
User.hasMany(Order);
Order.belongsTo(User);
User.hasMany(Forgotpassword);
Forgotpassword.belongsTo(User);

sequelize.sync().then((result) => {
  app.listen(4000, () => {
    console.log('Server is running on port 4000');
  });
}).catch((error) => {
  console.error(error);
});



