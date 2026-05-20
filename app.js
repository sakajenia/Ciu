(async function () {
  const feed = document.getElementById("feed");
  const updatedAt = document.getElementById("updated-at");

  function escapeHtml(str) {
    return String(str ?? "").replace(/[&<>"']/g, (c) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    }[c]));
  }

  function formatDate(iso) {
    try {
      return new Date(iso).toLocaleDateString("it-IT", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "";
    }
  }

  function renderPost(p) {
    const isVideo = p.media_type === "VIDEO";
    const thumb = p.thumbnail_url || p.media_url;
    const mediaTag = isVideo
      ? `<video src="${escapeHtml(p.media_url)}" poster="${escapeHtml(
          thumb,
        )}" muted playsinline preload="metadata"></video>`
      : `<img src="${escapeHtml(p.media_url)}" alt="${escapeHtml(
          (p.caption || "").slice(0, 80),
        )}" loading="lazy" />`;
    return `
      <article class="post">
        <a class="media-link" href="${escapeHtml(
          p.permalink,
        )}" target="_blank" rel="noopener noreferrer">
          ${mediaTag}
        </a>
        <div class="post-body">
          <p class="post-caption">${escapeHtml(p.caption || "")}</p>
          <div class="post-meta">
            <span>${formatDate(p.timestamp)}</span>
            <a href="${escapeHtml(
              p.permalink,
            )}" target="_blank" rel="noopener noreferrer">Apri</a>
          </div>
        </div>
      </article>
    `;
  }

  try {
    const res = await fetch("data/feed.json", { cache: "no-store" });
    if (!res.ok) throw new Error("feed unavailable");
    const data = await res.json();

    if (data.updated_at) {
      updatedAt.dateTime = data.updated_at;
      updatedAt.textContent = new Date(data.updated_at).toLocaleString("it-IT");
    }

    const posts = Array.isArray(data.posts) ? data.posts : [];
    if (posts.length === 0) {
      feed.innerHTML = `<p class="empty">Nessun post disponibile al momento. Visita
        <a href="https://www.instagram.com/lafeniceimmobiliarecinqueterre" target="_blank" rel="noopener noreferrer">
        @lafeniceimmobiliarecinqueterre</a> su Instagram.</p>`;
      return;
    }
    feed.innerHTML = posts.map(renderPost).join("");
  } catch (e) {
    feed.innerHTML = `<p class="error">Impossibile caricare il feed. Riprova più tardi
      oppure visita
      <a href="https://www.instagram.com/lafeniceimmobiliarecinqueterre" target="_blank" rel="noopener noreferrer">
      @lafeniceimmobiliarecinqueterre</a> direttamente su Instagram.</p>`;
  }
})();
