document.getElementById('compile').addEventListener('click', async () => {
  const tex = document.getElementById('editor').value;
  const res = await fetch('/compile', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tex })
  });
  if (res.ok) {
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const iframe = document.getElementById('preview');
    iframe.src = url;
  } else {
    alert('Compilation failed');
  }
});

document.getElementById('aisuggest').addEventListener('click', async () => {
  const text = document.getElementById('editor').value;
  const res = await fetch('/suggest', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  });
  if (res.ok) {
    const data = await res.json();
    document.getElementById('suggestion').value = data.suggestion;
  } else {
    alert('AI suggestion failed');
  }
});
