const crypto = require("crypto");

const guestNames = [
  "John",
  "Francis",
  "Ines",
  "Carlos",
  "Rui",
  "Peter",
  "Margarida",
  "Mariana",
  "Ricardo",
];

function generateUsername(first_name) {
  const first_nameLowerCase = first_name.toLowerCase();
  const randomString = crypto.randomBytes(10).toString("hex");
  const username = first_nameLowerCase + randomString;

  return username;
}

function createGuest() {
  const randomNumber = Math.floor(Math.random() * guestNames.length);
  const randomName = guestNames[randomNumber];

  const first_name = randomName;
  const username = generateUsername(first_name);
  const usernameLowerCase = username; // it's already lowercased
  const email = `${usernameLowerCase}@gmail.com`;
  const password = crypto.randomBytes(250).toString("hex");

  return { first_name, username, usernameLowerCase, email, password };
}

module.exports = { createGuest };
