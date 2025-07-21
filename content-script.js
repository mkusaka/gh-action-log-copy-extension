(() => {
  const ORIGIN = 'https://github.com';
  console.log('[GitHub Actions Copy Log] Extension loaded');

  /**
   * Add Copy log button to step header
   */
  function addCopyButton(header) {
    // Check if button already exists
    if (header.querySelector('.copy-logs-btn')) return;

    // Get check-step element
    const checkStep = header.closest('check-step');
    if (!checkStep) {
      console.log('[GitHub Actions Copy Log] No check-step element found for header:', header);
      return;
    }

    // Get path from data-log-url attribute
    const logPath = checkStep.dataset.logUrl;
    if (!logPath) {
      console.log('[GitHub Actions Copy Log] No data-log-url found on check-step:', checkStep);
      return;
    }
    console.log('[GitHub Actions Copy Log] Found log URL:', logPath);

    // Prepare Primer BtnGroup
    let group = header.querySelector('.copy-logs-group');
    if (!group) {
      group = document.createElement('div');
      group.className = 'copy-logs-group BtnGroup ml-2';
      const durationEl = header.querySelector('.text-mono.text-normal.text-small.float-right');
      if (durationEl) durationEl.before(group);
      else header.appendChild(group);
    }

    // Create button element
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = 'Copy log';
    btn.className = 'copy-logs-btn BtnGroup-item btn btn-sm mr-2';
    btn.style.minWidth = 'auto';

    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      btn.disabled = true;
      btn.textContent = 'Copying…';

      try {
        // Automatically follow redirects (e.g. 307)
        const fullUrl = ORIGIN + logPath;
        console.log('[GitHub Actions Copy Log] Fetching log from:', fullUrl);
        const res = await fetch(fullUrl, {
          credentials: 'same-origin',
          redirect: 'follow'
        });
        console.log('[GitHub Actions Copy Log] Response status:', res.status);
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const text = await res.text();

        // Remove timestamps
        const stripped = text
          .trim()
          .split('\n')
          .map(line =>
            // Remove ISO8601 timestamp and following space at line start
            line.replace(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d+Z /, '')
          )
          .join('\n');

        // Write to clipboard
        console.log('[GitHub Actions Copy Log] Writing to clipboard, text length:', stripped.length);
        await navigator.clipboard.writeText(stripped);
        btn.textContent = 'Copied!';
      } catch (err) {
        console.error('[GitHub Actions Copy Log] Error:', err);
        btn.textContent = 'Error';
        alert('Failed to fetch log: ' + err.message);
      } finally {
        setTimeout(() => {
          btn.disabled = false;
          btn.textContent = 'Copy log';
        }, 1500);
      }
    });

    group.appendChild(btn);
  }

  /**
   * Scan all step headers in the page
   */
  function scanAll() {
    const headers = document.querySelectorAll('.CheckStep-header, summary.CheckStep-header');
    console.log('[GitHub Actions Copy Log] Found', headers.length, 'headers to scan');
    headers.forEach((header, index) => {
      console.log(`[GitHub Actions Copy Log] Processing header ${index}:`, header);
      addCopyButton(header);
    });
  }

  // Handle dynamic DOM updates
  console.log('[GitHub Actions Copy Log] Setting up MutationObserver');
  new MutationObserver(() => {
    console.log('[GitHub Actions Copy Log] DOM mutation detected, rescanning...');
    scanAll();
  }).observe(document.body, { childList: true, subtree: true });

  // Initial scan
  if (document.readyState === 'loading') {
    console.log('[GitHub Actions Copy Log] DOM still loading, waiting for DOMContentLoaded');
    document.addEventListener('DOMContentLoaded', scanAll);
  } else {
    console.log('[GitHub Actions Copy Log] DOM ready, scanning immediately');
    scanAll();
  }
})();