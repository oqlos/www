# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: case-studies.spec.js >> Case Studies Page >> case studies has working CTAs
- Location: e2e/case-studies.spec.js:26:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('a[href="/demo"]')
Expected: visible
Error: strict mode violation: locator('a[href="/demo"]') resolved to 2 elements:
    1) <a href="/demo">Demo</a> aka getByRole('link', { name: 'Demo', exact: true })
    2) <a href="/demo" class="btn btn-primary">📅 Book demo</a> aka getByRole('link', { name: '📅 Book demo' })

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('a[href="/demo"]')

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - navigation [ref=e4]:
    - link "OqlOS" [ref=e5] [cursor=pointer]:
      - /url: /
      - emphasis [ref=e6]: OqlOS
    - generic [ref=e7]:
      - link "Dashboard" [ref=e8] [cursor=pointer]:
        - /url: /dashboard
      - link "Scenarios ↗" [ref=e9] [cursor=pointer]:
        - /url: http://cql.localhost
      - link "NLP Console" [ref=e10] [cursor=pointer]:
        - /url: /nlp
      - link "Billing" [ref=e11] [cursor=pointer]:
        - /url: /billing
      - link "Demo" [ref=e12] [cursor=pointer]:
        - /url: /demo
      - link "ROI" [ref=e13] [cursor=pointer]:
        - /url: /roi
      - link "Case Studies" [ref=e14] [cursor=pointer]:
        - /url: /case-studies
      - link "Account" [ref=e15] [cursor=pointer]:
        - /url: /account
      - link "Status" [ref=e16] [cursor=pointer]:
        - /url: /status
      - link "Academy" [ref=e17] [cursor=pointer]:
        - /url: /academy
      - generic [ref=e18]: test@test.com
      - combobox "Language" [ref=e19] [cursor=pointer]:
        - option "🇬🇧 EN" [selected]
        - option "🇵🇱 PL"
        - option "🇩🇪 DE"
      - button "Toggle theme" [ref=e20] [cursor=pointer]: ☀️
      - button "Logout" [ref=e21] [cursor=pointer]
  - generic [ref=e22]:
    - generic [ref=e23]: Case Studies
    - heading "How companies reduce testing costs and accelerate hardware certification" [level=2] [ref=e24]
    - paragraph [ref=e25]: Real-world OqlOS implementations in Polish manufacturing and medical companies.
    - generic [ref=e26]:
      - generic [ref=e27]:
        - generic [ref=e28]:
          - generic [ref=e29]:
            - generic [ref=e30]: Medycyna
            - generic [ref=e31]: 📍 Gdańsk, Polska
          - heading "Redukcja czasu testów o 70% dla certyfikacji sprzętu medycznego" [level=3] [ref=e32]
          - paragraph [ref=e33]:
            - strong [ref=e34]: MediTest Sp. z o.o.
        - generic [ref=e35]:
          - generic [ref=e36]:
            - generic [ref=e37]:
              - heading "Challenge" [level=4] [ref=e38]
              - paragraph [ref=e39]: Ręczne testowanie 200+ urządzeń respiratorowych miesięcznie na certyfikację UMDNS. Proces trwał 5 dni, z wieloma błędami operatora.
            - generic [ref=e40]:
              - heading "Solution" [level=4] [ref=e41]
              - paragraph [ref=e42]: Implementacja OqlOS z DSL dla testów IEC 62353. Automatyczna rejestracja wyników w systemie jakości.
          - generic [ref=e43]:
            - heading "✅ Results" [level=4] [ref=e44]
            - list [ref=e45]:
              - listitem [ref=e46]:
                - generic [ref=e47]: →
                - text: "Czas testu: 5 dni → 1.5 dnia"
              - listitem [ref=e48]:
                - generic [ref=e49]: →
                - text: "Koszty QA: -60% rocznie"
              - listitem [ref=e50]:
                - generic [ref=e51]: →
                - text: Zero błędów w audytach GxP od wdrożenia
              - listitem [ref=e52]:
                - generic [ref=e53]: →
                - text: 3x więcej testów bez zatrudniania nowych osób
          - blockquote [ref=e54]:
            - paragraph [ref=e55]: "\"OqlOS pozwolił nam przejść audyt FDA bez uwag do procesów testowych. Pełna ścieżka audytu była kluczowa.\""
            - contentinfo [ref=e56]:
              - strong [ref=e57]: Marek Kowalski
              - text: ", Dyrektor Jakości, MediTest Sp. z o.o."
      - generic [ref=e58]:
        - generic [ref=e59]:
          - generic [ref=e60]:
            - generic [ref=e61]: Produkcja
            - generic [ref=e62]: 📍 Wrocław, Polska
          - heading "Automatyzacja testów zaworów i pomp procesowych" [level=3] [ref=e63]
          - paragraph [ref=e64]:
            - strong [ref=e65]: PumpControl Systems
        - generic [ref=e66]:
          - generic [ref=e67]:
            - generic [ref=e68]:
              - heading "Challenge" [level=4] [ref=e69]
              - paragraph [ref=e70]: Testowanie 50 konfiguracji pomp w różnych warunkach ciśnieniowych. Każda zmiana wymagała przepisania skryptów Python.
            - generic [ref=e71]:
              - heading "Solution" [level=4] [ref=e72]
              - paragraph [ref=e73]: OQL jako język testów - operatorzy piszą scenariusze bez programistów. Integracja z Modbus RTU i analogowymi czujnikami.
          - generic [ref=e74]:
            - heading "✅ Results" [level=4] [ref=e75]
            - list [ref=e76]:
              - listitem [ref=e77]:
                - generic [ref=e78]: →
                - text: "Nowy scenariusz testu: 2h (dev) → 15 min (operator)"
              - listitem [ref=e79]:
                - generic [ref=e80]: →
                - text: "Pokrycie testów regresji: 40% → 95%"
              - listitem [ref=e81]:
                - generic [ref=e82]: →
                - text: "Rozwiązywanie incydentów produkcyjnych: -70% czasu"
          - blockquote [ref=e83]:
            - paragraph [ref=e84]: "\"Nasz operator produkcji napisał pierwszy scenariusz OQL po 30 minutach szkolenia. To zmienia sposób myślenia o testach.\""
            - contentinfo [ref=e85]:
              - strong [ref=e86]: Anna Nowak
              - text: ", Kierownik Produkcji, PumpControl Systems"
      - generic [ref=e87]:
        - generic [ref=e88]:
          - generic [ref=e89]:
            - generic [ref=e90]: Software QA
            - generic [ref=e91]: 📍 Kraków, Polska
          - heading "Jedno narzędzie dla API, GUI i hardware testing" [level=3] [ref=e92]
          - paragraph [ref=e93]:
            - strong [ref=e94]: QA Digital
        - generic [ref=e95]:
          - generic [ref=e96]:
            - generic [ref=e97]:
              - heading "Challenge" [level=4] [ref=e98]
              - paragraph [ref=e99]: 3 różne zespoły używały Cypress, Postman i ręcznych procedur na hardware. Brak spójnej dokumentacji i ścieżki audytu.
            - generic [ref=e100]:
              - heading "Solution" [level=4] [ref=e101]
              - paragraph [ref=e102]: "Unifikacja w TestQL/OQL. Jeden DSL dla wszystkich warstw: API → GUI → Hardware. Wersjonowanie w Git."
          - generic [ref=e103]:
            - heading "✅ Results" [level=4] [ref=e104]
            - list [ref=e105]:
              - listitem [ref=e106]:
                - generic [ref=e107]: →
                - text: "Stack testowy: 3 narzędzia → 1 platforma"
              - listitem [ref=e108]:
                - generic [ref=e109]: →
                - text: "Koszty licencji: -€12k rocznie"
              - listitem [ref=e110]:
                - generic [ref=e111]: →
                - text: "Czas onboardingu QA: 2 tyg. → 3 dni"
          - blockquote [ref=e112]:
            - paragraph [ref=e113]: "\"Wreszcie mamy single source of truth dla testów. Dev, QA i Ops używają tego samego języka.\""
            - contentinfo [ref=e114]:
              - strong [ref=e115]: Tomasz Wiśniewski
              - text: ", Lead QA Engineer, QA Digital"
    - generic [ref=e116]:
      - heading "Want similar results?" [level=3] [ref=e117]
      - paragraph [ref=e118]: Book a 15-minute demo and see how OqlOS works in your context.
      - generic [ref=e119]:
        - link "📅 Book demo" [ref=e120] [cursor=pointer]:
          - /url: /demo
        - link "📊 ROI Calculator" [ref=e121] [cursor=pointer]:
          - /url: /roi
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | import { setupAuth } from "./helpers/test-helpers";
  3  | 
  4  | test.describe("Case Studies Page", () => {
  5  |   test.beforeEach(async ({ page }) => {
  6  |     await setupAuth(page);
  7  |   });
  8  | 
  9  |   test("case studies page loads with content", async ({ page }) => {
  10 |     await page.goto("/case-studies");
  11 |     await page.waitForLoadState("networkidle");
  12 | 
  13 |     // Check title
  14 |     await expect(page.locator("h2")).toBeVisible();
  15 | 
  16 |     // Check case study cards are visible
  17 |     await expect(page.locator("text=MediTest").first()).toBeVisible();
  18 |     await expect(page.locator("text=PumpControl").first()).toBeVisible();
  19 |     await expect(page.locator("text=QA Digital").first()).toBeVisible();
  20 | 
  21 |     // Check results section exists
  22 |     await expect(page.locator("text=-60%").first()).toBeVisible();
  23 |     await expect(page.locator("text=70%").first()).toBeVisible();
  24 |   });
  25 | 
  26 |   test("case studies has working CTAs", async ({ page }) => {
  27 |     await page.goto("/case-studies");
  28 |     await page.waitForLoadState("networkidle");
  29 | 
  30 |     // Check demo CTA link
  31 |     const demoLink = page.locator('a[href="/demo"]');
> 32 |     await expect(demoLink).toBeVisible();
     |                            ^ Error: expect(locator).toBeVisible() failed
  33 | 
  34 |     // Check ROI link
  35 |     const roiLink = page.locator('a[href="/roi"]');
  36 |     await expect(roiLink).toBeVisible();
  37 |   });
  38 | });
  39 | 
```