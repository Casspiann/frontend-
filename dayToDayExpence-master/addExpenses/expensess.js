var item = document.getElementById("Submit");
var itemList = document.getElementById('items');
let currentPage = 1;
//let expensesPerPage = 10;
let totalPages;
let allExpenses = [];
//let expensesPerPage = Number(document.getElementById('rowsper').value);
//console.log(expensesPerPage);
let expensesPerPage = Number(localStorage.getItem('expensesPerPage'));

// If 'expensesPerPage' is not set in localStorage, set it to the default value (10)
if (expensesPerPage === null) {
    expensesPerPage = 10;
}
//console.log(typeof(expensesPerPage));




function parseJwt(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atob(base64));
  return JSON.parse(jsonPayload);
}
function showPremiumUserMessage(){
  let division2 = document.getElementById('division2');
  let button2 = document.createElement('button');

  button2.type = "button";
  button2.id = "Show-leaderboard";
  button2.appendChild(document.createTextNode("Show Leaderboard"));

  let division1 = document.getElementById('division1');
  let h3 = document.createElement('h3');
  h3.style.color = "red";
  h3.appendChild(document.createTextNode("You are a premium user"));
  division1.appendChild(h3);

  let button1 = document.getElementById('rzp-button1');
  button1.style.display = "none";

  button2.addEventListener('click', async function() {
    // When the "Show Leaderboard" button is clicked, display the leaderboard
    let division3 = document.getElementById('division3');
    let h1 = document.createElement('h1');
    h1.style.marginLeft = "10%";
    h1.appendChild(document.createTextNode('Leaderboard'));
    division3.appendChild(h1);
    const token = localStorage.getItem('token'); // Retrieve the token
    const leaderBoard = await axios.get("http://localhost:4000/premium/showLeaderboard", { headers: { 'Authorization': token } });
    console.log(leaderBoard);
    let unoli = document.getElementById('unlist');
    
    for (let i = 0; i < leaderBoard.data.leaderBoardOfUser.length; i++) {
      let li = document.createElement('li');
      li.appendChild(document.createTextNode("Name :"+leaderBoard.data.leaderBoardOfUser[i].name + "   totalCost "+leaderBoard.data.leaderBoardOfUser[i].totalExpenses));
      unoli.appendChild(li);
    }
    //alert(leaderBoard.data.message);
    
    // You can load the leaderboard data and populate it here.
    // This code is just creating a title for the leaderboard.
  });

  division2.appendChild(button2);
}

document.addEventListener('DOMContentLoaded', addlist);

