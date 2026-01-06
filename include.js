async function include(url, elementId) {
  try {
    const res = await fetch(url, {cache: 'no-store'});
    if (!res.ok) {
      console.error('Failed to include', url, res.status);
      return;
    }
    const html = await res.text();
    const el = document.getElementById(String(elementId));
    if (!el) {
      console.warn('include: target element not found:', elementId, 'for', url);
      return;
    }
    el.innerHTML = html;
  } catch (err) {
    console.error('include error for', url, err);
  }
}
