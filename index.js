const submitForm = async (e) => {
  const email = document.getElementById("input-text").value;
  var validate = validateEmail(email);
  const username = "admin";
  const password = "admin";
  const baseUrl = new URL(`https://monopoly-dao.herokuapp.com/api`);
  const loginUrl = "/authenticate";
  const registerEmailUrl = "/email-registrations";

  if (!email) {
    alert("Please enter valid username");
    return;
  }

  if (!validate) {
    alert("Please enter valid email");
    return;
  }
  // Change status of button to submitting
  document.getElementById("input-btn").innerHTML = "Submitting...";

  if (document.getElementById("input-btn").innerText == "Submitting...") {
    document.getElementById("input-btn").disabled = true;
  }

  //   Login request to back end to get token
  const loginRequest = await fetch(baseUrl + loginUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
    }),
  });

  if (loginRequest.status == 401) {
    alert("Unauthorized Client");
    return;
  }

  //   Get token from backend
  const data = await loginRequest.json();
  const token = data.id_token;
  //   Make post request to save email in database
  const saveEmail = await fetch(baseUrl + registerEmailUrl, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
    }),
  });

  if (saveEmail.status == 400) {
    document.getElementById("fail-message").style.display = "block";
    setTimeout(reloadPage, 5000);
    return;
  }

  document.getElementById("form-input").style.display = "none";
  document.getElementById("success-message").style.display = "block";
  setTimeout(reloadPage, 5000);
  return;
};

function validateEmail(email) {
  var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

const reloadPage = () => {
  location.reload();
};
