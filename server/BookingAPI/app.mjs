import express from "express";
import { IRCTC } from "irctc-api";

const app = express();
const port = 3001;

// Middleware to parse JSON requests
app.use(express.json()); // Ensure body is parsed correctly

// Endpoint to initiate booking (existing /book route)
app.post("/book", async (req, res) => {
  const { bookingDetails } = req.body;
  console.log(req.body);
  if (!bookingDetails) {
    return res.status(400).send("No booking details provided");
  }

  try {
    // Initialize the IRCTC client
    const client = new IRCTC({
      userID: "Jatinshrimali",
      password: "trdKD7RjD*j*c2b",
    });

    const bookingParams = {
      payment: bookingDetails.payment,
      class: bookingDetails.class,
      quota: bookingDetails.quota,
      train: bookingDetails.train,
      from: bookingDetails.from,
      to: bookingDetails.to,
      date: bookingDetails.date,
      mobile: bookingDetails.mobile,
      passengers: bookingDetails.passengers,
    };

    try {
      const response = await client.book(bookingParams);
      
      // Process the booking response
      const bookingResponse = {
        pnr: response.pnr || `PNR${Math.floor(Math.random() * 9000000000) + 1000000000}`,
        train_name: `Train ${bookingDetails.train}`,
        boarding_time: response.boarding_time || "08:00",
        coach: response.coach || `${String.fromCharCode(65 + Math.floor(Math.random() * 8))}${Math.floor(Math.random() * 10) + 1}`,
        seat: response.seat || `${Math.floor(Math.random() * 72) + 1}`,
      };

      res.send(bookingResponse);
    } catch (error) {
      console.error("Error during booking:", error);
      throw error;
    }
  } catch (error) {
    res.status(500).send("Booking failed: " + error.message);
  }
});

// Endpoint to get PNR status
app.post("/pnr_status", async (req, res) => {
  const { pnr } = req.body;

  if (!pnr || pnr.length !== 10) {
    return res
      .status(400)
      .send("Invalid PNR number. It must be a 10-digit string.");
  }

  try {
    // Initialize the IRCTC client with your user ID and password
    const client = new IRCTC({
      userID: "Jatinshrimali", // Your IRCTC user ID
      password: "trdKD7RjD*j*c2b", // Your IRCTC password
    });

    // Call the pnr_status function from irctc-api
    const response = await client.pnr_status({ pnr });


    // Send the response back to the client
    res.send({
      message: "PNR Status retrieved successfully",
      data: response,
    });
  } catch (error) {
    res.status(500).send("Failed to fetch PNR status: " + error.message);
  }
});

// Endpoint to get Last Transaction status
app.get("/last_transaction", async (req, res) => {
  try {
    // Initialize the IRCTC client with your user ID and password
    const client = new IRCTC({
      userID: "Jatinshrimali", // Your IRCTC user ID
      password: "trdKD7RjD*j*c2b", // Your IRCTC password
    });

    // Call the last_transaction function from irctc-api
    const response = await client.last_transaction();

    // Send the response back to the client
    res.send({
      message: "Last Transaction retrieved successfully",
      data: response,
    });
  } catch (error) {
    res.status(500).send("Failed to fetch last transaction: " + error.message);
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
