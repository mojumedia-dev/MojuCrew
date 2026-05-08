"""Build a polished PDF from the Wright Homes partnership markdown.
Uses Python markdown for HTML conversion and headless Chrome for PDF.
"""
import subprocess
import sys
from pathlib import Path

import markdown

HERE = Path(__file__).parent
SRC_NAME = sys.argv[1] if len(sys.argv) > 1 else "Wright_Homes_Partnership"
SRC = HERE / f"{SRC_NAME}.md"
HTML_OUT = HERE / "_build" / f"{SRC_NAME}.html"
PDF_OUT = HERE / f"{SRC_NAME}.pdf"

CHROME = r"C:/Program Files/Google/Chrome/Application/chrome.exe"

CSS = """
@page { size: Letter; margin: 0.75in 0.75in 0.85in 0.75in; }
:root {
    --brand: #1f3a8a;
    --brand-soft: #4a6cf7;
    --ink: #1a1a1a;
    --muted: #4a4a4a;
    --rule: #d8d8e0;
    --bg-soft: #f5f7fb;
    --accent: #d4a017;
}
* { box-sizing: border-box; }
html { font-size: 10.5pt; }
body {
    font-family: "Source Serif Pro", Charter, Georgia, "Times New Roman", serif;
    color: var(--ink);
    line-height: 1.55;
    margin: 0;
    padding: 0;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
}
h1, h2, h3, h4, h5 {
    font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    color: var(--brand);
    font-weight: 700;
    letter-spacing: -0.01em;
    page-break-after: avoid;
}
h1 {
    font-size: 26pt;
    line-height: 1.1;
    margin: 0 0 0.2em 0;
    letter-spacing: -0.02em;
}
h2 {
    font-size: 16pt;
    margin: 1.4em 0 0.55em 0;
    padding-bottom: 0.25em;
    border-bottom: 1.5px solid var(--rule);
}
h3 {
    font-size: 12pt;
    margin: 1.1em 0 0.4em 0;
    color: var(--ink);
    font-weight: 700;
}
p { margin: 0.55em 0; }
strong { color: var(--brand); font-weight: 700; }
em { color: var(--muted); }
ul, ol { margin: 0.5em 0 0.6em 1.4em; padding: 0; }
li { margin: 0.2em 0; }
li::marker { color: var(--brand); }
hr {
    border: 0;
    border-top: 1px solid var(--rule);
    margin: 1.4em 0 1em 0;
}
table {
    width: 100%;
    border-collapse: collapse;
    margin: 0.7em 0 1em 0;
    font-size: 9.5pt;
    page-break-inside: avoid;
}
thead th {
    background: var(--bg-soft);
    color: var(--brand);
    font-family: "Inter", sans-serif;
    font-weight: 700;
    font-size: 9pt;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    padding: 0.6em 0.7em;
    text-align: left;
    border-bottom: 2px solid var(--rule);
}
tbody td {
    padding: 0.55em 0.7em;
    border-bottom: 1px solid var(--rule);
    vertical-align: top;
}
tbody tr:nth-child(even) td {
    background: #fbfbfd;
}
blockquote {
    margin: 1em 0;
    padding: 0.85em 1.1em;
    background: #fff8e8;
    border-left: 3px solid var(--accent);
    border-radius: 4px;
    color: var(--ink);
}
blockquote p { margin: 0; }
code {
    font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
    font-size: 0.92em;
    background: var(--bg-soft);
    padding: 0.1em 0.35em;
    border-radius: 3px;
}

.title-block {
    border-bottom: 4px solid var(--brand);
    padding-bottom: 1em;
    margin-bottom: 1.4em;
}
.title-block .label {
    font-family: "Inter", sans-serif;
    font-size: 10pt;
    text-transform: uppercase;
    letter-spacing: 0.18em;
    color: var(--brand);
    font-weight: 700;
    margin-bottom: 0.4em;
}
.title-block .meta {
    font-family: "Inter", sans-serif;
    font-size: 10pt;
    color: var(--muted);
    margin-top: 0.5em;
    line-height: 1.5;
}
.footer-disclosure {
    font-size: 9pt;
    color: var(--muted);
    border-top: 1px solid var(--rule);
    padding-top: 0.8em;
    margin-top: 2em;
    line-height: 1.5;
}
"""


def main():
    HTML_OUT.parent.mkdir(parents=True, exist_ok=True)
    md_text = SRC.read_text(encoding="utf-8")

    # First two H1 lines and metadata get pulled into a custom title block.
    lines = md_text.splitlines()
    title = ""
    overview_label = ""
    meta_lines = []
    body_start = 0
    for i, line in enumerate(lines):
        if line.startswith("# ") and not title:
            title = line[2:].strip()
        elif "Partnership Overview" in line and not overview_label:
            overview_label = "Partnership Overview"
        elif line.strip().startswith("Prepared for") or line.strip().startswith("Anchored on"):
            meta_lines.append(line.strip())
        elif line.strip() == "---":
            body_start = i + 1
            break
    body_md = "\n".join(lines[body_start:])

    body_html = markdown.markdown(
        body_md,
        extensions=["tables", "fenced_code", "sane_lists"],
    )

    # Pull the final "MojuCrew is operated by..." paragraph out into a styled
    # footer disclosure if present.
    if '<p><em>MojuCrew is operated' in body_html:
        idx = body_html.rfind('<hr />')
        if idx == -1:
            idx = body_html.rfind('<hr>')
        if idx != -1:
            disc = body_html[idx:]
            body_html = body_html[:idx]
            disc = disc.replace('<hr />', '').replace('<hr>', '')
            disc = disc.replace('<p><em>', '<div class="footer-disclosure">').replace('</em></p>', '</div>')
            body_html = body_html + disc

    title_block = f'''
    <div class="title-block">
      <div class="label">{overview_label or "Partnership Overview"}</div>
      <h1>{title}</h1>
      <div class="meta">{"<br/>".join(meta_lines)}</div>
    </div>
    '''

    full_html = f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>{title}</title>
<style>{CSS}</style>
</head>
<body>
{title_block}
{body_html}
</body>
</html>
"""
    HTML_OUT.write_text(full_html, encoding="utf-8")
    print(f"[build] wrote {HTML_OUT}")

    file_url = "file:///" + str(HTML_OUT).replace("\\", "/")
    pdf_target = str(PDF_OUT).replace("\\", "/")
    args = [
        CHROME,
        "--headless=new",
        "--disable-gpu",
        "--no-sandbox",
        "--no-pdf-header-footer",
        f"--print-to-pdf={pdf_target}",
        file_url,
    ]
    print("[build] running headless Chrome to render PDF...")
    res = subprocess.run(args, capture_output=True, text=True, timeout=90)
    if res.returncode != 0 or not PDF_OUT.exists():
        print("[build] FAILED")
        print("stdout:", res.stdout[-1000:])
        print("stderr:", res.stderr[-1000:])
        sys.exit(1)
    print(f"[build] PDF: {PDF_OUT} ({PDF_OUT.stat().st_size // 1024} KB)")


if __name__ == "__main__":
    main()
