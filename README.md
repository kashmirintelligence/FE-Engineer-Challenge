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
- Effective use of Svelte 5 runes ($state, $derived, $effect)
- Component organisation
- Responsive design
- Basic tests for critical functions

## Project Structure

This is a monorepo with three packages:
- `client`: Svelte 5 frontend with D3 for visualisations
- `server`: Node.js backend with Socket.IO simulating real-time refinery data
- `shared`: Common types and constants for type-safe communication

The backend already simulates temperature, pressure and flow rate with random fluctuations and responds to control commands. Your job is to create a proper front-end that visualises the data and lets operators control the systems.

## Getting Started 🚀

1. Clone this repo
2. Install pnpm if you don't have it: `npm install -g pnpm`
3. `pnpm install`
4. `pnpm dev` (runs both frontend and backend)
5. `pnpm test` (runs all tests)

The server runs on http://localhost:3001 and the client on http://localhost:5173.

## Git Workflow

We use [conventional commits](https://www.conventionalcommits.org/) to maintain a clean and meaningful git history.

Use `pnpm commit` instead of `git commit` to get a helpful interactive prompt.

Your commit messages must follow the pattern:
- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, etc)
- **refactor**: Code changes that neither fix bugs nor add features
- **test**: Adding or improving tests
- **chore**: Changes to the build process or tools

The pre-commit hooks will lint your code and run relevant tests before letting you commit. If things fail, fix them before committing.

## Technical Requirements

- Use Svelte 5 runes properly - don't stick with the old Svelte 4 patterns
- Make sure your components receive proper TypeScript props
- Add at least one meaningful test for each panel component
- Use responsive design so it works on tablets (but desktop is priority)

Don't waste time on login screens or fancy animations. Focus on making the core monitoring features solid and maintainable.

Quality over quantity. Your creativity, your choices.