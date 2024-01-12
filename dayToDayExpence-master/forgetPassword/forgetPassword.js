let item = document.getElementById('forgetPassword');
item.addEventListener('click', forgetPass);

async function forgetPass() {
    var email = document.getElementById('email').value;
    const userDetails = {
        email
    }

    try {
        let response = await axios.post("http://localhost:4000/password/forgotpassword", userDetails);

        if (response.status === 202) {
            // Use innerHTML to update the existing error container with a success message.
            document.body.innerHTML += '<div style="color:red;">Link to reset password sent to your mail <div>'
          // alert("successfully")
        } else {
            // Use innerHTML to update the error container with an error message.
            throw new Error('Something went wrong!!!')
        }
    } catch (error) {
        // Sanitize the error message before rendering it in the HTML.
        document.body.innerHTML += `<div style="color:red;">${error} <div>`;
     
    }
}

function sanitizeError(input) {
    // Use this function to sanitize the error message before rendering it in the HTML.
    // You can implement your own logic to sanitize the error message.
    // For example, you can use DOMPurify to sanitize potentially unsafe content.
    return input;
}