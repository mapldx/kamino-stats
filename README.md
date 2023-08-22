<div align="center">
  <img src="https://kamino.finance/assets/kamino-logo.8c6a15ef.svg" alt="Logo" width="240">

  <p align="center">
    <br>
    DeFi is complicated as it is. Find some footing faster with a human-friendly, straightforward, data dashboard for Kamino Finance.
    <br />
    <br />
    <a href="https://beta.kamino.one">Go to Website</a>
    ·
    <a href="https://twitter.com/mapldx">Follow on X</a>
    ·
    <a href="https://www.cubik.so/project/80aa8a10-a639-44e8-b946-388d1e96372b/hackathon/8e23ade0-0dae-4c4b-83aa-67867749029c">View on Cubik</a>
  </p>
</div>

## Run Kamino One on your local machine for development
### Prerequisites

This beta release of Kamino One is verified working on:
* node v18.15.0
* yarn v1.22.19 (assuming that npm is installed)
* next v13.4.19
* react v18.2.0

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/mapldx/kamino-stats
   ```
2. Set your development environment variables
   * INTERPRET_WITH: what API would you prefer to utilize to parse token, vault, pool, and program metadata? Valid choices are `SOLSCAN` or `HELIUS`. Solscan is recommended strictly for testing due to its low rate-limits. Utilizing Helius is recommended for stability in production.
   * HELIUS_API_KEY
   * ENDPOINT_URL: for local development, set it to http://localhost:{PORT}, else, it is set to https://beta.kamino.one/api as the URL deployed to production.
3. Install the necessary dependencies
   ```sh
   yarn
   ```
4. Start the development server
   ```sh
   yarn dev
   ```

### API Documentation
| Endpoint     | Queries                                                                                                                                                                                                                               |
|--------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| /api         | no query: will return a 400, refresh={true/null}: will synchronously run all data refresh processes (unstable)                                                                                                                         |
| /tvl         | no query: data will be refreshed, today={true}: get summarized statistics for today, sort={strategy/date}: get most recent raw data as parsed and sorted by strategy/date                                                               |
| /volume      | no query: data will be refreshed, today={true}: get statistics for today, sort={date}: get most recent raw data as parsed and sorted by date                                                                                            |
| /fees        | no query: data will be refreshed, today={true}: get summarized statistics for today, sort={date}: get most recent raw data as parsed and sorted by date                                                                                 |
| /depositor   | no query: data will be refreshed, today={true}: get summarized statistics for today, sort={strategy/date}: get most recent raw data as parsed and sorted by strategy/date                                                               |
| /leaderboard | no query: data will be refreshed, view={true}: get most recent raw data                                                                                                                                                                |
| /pools       | no query: data will be refreshed, consolidate={true}: get most recent raw data with complete set of information, search={true} in conjunction with pool={POOL}: get most recent raw data with complete set of information for one pool |
| /portfolio   | address={ADDRESS}: a required value to get the data on strategy holdings of a portfolio                                                                                                                                               |

## Built With

* ![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)
* ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
* ![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
* ![Cloudflare](https://img.shields.io/badge/Cloudflare-F38020?style=for-the-badge&logo=Cloudflare&logoColor=white)
* ![Chart.js](https://img.shields.io/badge/chart.js-F5788D.svg?style=for-the-badge&logo=chart.js&logoColor=white)

## About

[zachio, @mapldx on X](https://twitter.com/mapldx)<br>
Discord: mapldx (hashtag) 0123
