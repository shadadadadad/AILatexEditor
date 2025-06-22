# AI LaTeX Editor

Simple web-based LaTeX editor with PDF compilation using `pdflatex`.
Now includes basic AI suggestions powered by the OpenAI API.

## Usage

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the server:
   ```bash
   node server.js
   ```
3. Open [http://localhost:3000](http://localhost:3000) in your browser to edit LaTeX and compile PDFs.

### AI Suggestions

Set the `OPENAI_API_KEY` environment variable to enable the AI suggestion feature.
The project uses version 5 of the `openai` package, so the client is
initialized in `server.js` using `new OpenAI({ apiKey: ... })`.

## Notes

- Requires `pdflatex` to be installed. On Ubuntu you can install it via:
  ```bash
  sudo apt-get install texlive-latex-base
  ```
- Generated PDFs are served directly after compilation and temporary files are cleaned up.
