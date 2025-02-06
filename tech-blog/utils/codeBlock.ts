export function addCopyButtonsToCodeBlocks(content: string): string {
  const wrappedContent = content.replace(
    /<pre><code>([\s\S]*?)<\/code><\/pre>/g,
    (_match, code) => `
        <div class="code-block group">
          <pre><code>${code}</code></pre>
          <button
            class="copy-button group-hover:opacity-100"
            onclick="copyCode(this)"
            aria-label="コードをクリップボードにコピー"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
          </button>
        </div>
      `
  );

  const script = `
      <script>
        function copyCode(button) {
          const codeBlock = button.parentElement;
          const code = codeBlock.querySelector('code').textContent;
          
          navigator.clipboard.writeText(code).then(() => {
            const originalHTML = button.innerHTML;
            button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>';
            
            setTimeout(() => {
              button.innerHTML = originalHTML;
            }, 2000);
          });
        }
      </script>
    `;

  return wrappedContent + script;
}
