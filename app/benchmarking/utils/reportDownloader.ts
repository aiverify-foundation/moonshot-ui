export async function downloadHtmlReport(id: string) {
  const linkTags = document.querySelectorAll('link');
  let cssString = '';
  await Promise.all(
    Array.from(linkTags)
      .filter((link) => link.getAttribute('rel') === 'stylesheet')
      .map((link) =>
        fetch(link.getAttribute('href') as string).then((response) =>
          response.text()
        )
      )
  ).then((texts) => (cssString += texts.join('')));

  const bodyContent = document.querySelector('#report-content');
  if (!bodyContent) return;
  const clonedBodyContent = bodyContent.cloneNode(true) as HTMLElement;
  const elementsToRemove = clonedBodyContent.querySelectorAll(
    '[data-download="hide"]'
  );
  elementsToRemove.forEach((element) => {
    element.remove();
  });
  const bodyClass = document.querySelector('body')?.getAttribute('class');
  const completeHtml = `
      <!DOCTYPE html>
      <html>
      <head>
      <style>${cssString}</style>
      </head>
      <body class="${bodyClass}" style="overflow-x:hidden;">
        ${clonedBodyContent.innerHTML}
        <script>
          document.querySelectorAll('[data-download="collapsible-trigger"]').forEach((element) => {
            element.addEventListener('click', () => element.nextElementSibling.classList.toggle('main-visible'))
          });
        </script>
      </body>
      </html>
    `;

  const blob = new Blob([completeHtml], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `benchmark-report-${id}.html`;
  link.click();
  URL.revokeObjectURL(url);
}
