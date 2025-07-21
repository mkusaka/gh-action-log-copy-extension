(() => {
  const ORIGIN = 'https://github.com';

  /**
   * Add Copy log button to step header
   */
  function addCopyButton(header) {
    // Check if button already exists
    if (header.querySelector('.copy-logs-btn')) return;

    // Get check-step element
    const checkStep = header.closest('check-step');
    if (!checkStep) return;

    // Get path from data-log-url attribute
    const logPath = checkStep.dataset.logUrl;
    if (!logPath) return;

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
        const res = await fetch(ORIGIN + logPath, {
          credentials: 'same-origin',
          redirect: 'follow'
        });
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
        await navigator.clipboard.writeText(stripped);
        btn.textContent = 'Copied!';
      } catch (err) {
        console.error(err);
        btn.textContent = 'Error';
        alert('Failed to fetch log');
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
    document
      .querySelectorAll('.CheckStep-header, summary.CheckStep-header')
      .forEach(addCopyButton);
  }

  // Handle dynamic DOM updates
  new MutationObserver(scanAll).observe(document.body, { childList: true, subtree: true });

  // Initial scan
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scanAll);
  } else {
    scanAll();
  }
})();