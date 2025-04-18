const listItem = document.querySelectorAll('.list');
const visiblity_list=document.querySelectorAll('.invisible');
visiblity_list[0].classList.add('visible');
var movieIds=[];
var movId;


function activateLink() {
	listItem.forEach( item => {
		item.classList.remove('active');
	});
	this.classList.add('active');
	visiblity_list.forEach( item => {
		item.classList.remove('visible');
	});
	visiblity_list[[...this.parentElement.children].indexOf(this)].classList.add('visible');
}

listItem.forEach( item => {
	item.addEventListener('click', activateLink);
});

const userId = localStorage.getItem('userId');

axios.post("http://localhost:3000/userDetail", { userId: userId })
      .then(res => {
		document.getElementById("helloUser").innerHTML = `Hello ${res.data.message[0].username}`;
      })
	  .catch(err => {
		console.log(err);
	  });

function fetchMovies() {
    axios.get('http://localhost:3000/api/movies')
        .then(res => {
            const movies = res.data;
			const moviesContainer = document.querySelector('.now_playing');
			movies.forEach(movie => {
                const movieDiv = document.createElement('div');
                movieDiv.classList.add('poster_banner');

                const posterImage = document.createElement('img');
                posterImage.classList.add('poster');
                posterImage.src = movie.image_url;
                posterImage.alt = movie.title;
                
                movieIds.push(movie.movie_id);
                const movieTitle = document.createElement('p');
                movieTitle.classList.add('title');
                if(movie.title.length>20){
					movieTitle.textContent = `${movie.title.substring(0,20)}...`;
				}
				else{
					movieTitle.textContent = movie.title;
				}

                movieDiv.appendChild(posterImage);
                movieDiv.appendChild(movieTitle);

                moviesContainer.appendChild(movieDiv);
            });
            const posters=document.querySelectorAll('.poster');
            function movieClicked(){
                const posterIndex = [...posters].indexOf(this);
                localStorage.setItem('movieId', movieIds[posterIndex]);
                window.location.href = '/booking.html';
            }
            
            posters.forEach( item => {
                item.addEventListener('click', movieClicked);
                
            });
		})
		.catch(err => {
            console.error(err);
        });
        
	
}

function fetchUpcoming() {
    axios.get('http://localhost:3000/api/upcoming')
        .then(res => {

            const movies = res.data;
			const moviesContainer = document.querySelector('.upcoming');
			movies.forEach(movie => {
                const movieDiv = document.createElement('div');
                movieDiv.classList.add('poster_banner');

                const posterImage = document.createElement('img');
                posterImage.classList.add('poster');
                posterImage.src = movie.image_url;
                posterImage.alt = movie.title;

                const movieTitle = document.createElement('p');
                movieTitle.classList.add('title');
                if(movie.title.length>20){
					movieTitle.textContent = `${movie.title.substring(0,20)}...`;
				}
				else{
					movieTitle.textContent = movie.title;
				}

                movieDiv.appendChild(posterImage);
                movieDiv.appendChild(movieTitle);

                moviesContainer.appendChild(movieDiv);
            });
		})
		.catch(err => {
            console.error(err);
        });

	
}

// Assuming userId is already defined
const ticketContainer = document.getElementById('ticketContainer');

function fetchBookings() {
  axios.get(`http://localhost:3000/api/bookings/${userId}`)
    .then(res => {
      const bookings = res.data;
      bookings.forEach(booking => {
        const ticket = document.createElement('div');
        ticket.classList.add('ticket');

        const cirCont = document.createElement('div');
        cirCont.classList.add('cirCont');

        const cir = document.createElement('div');
        cir.classList.add('cir');

        cirCont.appendChild(cir);

        const ticketTxt = document.createElement('div');
        ticketTxt.classList.add('ticketTxt');

        const movieName = document.createElement('p');
        movieName.classList.add('movieName');
        movieName.textContent = `${booking.title.substring(0,20)}...`;

        const seats = document.createElement('p');
        seats.classList.add('seats');
        seats.textContent = `Seats: ${booking.seats_booked}`;

        const total = document.createElement('p');
        total.classList.add('total');
        total.textContent = `Total: ${booking.total_price}`;

        const showId = document.createElement('p');
        showId.classList.add('showId');
        showId.textContent = `Show: ${booking.show_id}`;

        const poster = document.createElement('img');
        poster.classList.add('poster');
        poster.src = booking.image_url;
        poster.alt = booking.title;

        ticketTxt.appendChild(movieName);
        ticketTxt.appendChild(seats);
        ticketTxt.appendChild(total);
        ticketTxt.appendChild(showId);
        ticketTxt.appendChild(poster);

        const barcode = document.createElement('img');
        barcode.classList.add('barcode');
        barcode.src = 'https://t3.ftcdn.net/jpg/02/55/97/94/240_F_255979498_vewTRAL5en9T0VBNQlaDBoXHlCvJzpDl.jpg'; // Placeholder image URL
        barcode.alt = 'Barcode';

        ticket.appendChild(cirCont);
        ticket.appendChild(ticketTxt);
        ticket.appendChild(barcode);

        ticketContainer.appendChild(ticket);
      });
    })
    .catch(err => {
      console.error(err);
    });
}

document.addEventListener('DOMContentLoaded', fetchBookings);



document.addEventListener('DOMContentLoaded', fetchMovies);
document.addEventListener('DOMContentLoaded', fetchUpcoming);


