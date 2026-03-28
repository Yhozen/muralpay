# Mural Pay Backend Coding Challenge

A multi-merchant marketplace backend (think Amazon) where customers can buy products from different merchants using USDC on Polygon, and merchants receive payouts in COP to their bank accounts.

**Live URL:** [https://muralpay.vercel.app/](https://muralpay.vercel.app/)

**Tech stack:** NestJS · Prisma · PostgreSQL (Neon) · Vercel

OpenAPI: [https://muralpay.vercel.app/api-json](https://muralpay.vercel.app/api-json)

Swagger: [https://muralpay.vercel.app/api](https://muralpay.vercel.app/api)

---

## Setup

The app is deployed on Vercel and can be tested directly against the live URL. A Postman collection is included in the repository at `MuralPay.postman_collection.json`. Import it and you're ready to go.

---

## Testing the flow

### 1. Create a user

```
POST /users
Content-Type: application/json

{ "email": "you@example.com" }
```

The response includes an `apiKey`. Use it as a Bearer token for all subsequent requests.

---

### 2. Browse products

Use the pre-seeded merchant to list available products:

```
GET /merchants/019d3146-8b27-70ee-8a4d-8a5981de5229/products
```

Note the `id` of any product you want to buy.

---

### 3. Create a checkout session

```
POST /checkouts/create
Authorization: Bearer <apiKey>
```

Returns a checkout session with an `id`. Use that `id` in the next steps.

---

### 4. Add products to the session

```
POST /checkouts/add-product
Authorization: Bearer <apiKey>
Content-Type: application/json

{
  "checkoutSessionId": "<session id>",
  "productId": "<product id>",
  "quantity": 1
}
```

You can also update a quantity or remove an item:

```
POST /checkouts/update-item   { checkoutSessionId, productId, quantity }
POST /checkouts/remove-product { checkoutSessionId, productId }
```

---

### 5. Complete the session

```
POST /checkouts/complete
Authorization: Bearer <apiKey>
Content-Type: application/json

{ "checkoutSessionId": "<session id>" }
```

Returns the total amount in USDC you need to pay.

---

### 6. Pay

Send exactly that amount in **USDC on Polygon Amoy testnet** to:

```
0xc918999d2F8c17DE36c5D09d7d71Fd5D9443B47c
```

Once the transaction is detected, the Mural Pay webhook marks the payment as complete and triggers a COP payout to the merchant's bank account.

---

### Other endpoints

```
GET /checkouts/current    — get your active session
```

---

## Current status

### Working

- User registration with API key issuance
- Multi-merchant product catalog (`GET /merchants/:id/products`)
- Full checkout session lifecycle: create, add/update/remove products, complete
- Total amount calculation at checkout completion
- Mural Pay webhook receiver — marks payments as complete and creates a payout request

### Not working / out of scope


| Area                               | Status                                                                                                                                                                                               |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Stock management**               | Completing a checkout does not decrement or reserve stock. The correct behavior would be to reserve stock when a session is completed and release it if payment doesn't arrive within a time window. |
| **Payment deduplication via memo** | Two customers paying the same amount at the same time could collide. Payments should be matched using a unique per-session memo.                                                                     |
| **Payout execution**               | A payout request object is created but the actual call to the Mural Pay payout API is not made.                                                                                                      |
| **Webhook signature validation**   | Incoming webhook payloads are not verified against a signature.                                                                                                                                      |
| **Webhook idempotency**            | The same webhook event delivered twice would be processed twice.                                                                                                                                     |


---

## Future work

The following would be needed to consider this production-ready:

- **Unique payment memo** — Generate a per-session memo so incoming USDC transfers can be matched to the correct checkout unambiguously, even when two customers pay the same amount simultaneously.
- **Stock reservation with TTL** — Reserve product stock when a session is completed, and automatically release it via a scheduled job if payment is not received within a defined window (e.g., 15 minutes).
- **Execute payout requests** — Wire the payout service to actually call the Mural Pay API and transfer funds to the merchant's COP bank account once a payment is confirmed.
- **Webhook event queue** — Instead of processing webhooks synchronously, push events onto a queue (e.g., BullMQ / Redis) and process them with workers. This provides retries, back-pressure, and exactly-once delivery semantics.
- **Webhook signature validation** — Verify the `X-Signature` (or equivalent) header on every incoming webhook to reject forged payloads.
- **Idempotency keys** — Store processed webhook event IDs so duplicate deliveries are safely ignored.
- **JWT authentication** — Replace the current API-key-per-request database lookup with short-lived JWTs to remove the extra DB round-trip on every authenticated request.
- **Rate limiting** — Add per-user and per-IP rate limits to protect the checkout and payment endpoints.
- **Observability** — Structured logging, distributed tracing, and alerting on failed payouts or unmatched payments.

---

## Build log

Raw notes taken during development.

**~0 min** — Decided to deploy to Vercel from the start to avoid surprises later. Fast enough for quick iterations.
Planning to use Prisma + PostgreSQL since that's a familiar combo.

**~20 min** — Deploy is live at [https://muralpay.vercel.app/](https://muralpay.vercel.app/). Added a Neon database via the Vercel integration and set up Prisma following the NestJS recipe. Got env variables locally via `vercel env pull`.

**~35 min** — Prisma on prod is working. Pausing the timer to wait for Mural Pay sandbox access.

**Later** — Sandbox access never came through. Built the rest of the app using an agnostic payin/payout service that mocks the Mural Pay API, so the architecture is correct but the actual API calls are stubbed.