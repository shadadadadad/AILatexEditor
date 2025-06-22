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
