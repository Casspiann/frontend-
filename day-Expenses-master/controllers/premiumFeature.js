const User = require('../model/user');
const Expense = require('../model/expenses');
const sequelize = require('../util/database');





exports.getUserLeaderboard = async(req,res,next)=>{
    try{
        const leaderBoardOfUser = await User.findAll({
         /* attributes:['id','name',
          [sequelize.fn('sum', sequelize.cast(sequelize.col('expenses.expenceAmmount'), 'DECIMAL')), 'totalCost']
        ],
        include:[
          {
            model:Expense,
            attributes:[]
          }
        ],
        group:['user.id'],*/
        order:[[sequelize.col('totalExpenses'),'DESC']]

        });
       /* const expenses = await Expense.findAll({
          attributes: [
            'userId',
            [sequelize.fn('sum', sequelize.cast(sequelize.col('expenses.expenceAmmount'), 'DECIMAL')), 'totalCost']
          ],
          group: ['userId']
        });
        const userAggegrateExpense = {};
        console.log(expenses);

       /* expenses.forEach(expense => {
            const expenseAmount = parseInt(expense.expenceAmmount, 10); // Convert the string to an integer
            if (!isNaN(expenseAmount)) {
              if (userAggegrateExpense[expense.userId]) {
                userAggegrateExpense[expense.userId] += expenseAmount;
              } else {
                userAggegrateExpense[expense.userId] = expenseAmount;
              }
            }
            
        });

        var userLeaderBoardDetails = [];

        users.forEach(user=>{
            userLeaderBoardDetails.push({ name: user.name, totalCost: userAggegrateExpense[user.id] || 0 });
        })
        userLeaderBoardDetails.sort((a, b) => b.totalCost - a.totalCost);
        console.log(userLeaderBoardDetails);*/
        res.status(200).json({leaderBoardOfUser});
    }
    catch(err){
        console.log(err);
        res.status(500).json({errror:err});
    }
}