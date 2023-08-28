const { StatusCodes } = require("http-status-codes");
const { Booking } = require("../models");
const { ValidationError, AppError } = require("../utils");

class BookingRepository {
  async create(data) {
    try {
        const booking = await Booking.create(data)
        return booking;
    } catch (error) {
      if (error.name == "SequelizeValidationError") {
        throw new ValidationError(error);
      }
      throw AppError(
        "RepositoryError",
        "cannot create booking",
        "there was somthing wrong, please try again later",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async update(bookingId, data) {
    try {
        // await Booking.update(data,{
        //   where:{
        //     id:bookingId
        //   }
        // })
        // return true;
        const booking = await Booking.findByPk(bookingId)
        if(booking.status){
          booking.status = data.status
        }
        await booking.save();
        return booking
    } catch (error) {
      console.log(error)

      throw new AppError(
        "Repositry error ",
        " cannot update booking",
        "there was somthing wrong, please try again later",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}

module.exports = BookingRepository;
