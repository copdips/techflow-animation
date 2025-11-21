# TechFlow Animator

TechFlow Animator is a web application that visualizes complex technical concepts into clear, step-by-step 2D animations. It uses the **Gemini 2.5 Flash** model to analyze topics or blog posts and generates an architectural script, which is then rendered on an interactive canvas.

## Features

- **Topic Visualization**: Enter any technical topic (e.g., "OAuth 2.0 Flow") to generate a diagram.
- **URL Analysis**: Paste a link to a technical blog post; the app uses Gemini with Google Search grounding to understand and visualize the content.
- **Interactive Playback**: Step through the animation packet by packet.

## Prerequisites

- **Node.js** (v16 or higher)
- **npm** (v7 or higher)
- A valid **Google GenAI API Key**

## Installation

1. Clone the repository or download the source code.
2. Install the dependencies:
   ```bash
   make install
   # or
   npm install
   ```

## Configuration

Create a `.env` file in the root directory of the project and add your API key:

```env
API_KEY=your_google_genai_api_key_here
```

> **Note**: The application is configured to inject `process.env.API_KEY` from this file into the client-side code at build time.

## Running

Start the local development server:

```bash
make run
# or
npm run dev
```

Open your browser and navigate to the URL shown in the terminal (typically `http://localhost:5173`).

## Building

To build the application for production:

```bash
make build
```

The output will be in the `dist` directory.

## Testing

To run type checks and ensure code integrity:

```bash
make test
# or
npm run test
```

## Project Structure

- `index.tsx`: Application entry point.
- `services/geminiService.ts`: Handles interaction with the Google GenAI SDK.
- `components/`: UI components for the input, animation stage, and controls.
- `types.ts`: TypeScript definitions for the animation schema.