function addlist() {
  console.log("addlist function called");
  const token = localStorage.getItem('token');
  const decodedToken = parseJwt(token);
  //alert("hello"+decodedToken);
  const isPremiumMember = decodedToken.ispremiumuser;
  console.log("isPremiumMember:", isPremiumMember);
  if (isPremiumMember) {
    showPremiumUserMessage();
  }
    axios.get("http://localhost:4000/expenses/get-expenses", {headers:{'Authorization':token}})
        .then((response) => {
           allExpenses = response.data.allExpense;
            console.log(allExpenses);

            if (response.data && Array.isArray(response.data.allExpense)) {
                // Update the UI to display only the expenses for the current page
                  displayExpensesForPage(currentPage, allExpenses);

                 // Update pagination buttons
                  updatePaginationUI(currentPage, allExpenses);
            } else {
                console.error('Data is not in the expected format:', response.data);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
    document.getElementById('updatePerPage').addEventListener('click', () => {
      const perPageInput = document.getElementById('expensePerPageInput');
      const expensesPerPage = parseInt(perPageInput.value, 10);
    
    // Store the preference in local storage
      localStorage.setItem('expensesPerPage', expensesPerPage);
    
    // Update the UI to display the new number of expenses
      displayExpensesForPage(currentPage, allExpenses);
      updatePaginationUI(currentPage, allExpenses);
        });
function displayExpensesForPage(page, allExpenses) {
  const startIndex = (page - 1) * expensesPerPage;
  const endIndex = startIndex + expensesPerPage;
  const expensesToDisplay = allExpenses.slice(startIndex, endIndex);
  console.log(expensesToDisplay);

  // Clear the previous list of expenses
  document.getElementById('items').innerHTML = '';

  for (let i = 0; i < expensesToDisplay.length; i++) {
    createListItem(expensesToDisplay[i]);
  }
}
function updatePaginationUI(currentPage, allExpenses) {
  totalPages = Math.ceil(allExpenses.length / expensesPerPage);

  // Update the current page display
  document.getElementById('currentPage').textContent = `Page ${currentPage} of ${totalPages}`;

  // Enable or disable "Next" and "Previous" buttons based on the current page
  document.getElementById('previousPage').disabled = currentPage === 1;
  document.getElementById('nextPage').disabled = currentPage === totalPages;
}
   // Event listener for the "Next" button
   document.getElementById('nextPage').addEventListener('click', () => {
    if (currentPage < totalPages) {
      currentPage++;
     // console.log(currentPage+",,,");
      displayExpensesForPage(currentPage, allExpenses);
      updatePaginationUI(currentPage, allExpenses);
    }
  });
  
// Event listener for the "Previous" button
document.getElementById('previousPage').addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
   // console.log(currentPage+"....");
    displayExpensesForPage(currentPage, allExpenses);
    updatePaginationUI(currentPage, allExpenses);
  }
});









item.addEventListener('click', addExpense);

function addExpense(e) {
    e.preventDefault();
    var expen = document.querySelector("#ExpenseAmount").value;
    var desc = document.querySelector("#description").value;
    var cate = document.querySelector("#category").value;

    var obj = {
        expen,
        desc,
        cate
    };
    const token = localStorage.getItem('token');
    axios.post("http://localhost:4000/expenses/addExpens" ,obj ,{headers:{'Authorization':token}})
    .then((response) => {
        createListItem(response.data.newExpense);
        console.log(response);
    })
    .catch(error => {
        console.log(error);
    });
}
function createListItem(userData) {
    var li = document.createElement('li');
    var text = `Expense: ${userData.expenceAmmount}, Description: ${userData.description}, Category: ${userData.category}`;
    li.appendChild(document.createTextNode(text));

    var delButton = document.createElement('button');
    delButton.appendChild(document.createTextNode('DELETE EXPENSE'));
    delButton.className = "btn btn-dark mr-2";
    delButton.addEventListener('click', function () {
        var id = userData.id;
        const token = localStorage.getItem('token');
       // alert(id);
        axios.delete(`http://localhost:4000/expenses/delete-expens/${id}`,{headers:{'Authorization':token}})
            .then((response) => {
                console.log(response);
                li.remove();
            })
            .catch((error) => {
                console.log(error);
            });
    });

    li.appendChild(delButton);

    itemList.appendChild(li);
}

document.getElementById("rzp-button1").onclick = async function(e) {
  
    try {
      const token = localStorage.getItem('token');
      //alert(token);
  
      // Step 1: Send a GET request to your server to create a Razorpay order
      const response = await axios.get("http://localhost:4000/purchase/premiummembership", {
        headers: { 'Authorization': token }
      });
     console.log(response);
  
      // Step 2: Initialize Razorpay with the order information
     // alert(response.data.key_id+"  "+response.data.order.id)
     const options = {
        "key": response.data.key_id,
        "name": "YAV Technology",
        "order_id": response.data.order.id,
        "prefill": {
          "name": "Yash Prasad",
          "email": "prasadyash2411@gmail.com",
          "contact": "7003442036"
        },
        "theme": {
         "color": "#3399cc"
        },
        handler: async function(response) {
          // Step 3: Send a POST request to update the transaction status on your server
          await axios.post("http://localhost:4000/purchase/updatetransactionstatus", {
            order_id: options.order_id,
            payment_id: response.razorpay_payment_id
          }, {
            headers: { 'Authorization': token }
          });
          localStorage.setItem('isPremiumMember', 'true');
          let division2 = document.getElementById('division2');
          let button2 = document.createElement('button');
          
          button2.type = "button";
          button2.id = "Show-leaderboard";
          button2.appendChild(document.createTextNode("Show Leaderboard"));
          
          let division1 = document.getElementById('division1');
          let h3 = document.createElement('h3');
          h3.style.color = "red";
          h3.appendChild(document.createTextNode("You are a premium user"));
          division1.appendChild(h3);
          
          let button1 = document.getElementById('rzp-button1');
          button1.style.display = "none";
          
          button2.addEventListener('click', async function() {
            // When the "Show Leaderboard" button is clicked, display the leaderboard
            let division3 = document.getElementById('division3');
            let h1 = document.createElement('h1');
            h1.style.marginLeft = "10%";
            h1.appendChild(document.createTextNode('Leaderboard'));
            division3.appendChild(h1);
            const leaderBoard = await axios.get("http://localhost:4000/premium/showLeaderboard", {headers:{'Authorization':token}})
            console.log(leaderBoard);
            let unoli = document.getElementById('unlist') 
            
            for(let i =0;i<leaderBoard.data.leaderBoardOfUser.length; i++){
                 
                 let li = document.createElement('li');
                 li.appendChild(document.createTextNode("Name :"+leaderBoard.data.leaderBoardOfUser[i].name + "   totalCost "+leaderBoard.data.leaderBoardOfUser[i].totalExpenses));
                 unoli.appendChild(li);


            }
          });
          
          division2.appendChild(button2);
          
  
          // Display a success message to the user
          alert("You are a premium user now");
        }
      };
  
      // Step 4: Create and open the Razorpay dialog
      const rzpl = new Razorpay(options);
      rzpl.open();
      e.preventDefault();
     
      rzpl.on('payment.failed', function(response) {
        console.log(response);
        alert('Payment failed. Please try again.');
      });


    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong. Please try again later.');
    }
  };
  function download(){
    const token = localStorage.getItem('token');
   // console.log(token);
    axios.get('http://localhost:4000/expenses/download', { headers: {"Authorization" : token} })
    .then((response) => {
        if(response.status === 201){
            //the bcakend is essentially sending a download link
            //  which if we open in browser, the file would download
            console.log(response);
            var a = document.createElement("a");
            a.href = response.data.fileUrl;
            a.download = 'myexpense.csv';
            a.click();
          console.log("Hello");
        } else {
            throw new Error(response.data.message)
        }

    })
    .catch((err) => {
        showError(err)
    });

  }


