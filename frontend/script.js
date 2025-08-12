const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        alert(`Welcome ${data.user.name} (${data.user.role})`);
        localStorage.setItem('token', data.token); // Store JWT
        // Redirect to dashboard or role-based route
        // window.location.href = '/dashboard.html';
      } else {
        alert(data.msg || 'Login failed');
      }
    } catch (err) {
      alert('Server error. Try again later.');
      console.error(err);
    }
  });
}

if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const role = document.getElementById('regRole').value;

    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await res.json();

      if (res.ok) {
        alert('Registration successful! Redirecting to login...');
        window.location.href = 'login.html'; // Redirect to login page
      } else {
        alert(`${data.msg || 'Registration failed. Try again.'}`);
      }
    } catch (err) {
      console.error(err);
      alert('Server error. Please try again later.');
    }
  });
}
