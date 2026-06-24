const fs = require('fs');
const zlib = require('zlib');
const src = fs.readFileSync('Blue Collar AI Proposal.html', 'utf8');

function grab(type) {
  const re = new RegExp('<script type="' + type + '"[^>]*>([\\s\\S]*?)</script>');
  const m = src.match(re);
  return m ? m[1] : null;
}

const manifestRaw = grab('__bundler/manifest');
const templateRaw = grab('__bundler/template');
const extRaw = grab('__bundler/ext_resources');

const manifest = JSON.parse(manifestRaw);
let template = JSON.parse(templateRaw);
const ext = extRaw ? JSON.parse(extRaw) : [];

console.log('=== ASSETS (manifest) ===');
const uuids = Object.keys(manifest);
console.log('count:', uuids.length);
for (const u of uuids) {
  const e = manifest[u];
  console.log('  uuid', u.slice(0,8), 'mime', e.mime, 'compressed', !!e.compressed, 'b64len', e.data.length);
}
console.log('=== EXT RESOURCES ===');
console.log(JSON.stringify(ext, null, 2).slice(0, 2000));
console.log('=== TEMPLATE size (chars) ===', template.length);

// Decode assets to disk under assets/, replace uuid placeholders with relative paths
fs.mkdirSync('assets', { recursive: true });
const extById = {};
for (const e of ext) extById[e.id] = e;

const extToMime = (mime) => {
  if (!mime) return 'bin';
  if (mime.includes('svg')) return 'svg';
  if (mime.includes('png')) return 'png';
  if (mime.includes('jpeg') || mime.includes('jpg')) return 'jpg';
  if (mime.includes('webp')) return 'webp';
  if (mime.includes('gif')) return 'gif';
  if (mime.includes('woff2')) return 'woff2';
  if (mime.includes('woff')) return 'woff';
  if (mime.includes('css')) return 'css';
  if (mime.includes('javascript')) return 'js';
  return 'bin';
};

const nameMap = {};
let i = 0;
for (const u of uuids) {
  const e = manifest[u];
  let bytes = Buffer.from(e.data, 'base64');
  if (e.compressed) {
    try { bytes = zlib.gunzipSync(bytes); } catch (err) { console.log('gunzip fail', u, err.message); }
  }
  const fname = 'asset_' + (i++) + '.' + extToMime(e.mime);
  fs.writeFileSync('assets/' + fname, bytes);
  nameMap[u] = 'assets/' + fname;
}

// Replace uuids in template with asset paths (matching bundler logic)
for (const u of uuids) template = template.split(u).join(nameMap[u]);

fs.writeFileSync('_template_raw.html', template);
console.log('=== wrote _template_raw.html and', uuids.length, 'assets ===');
