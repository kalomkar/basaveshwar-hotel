const bcrypt = require('bcryptjs');
const hash = '$2a$10$w8T9JzIqkY4E5D4xYd6mG.jGZz0tJqgI1yJzH1yY/9iE3/J.N5w/S';
const password = 'password123';

bcrypt.compare(password, hash).then(res => {
    console.log('Password match:', res);
});
