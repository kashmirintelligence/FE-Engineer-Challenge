# Refinery Monitoring Challenge 🏭

This Svelte 4 challenge tests your ability to build a small but impressive dashboard in 2-3 hours. Create real-time visualisations from socket data while showcasing your TypeScript, testing and component development skills.

## The Brief 📊

Create a dashboard with three monitoring panels:

1. **Temperature System** 🌡️
   - Line chart tracking real-time temperature
   - Adjustable warning/critical thresholds (drag to change values)
   - Cooling toggle button
   - Status indicators showing normal/warning/critical states

2. **Pressure Vessel** 📈
   - Gauge visualisation (0-100%)
   - Emergency release button
   - Warning indicators that reflect vessel status

3. **Flow Rate Monitor** 🌊
   - Animated pipe flow visualisation 
   - Valve control slider (0-100%)
   - Efficiency calculation display

## What We're Looking For 👀

- Clean TypeScript with proper interfaces and type safety
- Svelte 4 patterns (using runes/signals where appropriate)
- Logical component organisation 
- Responsive design (desktop-first, tablet-compatible)
- Basic tests for critical functions

## Project Structure

This is a monorepo with three packages:
- `client`: Svelte 4 frontend (currently empty panels waiting for your implementation)
- `server`: Socket.IO backend simulating real-time refinery data
- `shared`: Common types and constants used by both client and server

The data flow works like this:
1. Server runs simulators that generate realistic plant data
2. Socket.IO sends updates to connected clients
3. Your visualisations display this data and let users control the simulations

## Data & Control Interface

The server emits these events:
- `temperature:update` - Current temperature, thresholds and status
- `pressure:update` - Current pressure value and status
- `flow:update` - Current flow rate, valve position and efficiency

Your client can send these commands:
- `temperature:control` - Adjust cooling or thresholds
- `pressure:release` - Trigger emergency pressure release
- `flow:valve-adjust` - Change valve position (0-100%)

## Getting Started 🚀

1. Clone this repo
2. Install pnpm if you don't have it: `npm install -g pnpm`
3. Run `pnpm install`
4. Run `pnpm build` (builds all packages)
5. Run `pnpm dev` (starts both client and server)

The app runs at http://localhost:3000 with the server at http://localhost:3001.

## Debugging

- Use the debug panel (bottom-right corner) to see all socket events
- Check browser console for any errors
- For Socket.IO issues, try running server and client separately:
  - `pnpm dev:server` 
  - `pnpm dev:client`

## Testing Your Code

Run tests with `pnpm test`. We've set up test infrastructure, just add your test files.

All tests must pass for your PR to be accepted.

## Tips for Success

- Start with one panel (temperature) and get it fully working before moving to others
- Use SCSS for styling (we've set up Svelte preprocessing for you)
- TypeScript interfaces are already defined in the shared package
- You can use any visualisation library, or roll your own with SVG
- Focus on functionality first, then polish the UI
- Leave time for writing tests

## Submission Requirements

Create a PR containing your changes. We'll review:
1. How you structured components
2. Type safety and TypeScript usage
3. Test coverage for critical functionality
4. UI/UX decisions and implementation quality

Don't spend time on login screens or features not mentioned in the brief. Focus on solid, maintainable visualisations of the simulated data.

## Using AI Tools

Using AI assistants like Claude or ChatGPT to help with this challenge is absolutely fine. We're interested in results, not whether you memorised every Svelte lifecycle method. However, be prepared to walk through your code, explain your design choices, and justify technical decisions during the review. If you can't explain how your solution works, it's not much use to us.

## Pre-commit Hooks

We've set up Husky pre-commit hooks to run ESLint and tests before each commit. This might feel like a faff, but it ensures your code meets our standards before it's committed. If you're getting pre-commit errors when trying to commit changes, run `pnpm lint` and `pnpm test` manually to see what's failing.