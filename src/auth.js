import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ffbnnbxpxbltfwtvgrpw.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);


// para toggle sa forms
const loginForm = document.getElementById('loginOverlay');
const signUpForm = document.getElementById('nameOverlay');
const showSignUpButton = document.getElementById('showSignUp');
const showLoginButton = document.getElementById('showLogin');

// para toggle sa forms
const toggleVisibility = (elementToShow, elementToHide) => {
    elementToShow.classList.remove('hidden');
    elementToShow.classList.add('visible');

    elementToHide.classList.remove('visible');
    elementToHide.classList.add('hidden');
};

toggleVisibility(loginForm, signUpForm);

// pang show signup form
showSignUpButton.addEventListener('click', () => {
    toggleVisibility(signUpForm, loginForm);
});

// pang show login form
showLoginButton.addEventListener('click', () => {
    toggleVisibility(loginForm, signUpForm);
});



document.getElementById("login").addEventListener("submit", async function (event) {
  event.preventDefault(); // Prevent default form submission

  const playerEmail = document.getElementById("playerEmailInput").value.trim();
  const playerPassword= document.getElementById("playerPasswordInput").value;
  const feedbackLogin = document.getElementById("feedbackLogin");

  feedbackLogin.textContent = ""; // Clear feedbackLogin on new submission
  console.log("Email:", playerEmail, "Password:", playerPassword);

  let { data, error } = await supabase.auth.signInWithPassword({
    email: playerEmail,
    password: playerPassword
  });

  if (error)
  {
    if (error.message.includes("Email not confirmed")) {
      // Specific error for unverified email
      feedbackLogin.textContent = "Your email is not verified. Please check your inbox for a verification email.";
    } else {
      // Generic error handling
      feedbackLogin.textContent = "Login failed: " + error.message;
    }
    feedback.style.color = "red"; 
  }
    else
    {
      // feedback.textContent = "Succesfully created " + playerEmail;
      // feedback.style.color = "green";
      startGame();

  }
});

document.getElementById("signUp").addEventListener("submit", async function (event) {
  event.preventDefault(); // Prevent default form submission

  const signUpName = document.getElementById("signUpIgnInput").value;
  const signUpEmail = document.getElementById("signUpEmailInput").value.trim();
  const signUpPassword= document.getElementById("signUpPasswordInput").value;
  const feedbackSignUp = document.getElementById("feedbackSignUp");

  feedbackSignUp.textContent = ""; // Clear feedbackSignUp on new submission
  console.log(signUpName,"Email:", signUpEmail, "Password:", signUpPassword);

  let { data, error } = await supabase.auth.signUp({
    email: signUpEmail,
    password: signUpPassword
  });

  if (error)
    {
      feedbackSignUp.textContent = "something went wrong";
      feedbackSignUp.style.color = "red";
    }
    else
    {
      feedbackSignUp.textContent = "Succesfully created " + signUpEmail;
      feedbackSignUp.style.color = "green";
      await supabase
      .from('players')
      .insert([
        { user_id: data.user.id , email: signUpEmail, name: signUpName },
      ])
      .select();
      toggleVisibility(loginForm, signUpForm)
      // startGame();
    }
});


function startGame()
{
  const overlay = document.getElementById("loginOverlay");
  const overlayS = document.getElementById("nameOverlay");
  overlay.style.display = "none";
  overlayS.style.display = "none";
  window.onload();
}