const express = require('express');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { Configuration, OpenAIApi } = require('openai');

const openai = new OpenAIApi(new Configuration({
  apiKey: process.env.OPENAI_API_KEY
}));

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

app.post('/suggest', async (req, res) => {
  const text = req.body.text;
  if (!text) return res.status(400).send('No text provided');
  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful assistant for LaTeX editing.' },
        { role: 'user', content: text }
      ],
      max_tokens: 150
    });
    const suggestion = completion.data.choices[0].message.content.trim();
    res.json({ suggestion });
  } catch (err) {
    console.error(err);
    res.status(500).send('AI suggestion failed');
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
