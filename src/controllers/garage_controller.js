import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["carsList"]

  connect() {
    console.log("hello from garage controller!")
    // define url
    this.garageName = "garage-806"
    this.garageUrl = `https://wagon-garage-api.herokuapp.com/${this.garageName}/cars`
    this.#refreshCars()
  }

  #insertCar(car) {
    const carCard = `<div class="car">
          <div class="car-image">
            <img src="http://loremflickr.com/280/280/${car.brand}%20${car.model}" />
          </div>
          <div class="car-info">
            <h4>${car.brand} - ${car.model}</h4>
            <p><strong>Owner:</strong>${car.owner}</p>
            <p><strong>Plate:</strong>${car.plate}</p>
          </div>
        </div>`
    this.carsListTarget.insertAdjacentHTML('beforeend', carCard)
  }

  createCar(event) {
    event.preventDefault()
    // grab inputs from the user (a little bit funky - you will ask questions)
    const formData = new FormData(event.target)
    const myNewCar = Object.fromEntries(formData)
    fetch(this.garageUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json"},
      body: JSON.stringify(myNewCar)
    })
    // data-action
    // send post request to API with car info
    // display the cars i.e. refresh the page
    .then(() => this.#refreshCars())
  }

  #refreshCars() {
    // fetch cars from the API
    fetch(this.garageUrl)
      .then(response => response.json())
      .then((data) => {
        // console.log(data)
        // forEach
        this.carsListTarget.innerHTML = ""
        data.forEach(car => this.#insertCar(car))
      })
  }
}
