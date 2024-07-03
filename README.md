# Flightradar24 Flight Paths

Unofficial Flight Path visualization app, for data from [FlightRadar24](https://www.flightradar24.com/).

## Description

Flightradar24 Flight Paths is a simple web application built using Vue 3, TypeScript and the Quasar framework. This app visualizes flight data from Flight Data CSV files obtained from Flightradar24. Originally conceived as a curiosity-driven project, to compare the flight paths of the same flights.

## Installation

To get started, follow these steps:

1. Clone the repository

2. Navigate to the project directory:
   ```
   cd fr24-flight-paths
   ```

3. Install dependencies:
   ```
   yarn install
   ```
   
4. Prepare environment: copy the `.env.example` file, name it `.env` and fill the API Key for the Google Maps API

5. Start the development server:
   ```
   yarn dev
   ```

## Usage

1. **Upload CSV Files**: Use the left sidebar to upload CSV files obtained from Flightradar24. These files contain flight data that will be visualized.

2. **Visualization**: Each flight will be assigned a random (changeable) color. The flight paths will be displayed on the map on the right side of the app.

3. **Interaction**: Clicking on a flight or its flight path will highlight it, allowing for easier comparison and analysis.

## Acknowledgements

This project relies on flight data obtained from Flightradar24. Please note that:

- This is not an official project from Flightradar24.
- Any copyright for the data used belongs to Flightradar24.

To download the flight data files, you will need a Silver, Gold, or Business Flightradar24 account. If you are interested in accessing Flightradar24 data commercially, please contact business@fr24.com. See more information at [Flightradar24's terms and conditions](https://www.flightradar24.com/terms-and-conditions).
