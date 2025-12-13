# Malaysian Fuel Subsidy Calculator (BUDI95)

A responsive, modern web application designed to help Malaysian residents estimate their petrol subsidy savings under the new BUDI95 initiative.

## Features

*   **Dynamic Subsidy Calculation**: Instantly calculate estimated fuel volume and subsidy savings based on your RM input.
*   **Liters Mode**: Toggle to 'Liters' mode to calculate the total cost and savings based on fuel volume.
*   **Live Price Integration**: Fetches real-time market and subsidized fuel prices from the official [data.gov.my](https://data.gov.my) API.
*   **Price History Graph**: Visualizes price trends for RON95, RON97, and Diesel over the past 3 months using Chart.js.
*   **Responsive Design**: Built with a mobile-first approach, featuring a premium glassmorphism UI/UX.
*   **Privacy-Friendly**: Includes a simple, anonymous visitor counter.

## Tech Stack

*   **Frontend**: Vanilla HTML, CSS, JavaScript
*   **Build Tool**: Vite
*   **Charting**: Chart.js
*   **API**: [data.gov.my](https://data.gov.my) (Fuel Prices), [counterapi.dev](https://counterapi.dev) (Visitor Count)

## Getting Started

### Prerequisites

*   Node.js installed on your machine.

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/real473x/budi95-calculator.git
    cd budi95-calculator
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Run the development server:
    ```bash
    npm run dev
    ```

4.  Open your browser and navigate to `http://localhost:5173` (or the URL shown in your terminal).

## Disclaimer

This website is an independent tool and is **not affiliated with the Government of Malaysia**. It is intended for use by Malaysian residents only. The developer is not responsible for any direct or indirect damages, losses, or harm arising from the use of this website. Calculations are for estimation purposes only.

## License

v0.1 Alpha - Free for personal use.
