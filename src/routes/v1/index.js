const express= require("express")
const router = express.Router()
const {BookingController} = require("../../controllers")

const bookingController = new BookingController()

router.get('/demo', (req,res)=>{
    return res.json({meassge: "OKAY",
  service : "This is booking service"})
  })
router.post('/publish', bookingController.sendMessageToQueue)
router.post('/bookings', bookingController.create)


module.exports = router