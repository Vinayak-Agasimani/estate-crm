const express = require("express");

const {
  createPublicEnquiry,
} = require("../controllers/publicEnquiryController");

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Public Enquiry
|--------------------------------------------------------------------------
|
| Visitors can submit property enquiries without logging in.
|
*/

router.post("/enquiries", createPublicEnquiry);

module.exports = router;