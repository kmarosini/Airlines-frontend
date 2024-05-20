import { useState } from "react";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Pagination from "react-bootstrap/Pagination";
import Spinner from "react-bootstrap/Spinner"; // Import Spinner component
import "../styles/AirlinesFormStyle.css";

const AirlinesForm = () => {
  const [flights, setFlights] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [validationErrors, setValidationErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const initialFormData = {
    departureAirport: "",
    destinationAirport: "",
    departureDate: "",
    returnDate: "",
    numberOfPassengers: "",
    currency: "EUR",
  };

  const [formData, setFormData] = useState(initialFormData);

  //_________________________________________________________________________
  // PAGINATION
  // Calculate index of the first flight on the current page
  const flightsPerPage = 10;
  const indexOfLastFlight = currentPage * flightsPerPage;
  const indexOfFirstFlight = indexOfLastFlight - flightsPerPage;
  // Get current flights based on pagination
  const currentFlights = flights.slice(indexOfFirstFlight, indexOfLastFlight);
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(flights.length / flightsPerPage); i++) {
    pageNumbers.push(i);
  }
  //_________________________________________________________________________

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const isValidForm = () => {
    const errors = {};
    if (formData.departureAirport.length !== 3) {
      errors.departureAirport = "Departure Airport must be 3 characters long";
    }
    if (formData.destinationAirport.length !== 3) {
      errors.destinationAirport =
        "Destination Airport must be 3 characters long";
    }
    if (!formData.departureDate) {
      errors.departureDate = "Departure Date is required";
    }
    if (!formData.returnDate) {
      errors.returnDate = "Return Date is required";
    }
    if (
      formData.numberOfPassengers <= 0 ||
      formData.numberOfPassengers > 5 ||
      !formData.numberOfPassengers
    ) {
      errors.numberOfPassengers =
        "Number of Passengers must be a positive number, not exceeding 5";
    }
    if (!formData.currency) {
      errors.currency = "Currency is required";
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const GetFlightData = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        "https://localhost:7238/api/GetFlightOffers/GetFlightOffers",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            accept: "*/*",
          },
          body: JSON.stringify({
            departureAirport: formData.departureAirport,
            destinationAirport: formData.destinationAirport,
            departureDate: formData.departureDate,
            returnDate: formData.returnDate,
            numberOfPassengers: parseInt(formData.numberOfPassengers),
            max: 3,
            currency: formData.currency,
          }),
        }
      );
      if (!res.ok) throw new Error("No data!");
      const data = await res.json();
      console.log(data);
      setFlights(data.data);
      setCurrentPage(1);
      //clearing form values
      setFormData(initialFormData);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (currencyCode, amount) => {
    const currencySymbols = {
      EUR: "€",
      USD: "$",
      HRK: "kn",
    };
    const currencySymbol = currencySymbols[currencyCode] || currencyCode;
    return `${amount}${currencySymbol}`;
  };

  const formatDate = (timestamp) => {
    return timestamp.split("T")[0];
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isValidForm()) {
      GetFlightData();
    }
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <Form onSubmit={handleSubmit}>
            {/* Departure Airport */}
            <InputGroup className="mb-3">
              <InputGroup.Text id="departure-airport-addon">
                Departure Airport:
              </InputGroup.Text>
              <Form.Control
                type="text"
                name="departureAirport"
                value={formData.departureAirport}
                onChange={handleChange}
                placeholder="Departure Airport"
                aria-label="Departure Airport"
                aria-describedby="departure-airport-addon"
                isInvalid={!!validationErrors.departureAirport}
                className="flightInput"
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.departureAirport}
              </Form.Control.Feedback>
            </InputGroup>

            {/* Destination Airport */}
            <InputGroup className="mb-3">
              <InputGroup.Text id="destination-airport-addon">
                Destination Airport:
              </InputGroup.Text>
              <Form.Control
                type="text"
                name="destinationAirport"
                value={formData.destinationAirport}
                onChange={handleChange}
                placeholder="Destination Airport"
                aria-label="Destination Airport"
                aria-describedby="destination-airport-addon"
                isInvalid={!!validationErrors.destinationAirport}
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.destinationAirport}
              </Form.Control.Feedback>
            </InputGroup>

            {/* Departure Date */}
            <InputGroup className="mb-3">
              <InputGroup.Text id="departure-date-addon">
                Departure Date:
              </InputGroup.Text>
              <Form.Control
                type="date"
                name="departureDate"
                value={formData.departureDate}
                onChange={handleChange}
                aria-label="Departure Date"
                aria-describedby="departure-date-addon"
                isInvalid={!!validationErrors.departureDate}
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.departureDate}
              </Form.Control.Feedback>
            </InputGroup>

            {/* Return Date */}
            <InputGroup className="mb-3">
              <InputGroup.Text id="return-date-addon">
                Return Date:
              </InputGroup.Text>
              <Form.Control
                type="date"
                name="returnDate"
                value={formData.returnDate}
                onChange={handleChange}
                aria-label="Return Date"
                aria-describedby="return-date-addon"
                isInvalid={!!validationErrors.returnDate}
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.returnDate}
              </Form.Control.Feedback>
            </InputGroup>

            {/* Number of Passengers */}
            <InputGroup className="mb-3">
              <InputGroup.Text id="passengers-addon">
                Number of Passengers:
              </InputGroup.Text>
              <Form.Control
                type="number"
                name="numberOfPassengers"
                value={formData.numberOfPassengers}
                onChange={handleChange}
                placeholder="Number of Passengers"
                aria-label="Number of Passengers"
                aria-describedby="passengers-addon"
                isInvalid={!!validationErrors.numberOfPassengers}
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.numberOfPassengers}
              </Form.Control.Feedback>
            </InputGroup>

            {/* Currency */}
            <InputGroup className="mb-3">
              <InputGroup.Text id="value-addon">Currency:</InputGroup.Text>
              <Form.Select
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                aria-label="Currency"
                aria-describedby="value-addon"
                isInvalid={!!validationErrors.currency}
              >
                <option value="EUR">EUR</option>
                <option value="USD">USD</option>
                <option value="HRK">HRK</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {validationErrors.currency}
              </Form.Control.Feedback>
            </InputGroup>

            {/* Submit Button */}
            <Button type="submit" variant="danger">
              Search
            </Button>
          </Form>
        </div>
      </div>

      {/* Flight Results */}
      <div className="table-container mt-4">
        {loading ? (
          <div className="text-center">
            <Spinner animation="border" variant="danger" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : (
          <>
            {flights.length === 0 ? (
              <div className="text-center">
                <p>No direct flights found</p>
              </div>
            ) : (
              <>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Departure Airport</th>
                      <th>Destination Airport</th>
                      <th>Departure Date</th>
                      <th>Return Date</th>
                      <th>Number of Stops (Outbound)</th>
                      <th>Number of Stops (Inbound)</th>
                      <th>Number of Passengers</th>
                      <th>Currency</th>
                      <th>Total Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentFlights.map((flight, index) => (
                      <tr key={index}>
                        <td>
                          {
                            flight.itineraries[0]?.segments[0]?.departure
                              ?.iataCode
                          }
                        </td>
                        <td>
                          {
                            flight.itineraries[0]?.segments[0]?.arrival
                              ?.iataCode
                          }
                        </td>
                        <td>
                          {formatDate(
                            flight.itineraries[0]?.segments[0]?.departure?.at
                          )}
                        </td>
                        <td>
                          {flight.itineraries[1]?.segments?.length > 0
                            ? formatDate(
                                flight.itineraries[1]?.segments[
                                  flight.itineraries[1]?.segments.length - 1
                                ]?.arrival?.at
                              )
                            : "N/A"}
                        </td>
                        <td>{flight.itineraries[0]?.segments?.length - 1}</td>
                        <td>
                          {flight.itineraries[1]?.segments?.length - 1 || "N/A"}
                        </td>
                        <td>{flight.numberOfBookableSeats}</td>
                        <td>{flight.price.currency}</td>{" "}
                        {/* Display selected currency */}
                        <td>
                          {formatCurrency(
                            flight.price?.currency,
                            flight.price?.total
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                {/* Pagination */}
                <Pagination>
                  {pageNumbers.map((number) => (
                    <Pagination.Item
                      key={number}
                      active={number === currentPage}
                      onClick={() => paginate(number)}
                    >
                      {number}
                    </Pagination.Item>
                  ))}
                </Pagination>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AirlinesForm;
