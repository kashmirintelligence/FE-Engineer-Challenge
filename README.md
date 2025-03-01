# Refinery Monitoring Challenge 🏭

A quick Svelte 5 challenge to show off your skills. Build something small but impressive in 2-3 hours that we can chat about later. Quality over quantity - use TypeScript, testing and runes to demonstrate how you actually think about code.

## The Brief 📊

Create a dashboard with three monitoring panels:

1. **Temperature System** 🌡️
   - Line chart tracking real-time temperature
   - Adjustable warning/critical thresholds
   - Heat control simulation

2. **Pressure Vessel** 📈
   - Gauge visualisation (0-100%)
   - Emergency release button
   - Warning indicators

3. **Flow Rate Monitor** 🌊
   - Pipe visualisation with animation
   - Valve control slider
   - Efficiency calculation

## What We're Looking For 👀

- Clean TypeScript code
- Effective use of Svelte 5 runes
- Component organisation
- Responsive design
- Basic tests for critical functions

## Project Structure

This is a monorepo with three packages:
- `client`: Svelte 5 frontend
- `server`: Node.js backend with Socket.IO
- `shared`: Common types and utilities

## Getting Started 🚀

1. Clone this repo
2. Install pnpm if you don't have it: `npm install -g pnpm`
3. `pnpm install`
4. `pnpm dev` (runs both frontend and backend)
5. `pnpm test` (runs all tests)

You need to implement both the frontend with Svelte 5 (connect to the socket backend) and extend the backend as needed for your solution.

Quality over quantity. Your creativity, your choices.