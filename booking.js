const allSeats = document.querySelectorAll(".seat");
const months=['January','February','March','April','May','June','July','August','September','October','November','December'];
const selectedSeats = [];
var occupiedSeats = [];
const uniqueDates = new Set();
const uniqueTimes = new Set();
var tick=0;
var genre;
var img_url;
var movieName;
var duration=0;
var total=0;
var totalCost = document.getElementById('total');
totalCost.innerHTML=`${total}Rs`;
var seatsString ='';
var dateI = null;
var timeI = null;
var showDate;
var showTime;
const movieId = localStorage.getItem('movieId');
const userId = localStorage.getItem('userId');

function addSeat() {
  const seatIndex = [...allSeats].indexOf(this);

  // Toggle the selected class on the clicked seat
  this.classList.toggle("selected");

  // Check if the seat is already in the selectedSeats array
  const isSelected = selectedSeats.includes(seatIndex);

  if (!isSelected) {
    // If not selected, add it to the array
    selectedSeats.push(seatIndex);
    total=200*selectedSeats.length;
    totalCost.innerHTML=`${total}Rs`;
  } else {
    // If already selected, remove it from the array
    const indexToRemove = selectedSeats.indexOf(seatIndex);
    selectedSeats.splice(indexToRemove, 1);
  }
  
}

allSeats.forEach( item => {
	if(!(item.classList.contains('occupied'))){
    item.addEventListener('click', addSeat);
  }
});

// JavaScript
const dateElements = document.querySelectorAll('.date');
const timesElements = document.querySelectorAll('.times');
dateElements.forEach(dateElement => {
  dateElement.addEventListener('click', () => {
    dateElements.forEach(item=>{
      item.classList.remove('clicked');
    })
      dateElement.classList.toggle('clicked');
  });
});

timesElements.forEach(timesElement => {
  timesElement.addEventListener('click', () => {
    timesElements.forEach(item=>{
      item.classList.remove('clicked');
    })
      timesElement.classList.toggle('clicked');
  });
});
function fetchMovies() {
  axios.get('http://localhost:3000/api/movies')
      .then(res => {
          const movies = res.data;
          movies.forEach(movie => {
            if(movie.movie_id == movieId){
              img_url=movie.image_url;
              document.getElementById('poster').src=img_url;
              
              if(movie.title.length>20){
                movieName = `${movie.title.substring(0,20)}...`;
              }
              else{
                movieName = movie.title;
              }
              document.getElementById('name').innerText=movieName;
              duration=movie.duration;
              document.getElementById('duration').innerText=`${duration}min`;
              genre=movie.genre;
              document.getElementById('genre').innerText=genre;
            }
          });
      })
      .catch(err => {
        console.log(err);
        });   	
}

function fetchShows() {
  axios.get('http://localhost:3000/api/shows')
      .then(res => {
        const shows = res.data;
        const dates=document.getElementById('dates');
        const timings=document.getElementById('timings');
        shows.forEach(show =>{
          if(show.movie_id ==movieId){
            uniqueDates.add(show.show_date);
            uniqueTimes.add(show.show_time);
          }
        })
          uniqueDates.forEach(item =>{
            const date = document.createElement('div');
            date.classList.add('date');
            var actualDate= new Date(item);
            date.innerText=`${actualDate.getDate()} ${months[actualDate.getMonth()]}`
            dates.appendChild(date);
          })
          uniqueTimes.forEach(item =>{
            const times = document.createElement('div');
            times.classList.add('times');
            const [hours, minutes] = item.split(':');
            const actualTime = new Date();
            actualTime.setHours(Number(hours));
            actualTime.setMinutes(Number(minutes));
            times.innerText=`${actualTime.getHours()} : ${actualTime.getMinutes()}`
            timings.appendChild(times);
          })
          const dateElements = document.querySelectorAll('.date');
          const timesElements = document.querySelectorAll('.times');
          const uniqueDatesArray = Array.from(uniqueDates);
          dateElements.forEach((dateElement, index) => {
            dateElement.addEventListener('click', () => {
              dateElements.forEach(item => {
                item.classList.remove('clicked');
              });
              dateElement.classList.toggle('clicked');
              const dateIs= new Date(uniqueDatesArray[index]);
              dateI=`${dateIs.getFullYear()}-${(dateIs.getMonth())+1}-${dateIs.getDate()}`;
              showDate=dateI;
            });
          });

          const uniqueTimesArray = Array.from(uniqueTimes)
          timesElements.forEach((timesElement, index) => {
            timesElement.addEventListener('click', () => {
              timesElements.forEach(item=>{
                item.classList.remove('clicked');
              })
                timesElement.classList.toggle('clicked');
                timeI =uniqueTimesArray[index];
                showTime=timeI;
            });
          });
      })
      .catch(err => {
        console.log(err);
        });   	
}

