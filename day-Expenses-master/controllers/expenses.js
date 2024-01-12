const Expense = require('../model/expenses');
const User = require('../model/user');
const sequelize = require('../util/database');
const AWS = require('aws-sdk'); // Import the AWS SDK


const s3 = new AWS.S3(); 

exports.addExpense = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const Expens = req.body.expen;
    const Description = req.body.desc;
    const Category = req.body.cate;
    //console.log(Expens+" "+Description+" "+Category)
    //we can use magic function =  req.user.createExpense();
    const data = await Expense.create({
        expenceAmmount: Expens,
        description: Description,
        category: Category,
        userId: req.user.id
    },{transaction:t});
    const totalExpenses = Number(req.user.totalExpenses) + Number(Expens);
     console.log(totalExpenses); 
     await User.update({
      totalExpenses : totalExpenses
     },{where :{ id : req.user.id},transaction:t})
     await t.commit();
    res.status(201).json({ newExpense: data, message:"Successfully add Expence" });
  } catch (error) {
     await t.rollback();
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
};
//
exports.getExpense = async (req, res, next) => {
    try {
       //we can use magic function =  req.user.getExpense();
      const expenses = await Expense.findAll({where:{userId: req.user.id}});
      res.status(200).json({ allExpense: expenses});
    } catch (error) {
      res.status(500).json({ error: error });
    }
  };

/*exports.deleteExpense = async (req, res, next) => {
  let t = await sequelize.transaction();
  try {
    const uid = req.params.id;

    if (!uid) {
      return res.status(400).json({ error: 'Id is Missing' });
    }
    const expenses = await Expense.findOne({ where: { id: uid, userId: req.user.id },transaction:t });
    if (!expenses) {
      return res.status(404).json({ error: 'Expense not found' });
    }
   // console.log("..................E......."+expenses.expenceAmmount);
    await expenses.destroy({ transaction: t });
    const totalExpenses = Number(req.user.totalExpenses) - Number(expenses.expenceAmmount);

    await t.commit()
    res.sendStatus(200).json({ message: 'Expense deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
  }
};*/
exports.deleteExpense = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const uid = req.params.id;

    if (!uid) {
      return res.status(400).json({ error: 'Id is Missing' });
    }

    // Check if the expense with the given ID exists and belongs to the user
    const expense = await Expense.findOne({ where: { id: uid, userId: req.user.id } });

    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    // Delete the expense without subtracting from the user's total expenses
    await expense.destroy({ transaction: t });

    const totalExpenses = Number(req.user.totalExpenses) - Number(expense.expenceAmmount);

    // Update the user's total expenses
    await User.update(
      { totalExpenses: totalExpenses },
      { where: { id: req.user.id }, transaction: t }
    );

    // Commit the transaction
    await t.commit();

    // Send a success response
    res.status(200).json({ message: 'Expense deleted successfully' });
  } catch (err) {
    // Roll back the transaction in case of an error
    await t.rollback();
    console.error(err);
    res.status(500).json({ error: err });
  }
};

exports.downloadExpenses = async (req,res)=>{
  try {
    if (!req.user.ispremiumuser) {
      return res.status(401).json({ success: false, message: 'User is not a premium User' });
    }
  
    const s3Params = {
      Bucket: 'casspian',
      Key: 'NodeJsprojecttask8.png',
      ResponseContentDisposition: 'attachment',
      Expires: 3600, // URL expiration time in seconds (1 hour in this example)
    };

    // Generate the pre-signed URL
    const fileUrl = await s3.getSignedUrl('getObject', s3Params);
    console.log(fileUrl);
    res.status(201).json({ success: true, fileUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'An error occurred while generating the file URL' });
  }
}

