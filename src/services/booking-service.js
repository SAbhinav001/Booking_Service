const axios = require("axios");
const { BookingRepository } = require("../repository");
const { ServiceError } = require("../utils");
const { FLIGHT_SERVICE_PATH } = require("../config/server-config");

class BookingService {
  constructor() {
    this.bookingRepository = new BookingRepository();
  }

  async createBooking(data) {
    //data should contain flightID, userId, noOfseats to create---->see model
    try {
      const flightId = data.flightId;

      //based on flightID we need to get detail of flight from flightSerivce
      let getFlightRequestURL = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${flightId}`;
      const response = await axios.get(getFlightRequestURL);
      const flightData = response.data.data

      //get the price form flight and calculte the total prioce acc. to no. of seats after checking if hteseats are available or not
      let priceOfFlight= flightData.price
      if(data.noOfSeats > flightData.totalSeats){
        throw new ServiceError('something went wrong in the booking process' , 'insufficient seats')
      }
      const totalCost = data.noOfSeats * priceOfFlight

      //now update the data object and create booking -->see model( fort he column req)
      const bookingPayload = {...data , totalCost}
      const booking = await this.bookingRepository.create(bookingPayload)

      //after booking we need to update the seats in the flight service of the flight
      let updateFlightRequestURL = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${booking.flightId}`;
      await axios.patch(updateFlightRequestURL, {totalSeats: flightData.totalSeats - booking.noOfSeats});

      //now update the status from in progress afert the patch request it confirmed
      const finalBooking  = await this.bookingRepository.update(booking.id , {status: "Booked"})
      return finalBooking

    } catch (error) {
       
        if(error.name == "RepositoryError" || error.name =="validationError"){
            throw error;
        }
      throw new ServiceError();
    }
  }
}
module.exports = BookingService;