// Assuming movieId, dateI, and timeI are already defined

function bookTickets() {
  if(total!=0 && dateI!=null && timeI!=null && tick!=0){
    
      axios.get('http://localhost:3000/api/showSpec', {
      params: {
        movieId: movieId,
        showDate: dateI,
        showTime: timeI,
      },
    })
    .then((res) => {
      
      const showId = res.data[0].show_id;
      console.log(dateI)
      console.log(timeI)
      seatsString = selectedSeats.join('+');
      console.log('Final Seats'+seatsString)
      const totalSeats=selectedSeats.length;
      console.log(totalSeats);
      const todaysDate = new Date().toISOString().slice(0, 19).replace('T', ' '); // Format as 'YYYY-MM-DD HH:mm:ss'
      console.log(todaysDate);
      axios
    .post('http://localhost:3000/api/bookings', {
      userId: userId,
      movieId: movieId,
      showId: showId,
      seatsBooked: seatsString,
      numberOfSeats: totalSeats,
      totalPrice: total,
      bookingDate: todaysDate,
    })
    .then((res) => {
      console.log('Booking successful:', res.data);
      axios.post('http://localhost:3000/api/bookSeats', {
          showId: showId,
          selectedSeats: selectedSeats
        })
        .then(response => {
          console.log(response.data);
          history.back()
          alert('Seats Booked')
          
        })
        .catch(error => {
          console.error(error);
        });
    })
    .catch((err) => {
      console.error('Booking failed:', err);
    });
    })
    .catch((err) => {
      console.error(err);
    });
      
    }
}

function fetchAvailability(){
  allSeats.forEach( seat =>{
    seat.classList.remove('selected')
  })
  allSeats.forEach( seat =>{
    seat.classList.remove('occupied')
  })
  
  axios.get('http://localhost:3000/api/showSpec', {
      params: {
        movieId: movieId,
        showDate: dateI,
        showTime: timeI,
      },
    })
    .then((res) => {
      tick=1;
      const showId = res.data[0].show_id;
      axios.get('http://localhost:3000/api/checkSeatAvailability', {
        params: {
          showId: showId,
        },
      })
      .then((res) => {
        const seats = res.data;
        seats.forEach(item =>{
          occupiedSeats.push(item.seat_number)
        })
        occupiedSeats.forEach(item =>{
          allSeats[item].classList.add('occupied');
        })
        occupiedSeats=[];
      })
      .catch((err) => {
        console.error(err);
      });
    })
    .catch((err) => {
      console.error(err);
      alert('Select show date and timings');
    });
}

// Assuming this is your existing code
const bookBtn = document.querySelector('.button-40');
bookBtn.addEventListener('click', bookTickets);

const checkAv = document.querySelector('.button-32');
checkAv.addEventListener('click', fetchAvailability);


document.addEventListener('DOMContentLoaded', fetchMovies);
document.addEventListener('DOMContentLoaded', fetchShows);