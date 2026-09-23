import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { test } from "node:test";
import ts from "typescript";

const layout = readFileSync(
  new URL("../src/layouts/Layout.astro", import.meta.url),
  "utf8",
);
const signup = readFileSync(
  new URL("../src/components/NewsletterSignup.astro", import.meta.url),
  "utf8",
);
const storage = {
  getItem() {
    throw new Error("Storage blocked");
  },
  setItem() {
    throw new Error("Storage blocked");
  },
};

test("the initial theme script tolerates blocked storage and follows OS changes", () => {
  const classes = new Set<string>();
  const events: Record<string, () => void> = {};
  const media = {
    matches: true,
    addEventListener(name: string, callback: () => void) {
      events[name] = callback;
    },
  };
  runInNewContext(layout.match(/<script is:inline>([\s\S]*?)<\/script>/)![1], {
    localStorage: storage,
    window: { matchMedia: () => media, addEventListener() {} },
    document: {
      documentElement: {
        setAttribute() {},
        classList: {
          toggle(name: string, active: boolean) {
            active ? classes.add(name) : classes.delete(name);
          },
          add(name: string) {
            classes.add(name);
          },
        },
      },
    },
  });
  assert.ok(classes.has("dark"));
  media.matches = false;
  events.change();
  assert.ok(!classes.has("dark"));
});

function formHarness(fetch: () => Promise<unknown>) {
  let submit: (event: { preventDefault(): void }) => Promise<void>;
  const form = {
    dataset: {} as Record<string, string>,
    reset() {},
    setAttribute() {},
    removeAttribute() {},
    addEventListener(_event: string, callback: typeof submit) {
      submit = callback;
    },
  };
  const button = { disabled: false };
  const input = { value: "reader@example.com" };
  const message = { textContent: "" };
  const nodes: Record<string, unknown> = {
    "[data-letter-form]": form,
    "[data-letter-email]": input,
    "[data-letter-submit]": button,
    "[data-letter-message]": message,
  };
  const source = signup.match(/<script>([\s\S]*?)<\/script>/)![1];
  runInNewContext(ts.transpile(source, { target: ts.ScriptTarget.ES2022 }), {
    document: {
      querySelectorAll: () => [
        { querySelector: (selector: string) => nodes[selector] },
      ],
    },
    localStorage: storage,
    fetch,
    AbortSignal,
    Error,
  });
  return { button, message, submit: () => submit({ preventDefault() {} }) };
}

test("signup remains successful when storing the subscription flag fails", async () => {
  const form = formHarness(async () =>
    Response.json({ ok: true, message: "You're on the list." }),
  );
  await form.submit();
  assert.equal(form.message.textContent, "You're on the list.");
  assert.equal(form.button.disabled, false);
});

test("double submit sends one request and re-enables the form after failure", async () => {
  let reject!: (error: Error) => void;
  let requests = 0;
  const form = formHarness(() => {
    requests++;
    return new Promise((_resolve, fail) => {
      reject = fail;
    });
  });
  const pending = form.submit();
  assert.equal(form.button.disabled, true);
  await form.submit();
  assert.equal(requests, 1);
  reject(new Error("Network unavailable"));
  await pending;
  assert.equal(form.message.textContent, "Network unavailable");
  assert.equal(form.button.disabled, false);
});

test("non-JSON server failures display feedback and allow retry", async () => {
  const form = formHarness(
    async () => new Response("Gateway unavailable", { status: 502 }),
  );
  await form.submit();
  assert.equal(
    form.message.textContent,
    "Something went wrong. Please try again.",
  );
  assert.equal(form.button.disabled, false);
});
