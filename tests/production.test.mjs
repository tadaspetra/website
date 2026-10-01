import assert from 'node:assert/strict';
import { readFile, readdir, access } from 'node:fs/promises';
import { test } from 'node:test';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const output = '.vercel/output';
const staticDir = `${output}/static`;
const config = JSON.parse(await readFile(`${output}/config.json`, 'utf8'));
const functionDir = `${output}/functions/_render.func`;
const functionConfig = JSON.parse(await readFile(`${functionDir}/.vc-config.json`, 'utf8'));
// Import the packaged handler, including its traced dependencies, rather than source.
const { default: handler } = await import(pathToFileURL(path.resolve(functionDir, functionConfig.handler)));
const request = (route, init) => handler.fetch(new Request(`http://localhost${route}`, init));

for (const slug of await readdir('src/content/essays')) {
  const file = (await readdir(`src/content/essays/${slug}`)).find(name => /^index\.mdx?$/.test(name));
  if (!file) continue;
  const source = await readFile(`src/content/essays/${slug}/${file}`, 'utf8');
  test(`production essay and social image: ${slug}`, async () => {
    if (/^draft: true\s*$/m.test(source)) {
      await assert.rejects(access(`${staticDir}/${slug}/index.html`));
      await assert.rejects(access(`${staticDir}/${slug}/index.png`));
      const homepage = await readFile(`${staticDir}/index.html`, 'utf8');
      assert.ok(!homepage.includes(`href="/${slug}"`));
      return;
    }
    const html = await readFile(`${staticDir}/${slug}/index.html`, 'utf8');
    assert.ok(html.includes(`https://tadaspetra.com/${slug}/index.png`));
    const date = source.match(/^pubDatetime: (.+)$/m)[1];
    assert.ok(html.includes(`datetime="${new Date(date).toISOString()}"`));
    assert.ok(html.includes(new Intl.DateTimeFormat('en', {
      month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC',
    }).format(new Date(date))));
    const image = await readFile(`${staticDir}/${slug}/index.png`);
    assert.equal(image.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
    if (/client:(load|idle|visible|media|only)/.test(source)) assert.ok(html.includes('<astro-island'));
  });
}

test('Vercel output keeps the legacy permanent redirect and newsletter route', () => {
  assert.ok(config.routes.some(route => route.src === '^/how-computers-work$' &&
    route.status === 301 && route.headers.Location === '/how-the-computer-works'));
  assert.ok(config.routes.some(route => route.src === '^/newsletter/?$' && route.dest === '_render'));
  assert.equal(functionConfig.runtime, 'nodejs24.x');
  assert.equal(functionConfig.maxDuration, 60);
});

test('packaged Vercel function renders newsletter prefill and privacy headers', async () => {
  const response = await request('/newsletter?email=READER%40example.com');
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('cache-control'), 'no-store');
  assert.equal(response.headers.get('referrer-policy'), 'no-referrer');
  assert.match(await response.text(), /value="reader@example.com"/);
});

test('packaged newsletter API rejects invalid input and foreign origins without delivery', async () => {
  const invalid = await request('/api/newsletter', {
    method: 'POST', headers: { 'content-type': 'application/json' }, body: '{"email":"invalid"}',
  });
  assert.equal(invalid.status, 400);
  assert.equal((await invalid.json()).message, 'Please enter a valid email address.');
  const foreign = await request('/api/newsletter', {
    method: 'POST', headers: { 'content-type': 'application/json', origin: 'https://other.example' },
    body: '{"email":"reader@example.com"}',
  });
  assert.equal(foreign.status, 403);
});
