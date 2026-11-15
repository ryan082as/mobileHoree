import test from "node:test";
import assert from "node:assert/strict";
import {
  resolveLegacyRegulasiSlug,
  resolveMenuDeeplink,
} from "../src/utils/menuDeeplinkParser.ts";

const VALID_SLUGS = ["halal", "pirt", "higiene"];

test("resolves custom scheme and Universal Link for /docs and /about", () => {
  const docsCustom = resolveMenuDeeplink("petarasa://docs/halal", VALID_SLUGS);
  assert.equal(docsCustom.matched, true);
  assert.equal(docsCustom.notFound, false);
  assert.equal(docsCustom.targetPath, "/docs/halal");
  assert.equal(docsCustom.targetWithQuery, "/docs/halal");

  const aboutUniversal = resolveMenuDeeplink("https://petarasa.id/about?bagian=tim", VALID_SLUGS);
  assert.equal(aboutUniversal.matched, true);
  assert.equal(aboutUniversal.notFound, false);
  assert.equal(aboutUniversal.targetPath, "/about");
  assert.equal(aboutUniversal.targetWithQuery, "/about?bagian=tim");
});

test("maps legacy aliases for SOP and Tim routes", () => {
  assert.deepEqual(resolveLegacyRegulasiSlug("higienitas"), {
    slug: "higiene",
    wasMapped: true,
  });

  const legacySop = resolveMenuDeeplink("petarasa://sop/higienitas", VALID_SLUGS);
  assert.equal(legacySop.matched, true);
  assert.equal(legacySop.notFound, false);
  assert.equal(legacySop.targetPath, "/docs/higiene");
  assert.equal(legacySop.wasLegacyMapped, true);

  const legacyTim = resolveMenuDeeplink("https://petarasa.id/tim", VALID_SLUGS);
  assert.equal(legacyTim.matched, true);
  assert.equal(legacyTim.notFound, false);
  assert.equal(legacyTim.targetPath, "/about");
  assert.equal(legacyTim.wasLegacyMapped, true);
});

test("flags unknown SOP slug and untrusted external origins as notFound", () => {
  const badSlug = resolveMenuDeeplink("petarasa://docs/tidak-ada", VALID_SLUGS);
  assert.equal(badSlug.matched, true);
  assert.equal(badSlug.notFound, true);

  const untrusted = resolveMenuDeeplink("https://evil.com/docs/halal", VALID_SLUGS);
  assert.equal(untrusted.matched, true);
  assert.equal(untrusted.notFound, true);
});
