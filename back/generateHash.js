import bcrypt from 'bcrypt';

const saltRounds = 10; // adjust this value based o security needs
const plaintextPassword = 'password_7'; // Replace with desired password

bcrypt.hash(plaintextPassword, saltRounds, (err, hash) => {
  if (err) {
    console.error('Error generating hash:', err);
  } else {
    console.log('Plain text password:', plaintextPassword);
    console.log('Hashed password:', hash);
  }
});