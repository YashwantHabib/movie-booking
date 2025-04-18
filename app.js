const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bcrypt = require('bcrypt');

const db=mysql.createConnection({
    host :'localhost',
    user : 'root',
    password : 'user',
    database : 'moviehall'
});

db.connect((err) => {
    if(err){
        console.log('Error connecting...');
    }
    else{
        console.log('Mysql Connected...');
    }
})

const app = express();
app.use(cors());
app.use(express.json());

async function comparePasswords(enteredPassword, hashedPassword) {
    const match = await bcrypt.compare(enteredPassword, hashedPassword);
    return match;
}

app.post("/signup", async (req, res) => {
    const { username, email, pass } = req.body;
    console.log(username,email,pass);
    // Check if the email is already taken
    const emailCheckQuery = `SELECT * FROM users WHERE email = ?`;
    db.query(emailCheckQuery, [email], async (emailCheckError, emailCheckResults) => {
        if (emailCheckError) {
            return res.status(500).json({ error: 'Database error' });
        }

        if (emailCheckResults.length > 0) {
            return res.status(409).json({ error: 'Email already taken' });
        }

        // Email is not taken, proceed with signup
        const hashedPassword = await bcrypt.hash(pass, 10);

        // Insert the new user into the database
        const insertUserQuery = `INSERT INTO users (username, email, password, is_admin) VALUES (?, ?, ?, false)`;
        db.query(insertUserQuery, [username, email, hashedPassword], (signupError, signupResults) => {
            if (signupError) {
                return res.status(500).json({ error: 'Database error' });
            }

            return res.status(200).json({ message: 'User registered successfully', userId: signupResults.insertId });
        });
    });
});

app.post('/login', (req, res) => {
    const { email, pass } = req.body;

    // Check if the user with the provided email exists
    const userQuery = 'SELECT * FROM users WHERE email = ?';
    db.query(userQuery, [email], async (userError, userResults) => {
        if (userError) {
            return res.status(500).json({ error: 'Database error' });
        }

        if (userResults.length === 0) {
            return res.status(401).json({ error: 'User not found' });
        }

        // User found, compare the entered password with the stored hash
        const hashedPassword = userResults[0].password;
        const passwordMatch = await comparePasswords(pass, hashedPassword);

        if (passwordMatch) {

            // Passwords match, user is authenticated
            res.status(200).json({ message: userResults });
            // const loggedInQuery ='SELECT user_id FROM users WHERE email = ?';
            // db.query(loggedInQuery, [email], async (userError, userResults) => {
        } else {
            // Passwords do not match
            res.status(401).json({ error: 'Invalid password' });
        }
    });
});

app.post('/userDetail', (req, res) => {
    const uid = req.body.userId;

    // Check if the user with the provided email exists
    const userQuery = 'SELECT username FROM users WHERE user_id = ?';
    db.query(userQuery, [uid], async (userError, userResults) => {
        if (userError) {
            return res.status(500).json({ error: 'Database error' });
        }

        if (userResults.length === 0) {
            return res.status(401).json({ error: 'User not found' });
        }

        
        res.status(200).json({ message: userResults });
           
    });
});

app.get('/api/movies', (req, res) => {
    const query = 'SELECT * FROM movies';

    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }

        res.status(200).json(results);
    });
});

app.get('/api/upcoming', (req, res) => {
    const query = 'SELECT * FROM upcoming';

    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }

        res.status(200).json(results);
    });
});
app.get('/api/shows', (req, res) => {
    const query = 'SELECT * FROM shows';

    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }

        res.status(200).json(results);
    });
});
app.get('/api/showSpec', (req, res) => {
    const { movieId, showDate, showTime } = req.query;
    const query = 'SELECT show_id FROM shows WHERE movie_id = ? AND show_date = ? AND show_time = ?';
  
    db.query(query, [movieId, showDate, showTime], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
      }
  
      res.status(200).json(results);
    });
  });

  app.get('/api/checkSeatAvailability', (req, res) => {
    const { showId } = req.query;
  
    // Perform the database query to get available seats for the show
    const query = 'SELECT * FROM seats WHERE show_id = ?';
    db.query(query, [showId], (err, results) => {
      if (err) {
        console.error('Error checking seat availability:', err);
        return res.status(500).json({ error: 'Error checking seat availability' });
      }
      res.status(200).json(results);
    });
  });



// API endpoint for booking tickets
app.post('/api/bookings', (req, res) => {
    const { userId, movieId, showId, seatsBooked, numberOfSeats, totalPrice, bookingDate } = req.body;
  
    const query = `
      INSERT INTO bookings (user_id, movie_id, show_id, seats_booked, number_of_seats, total_price, booking_date)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
  
    db.query(query, [userId, movieId, showId, seatsBooked, numberOfSeats, totalPrice, bookingDate], (err, results) => {
      if (err) {
        console.error('Booking failed:', err);
        return res.status(500).json({ error: 'Booking failed' });
      }
  
      console.log('Booking successful:', results);
      res.status(200).json({ message: 'Booking successful' });
    });
  });

  app.post('/api/bookSeats', (req, res) => {
    const { showId, selectedSeats } = req.body;
  
    // Iterate through the selectedSeats array and insert a new row for each seat
    selectedSeats.forEach(seatNumber => {
      // Perform the database insert operation here
      const query = 'INSERT INTO seats (show_id, seat_number) VALUES (?, ?)';
      db.query(query, [showId, seatNumber], (err, result) => {
        if (err) {
          console.error('Error inserting seat:', err);
          return res.status(500).json({ error: 'Error booking seats' });
        }
        console.log(`Seat ${seatNumber} booked successfully`);
      });
    });
  
    res.status(200).json({ message: 'Seats booked successfully' });
  });

app.listen('3000',() =>{
    console.log("server started on port 3000");
})

app.get('/api/bookings/:userId', (req, res) => {
    const userId = req.params.userId;
    const query = 'SELECT b.*, m.image_url , m.title FROM bookings b INNER JOIN movies m ON b.movie_id = m.movie_id WHERE b.user_id = ?';
  
    db.query(query, userId, (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.status(200).json(results);
    });
  });