
window.addEventListener('DOMContentLoaded', (event) => {
    
    // Initializing of variables
    let movieSelectsCont = document.getElementById('movie'); 
    let seatsCont = document.querySelector('.container');
    let count = document.getElementById('count');
    let totalOfOrders = document.getElementById('total');
    let seats;
    let currMovieIndex = 0;
    let extraFee = 3;
    let premiumFeeMultiplier = 2;
    let OrderInfo = {seats: [], date: 0};
    let seatsAmount = 48;
    


    let movieData = [
        {label: 'Avengers: Endgame', basePrice: 10},
        {label: 'Joker', basePrice: 12},
        {label: 'Toy Story 4', basePrice: 8},
        {label: 'The Lion King', basePrice: 9}
    ]

    
    function selectRender(){
        let selectHtml = movieData.reduce((html, movie, i) => html += `<option value="${i}">${movie.label} (${movie.basePrice}$ - ${movie.basePrice + extraFee * premiumFeeMultiplier}$)</option>`, '');
        movieSelectsCont.innerHTML = selectHtml;
    }

    // function returning different types of seats based on index and price passed
    function getSeatDetails(i, basePrice){
        if ([0,1,6,7].includes(i%8)) {
            return [basePrice, '#ccc', 'Standard seats']
        }
        if (i>=16 && i <= 33) {
            return [basePrice + extraFee * premiumFeeMultiplier, '#D9AAD9', 'Deluxe large seats'];
        }
        else {
            return [basePrice + extraFee, '#AAD9AA', 'Premium seats'];
        }
    }


    function totalPopulate(sum, total){
        count.innerHTML = total;
        totalOfOrders.innerHTML = sum;
    }

    // Dynamic populating of occupied and not occupied seats
    for (let movie of movieData) {
        movie.seats = [];
        for (let i=0; i<seatsAmount; i++) {
            movie.seats.push(Math.random() > 0.5);
        }
    }


    seats = movieData[currMovieIndex].seats;

    // Rendering the seats
    function render(){
        if (seats) {
            let html = '<div class="screen"></div>';
            for (let i=0; i<seats.length; i++) {
                if (i%8 === 0) {
                    html += '<div class="row">';
                }
                if (seats[i]) {
                    html += '<div title="Occupied" class="seat occupied"></div>';
                } else {
                    [price, color, msg] = getSeatDetails(i, movieData[currMovieIndex].basePrice);
                    html += `<div data-order="${i}" style="background-color:${color}" class="seat"><span class="msg-info">Price is ${price}. ${msg}</span></div>`;
                }
                if (i%8 === 7) {
                    html += '</div>';
                }
            }
            seatsCont.innerHTML = html;
        }
    }

    // Select the seat and sending the info about it to the array
    seatsCont.addEventListener('click', (e) => {
        let node = e.target;

        if (node.classList.contains('occupied')) return;
        if (node.classList.contains('seat')) {
            node.classList.toggle('selected');
        }
        if (node.classList.contains('selected')) {
            OrderInfo.seats.push(parseInt(node.dataset.order));
        } else {
            OrderInfo.seats = OrderInfo.seats.filter(el => el != node.dataset.order);
        }

        totalPopulate(OrderInfo.seats.reduce((sum, seat) => sum + getSeatDetails(seat, movieData[currMovieIndex].basePrice)[0], 0), OrderInfo.seats.length);

    })


    // Rendering of select with its options and also seats on onload. Different seats are generated dynamically everytime page reloads.
    selectRender();
    render();

    // Get the new data of seats and orders on select change
    movieSelectsCont.addEventListener('change', function() {
        currMovieIndex = this.value;
        seats = movieData[currMovieIndex].seats;
        render();
        totalPopulate(0, 0);
        OrderInfo.seats = [];
    })
    
});