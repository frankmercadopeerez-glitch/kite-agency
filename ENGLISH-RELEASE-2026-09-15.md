# English expansion — Kite Cartagena

Final production deployment: `dpl_353QABwuQjPMufEdF669uXCzPJQ8`, https://kite-agency.vercel.app, September 15, 2026. This release includes the English expansion and Spanish terms under Nohemi’s confirmed identity.

## Content

The 65 specialised Spanish articles now have complete English versions: titles, descriptions and all four authored sections. The English blog contains 80 articles, matching Spanish. The eight other locales retain 15 guides each. Total: 280 article versions and 511 sitemap URLs including the new terms page.

Sources: `scripts/editorial/expansion-*-en.mjs`. Missing or duplicate translation entries fail validation. Spanish and English specialised articles expose reciprocal alternates and x-default to Spanish; other languages are not advertised as existing translations.

Topic directories use translated titles and English destinations. Related articles and service links remain within the selected language. The budget calculator and comparison table now work in English, with COP amounts formatted for English readers; no exchange rate is implied.

## Verification

- Static site including terms and aliases: 1,017 HTML files; no errors or warnings.
- Editorial audit: 280 articles; no identical paragraphs; 7,160 comparisons, maximum lexical Jaccard similarity 0.216. This is not a search-ranking or cannibalisation measurement.
- Mobile browser: all 280 articles passed overflow, visibility, images and favicon checks.
- English-specific browser: all 65 new pages passed full-body text, headings, language links and desktop overflow checks.
- English search, hub links and language switching passed.
- Budget example: two introductory lessons plus COP 100,000 group costs gives COP 1,400,000 total and COP 700,000 per person.
- Production evidence: `.qa/production-release.json` and `.qa/english-expansion.json` after deployment verification.

## Terms request in the same work session

Prepared 28 extensive sections in `scripts/legal/terms-es.mjs`, rendered at `/terminos-y-condiciones/`. Footer links appear on every generated page, with non-Spanish labels explicitly identifying the terms as Spanish. The legacy terms routes redirect to the new page. There is no fictitious English legal translation.

After checking the source project’s privacy page, the owner explicitly instructed that the terms be put in Nohemi’s name. Published identity: Nohemi Carrillo Sánchez, NIT 700555590-5, trading as Dunas & Olas; email dunasyolasatm@gmail.com, WhatsApp +57 316 303 0589, RNT 292710. The full physical notification address remains unprovided: the page states Cartagena and verified digital contact channels without inventing a street address. A Colombian legal review is recommended; no guaranteed immunity or automatic acceptance is claimed.

The terms cover precontractual information, payments, weather, cancellations, statutory withdrawal and payment reversal, minors, participation, rental inspection, justified damage claims, assistance, repairs, transport, insurance, images, personal data, complaints and versioning. Publication in the footer does not capture booking acceptance: the operator must provide the version and obtain explicit agreement before payment.

The original September 15 SEO report describes the preceding release; this document records the subsequent English expansion.
