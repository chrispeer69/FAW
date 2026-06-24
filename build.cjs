/* Builds the deployable Blue Collar AI website from the Claude Design export.
 * Reads source/_template_raw.html (the unpacked dc template) and emits a clean,
 * standalone proposal.html that renders the 9 pages with no dc runtime. */
const fs = require('fs');

const raw = fs.readFileSync('source/_template_raw.html', 'utf8');

// Fonts now live under assets/fonts/. Rewrite asset_N.woff2 -> assets/fonts/asset_N.woff2.
const repath = (s) => s.replace(/assets\/(asset_\d+\.woff2)/g, 'assets/fonts/$1');

// The <helmet> holds two <style> blocks: the first is the @font-face declarations
// (shared with the hub page), the second is the proposal's page/print styling.
const styles = [...raw.matchAll(/<style>([\s\S]*?)<\/style>/g)].map((m) => m[1]);
const fontCss = repath(styles[0].trim());
const pageCss = styles[1].trim();

// Shared font stylesheet, linked by both proposal.html and index.html.
fs.writeFileSync('assets/fonts.css', fontCss + '\n');

// The page content is the .stage div that sits between </helmet> and </x-dc>.
const body = repath(raw.slice(raw.indexOf('</helmet>') + '</helmet>'.length, raw.indexOf('</x-dc>')).trim());

const out = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Blue Collar AI — A Practical AI Roadmap for Fields Auto Works</title>
<meta name="description" content="A phased AI implementation and growth proposal prepared by Blue Collar AI for Fields Auto Works.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="">
<link rel="stylesheet" href="assets/fonts.css">
<style>
${pageCss}
</style>
</head>
<body>
${body}
</body>
</html>
`;

fs.writeFileSync('proposal.html', out);
console.log('Wrote proposal.html', out.length, 'chars and assets/fonts.css', fontCss.length, 'chars');
