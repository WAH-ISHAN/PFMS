// Helper to download a blob response as a file.

export async function downloadBlobResponse(promise, filenameFallback) {
  const res = await promise;
  const blob = new Blob([res.data], { type: res.headers['content-type'] || 'application/octet-stream' });

  // Try to extract filename from header
  let filename = filenameFallback;
  const dispo = res.headers['content-disposition'];
  if (dispo) {
    const match = dispo.match(/filename="?([^"]+)"?/);
    if (match) filename = match[1];
  }

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename || 'download';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}