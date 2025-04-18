

const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");

sign_up_btn.addEventListener("click", () => {
  container.classList.add("sign-up-mode");
});

sign_in_btn.addEventListener("click", () => {
  container.classList.remove("sign-up-mode");
});

const handleSignup = (event) => {
  event.preventDefault();
  const username = document.getElementById("username").value;
  const email = document.getElementById("signup_email").value;
  const pass = document.getElementById("signup_password").value;
  console.log(username, email, pass);

  axios.post("http://localhost:3000/signup", {
      username: username,
      email: email,
      pass: pass
  })
      .then(res => {
          console.log("registered");
          container.classList.remove("sign-up-mode");
      })
      .catch(err => {
        if (err.response.status === 409) {
            console.log("Email already exists");
            // Display a message to the user that the email is already taken
            document.getElementById("error_message").innerHTML = "Email is already taken. Please use a different email.";
        } else {
            console.log(err);
            // Handle other errors appropriately
        }
    });
}

const handleLogin = (event) => {
  event.preventDefault();
  const email = document.getElementById("login_email").value;
  const pass = document.getElementById("login_password").value;

  axios.post('http://localhost:3000/login', {
        email: email,
        pass: pass
    })
    .then(res => {
      console.log('Login successful');
      // const userData = res.data.user;

      // Store user data in localStorage
      localStorage.setItem('userId', res.data.message[0].user_id);

      // Redirect to the home screen
      if(res.data.message[0].is_admin)
      {
        window.location.href = '/front.html';
      }
      else{
        window.location.href = '/home.html';
      }
      
    })
    .catch(err => {
      if (err && err.response && err.response.status === 401) {
          console.log('Invalid credentials');
          // Display a message to the user that the credentials are invalid
          document.getElementById('login-error-message').innerHTML = 'Invalid email or password. Please try again.';
      } else {
          console.log(err);
          // Handle other errors appropriately
      }
  });
}




