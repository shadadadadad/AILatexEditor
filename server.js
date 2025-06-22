const express = require('express');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const app = express();
app.use(express.json({ limit: '1mb' }));
app.use(express.static(path.join(__dirname, 'public')));

app.post('/compile', (req, res) => {
  const texContent = req.body.tex;
  if (!texContent) return res.status(400).send('No LaTeX content provided');

  const workDir = fs.mkdtempSync(path.join(__dirname, 'tmp-'));
  const texPath = path.join(workDir, 'main.tex');
  fs.writeFileSync(texPath, texContent, 'utf8');

  exec(`pdflatex -interaction=nonstopmode -halt-on-error -output-directory ${workDir} ${texPath}`, (error, stdout, stderr) => {
    if (error) {
      console.error(stderr);
      return res.status(500).send('LaTeX compilation failed');
    }
    const pdfPath = path.join(workDir, 'main.pdf');
    if (fs.existsSync(pdfPath)) {
      res.sendFile(pdfPath, () => {
        fs.rmSync(workDir, { recursive: true, force: true });
      });
    } else {
      res.status(500).send('PDF not generated');
    }
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
