function collectStyles(): string {
  const styles: string[] = [];
  for (const sheet of Array.from(document.styleSheets)) {
    try {
      for (const rule of Array.from(sheet.cssRules)) {
        styles.push(rule.cssText);
      }
    } catch {
      // Cross-origin stylesheets can't be read — skip
      if (sheet.href) {
        styles.push(`@import url("${sheet.href}");`);
      }
    }
  }
  return styles.join("\n");
}

function buildPrintHtml(contentHtml: string, title: string): string {
  const styles = collectStyles();
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${title}</title>
  <style>
    ${styles}

    @media print {
      body {
        margin: 0;
        padding: 0;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
    }

    body {
      font-family: Inter, system-ui, -apple-system, sans-serif;
      background: white;
      color: #000;
      margin: 0;
      padding: 40px;
    }

    .pdf-section {
      page-break-after: always;
    }

    .pdf-section:last-child {
      page-break-after: auto;
    }
  </style>
</head>
<body>${contentHtml}</body>
</html>`;
}

function printInIframe(html: string): void {
  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.left = "-9999px";
  iframe.style.top = "0";
  iframe.style.width = "800px";
  iframe.style.height = "600px";
  document.body.appendChild(iframe);

  const doc = iframe.contentDocument ?? iframe.contentWindow?.document;
  if (!doc) {
    document.body.removeChild(iframe);
    return;
  }

  doc.open();
  doc.write(html);
  doc.close();

  iframe.onload = () => {
    setTimeout(() => {
      iframe.contentWindow?.print();
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 1000);
    }, 500);
  };
}

export function downloadReportPdf(
  contentElement: HTMLElement,
  reportLabel: string,
  menteeName: string
) {
  const clone = contentElement.cloneNode(true) as HTMLElement;
  const title = `${reportLabel} - ${menteeName}`;
  const html = buildPrintHtml(clone.innerHTML, title);
  printInIframe(html);
}

export function downloadAllReportsPdf(
  contentElements: HTMLElement[],
  _reportLabels: string[],
  menteeName: string
) {
  const sections = contentElements
    .map((el) => {
      const clone = el.cloneNode(true) as HTMLElement;
      return `<div class="pdf-section">${clone.innerHTML}</div>`;
    })
    .join("");

  const title = `Relatórios - ${menteeName}`;
  const html = buildPrintHtml(sections, title);
  printInIframe(html);
}
