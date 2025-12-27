# Session 01: Stripe Setup & Subscription API

## Epic 02 - User Profiles & Personas | Sprint 02

**Objective**: Integrate Stripe for payment processing, create subscription management API, and implement webhook handling for subscription lifecycle events.

**Estimated Duration**: 3-4 hours

---

## Prerequisites

### Environment Setup

```bash
# Verify Sprint 01 completion
pnpm build
pnpm test

# Install Stripe SDK
pnpm add stripe @stripe/stripe-js -w
pnpm add -D @types/stripe -w

# Verify environment variables template
cat .env.example
```

### Required Environment Variables

Add to `.env`:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Stripe Price IDs (create in Stripe Dashboard)
STRIPE_PRICE_FREE=price_...
STRIPE_PRICE_STARTER=price_...
STRIPE_PRICE_PRO=price_...

# Module Price IDs
STRIPE_PRICE_MODULE_GUEST=price_...
STRIPE_PRICE_MODULE_PROPERTY=price_...
STRIPE_PRICE_MODULE_STUDENT=price_...
STRIPE_PRICE_MODULE_TRAVEL=price_...
STRIPE_PRICE_MODULE_BUSINESS=price_...
```

---

## Phase 1: Database Schema (45 min)

### 1.1 Subscription Tables

Create `packages/database/src/schema/subscriptions.ts`:

```typescript
import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  jsonb,
  uuid,
} from 'drizzle-orm/pg-core'
import { users } from './users'

// Subscription Plans
export const subscriptionPlans = pgTable('subscription_plans', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(), // 'free', 'starter', 'pro', 'enterprise'
  displayName: text('display_name').notNull(),
  description: text('description'),
  stripePriceId: text('stripe_price_id').unique(),
  price: integer('price').notNull(), // cents
  interval: text('interval').notNull().default('month'), // 'month', 'year'
  features: jsonb('features').$type<string[]>().default([]),
  maxPersonas: integer('max_personas').notNull().default(1),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

// User Subscriptions
export const subscriptions = pgTable('subscriptions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  planId: uuid('plan_id')
    .notNull()
    .references(() => subscriptionPlans.id),
  stripeCustomerId: text('stripe_customer_id').notNull(),
  stripeSubscriptionId: text('stripe_subscription_id').unique(),
  status: text('status').notNull().default('active'), // 'active', 'canceled', 'past_due', 'trialing', 'paused'
  currentPeriodStart: timestamp('current_period_start'),
  currentPeriodEnd: timestamp('current_period_end'),
  cancelAtPeriodEnd: boolean('cancel_at_period_end').notNull().default(false),
  canceledAt: timestamp('canceled_at'),
  trialStart: timestamp('trial_start'),
  trialEnd: timestamp('trial_end'),
  metadata: jsonb('metadata').$type<Record<string, unknown>>().default({}),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

// Subscription Items (for module add-ons)
export const subscriptionItems = pgTable('subscription_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  subscriptionId: uuid('subscription_id')
    .notNull()
    .references(() => subscriptions.id, { onDelete: 'cascade' }),
  stripeItemId: text('stripe_item_id').unique(),
  stripePriceId: text('stripe_price_id').notNull(),
  moduleId: uuid('module_id'), // null for base plan
  quantity: integer('quantity').notNull().default(1),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

// Payment Methods
export const paymentMethods = pgTable('payment_methods', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  stripePaymentMethodId: text('stripe_payment_method_id').notNull().unique(),
  type: text('type').notNull(), // 'card', 'bank_account'
  isDefault: boolean('is_default').notNull().default(false),
  card: jsonb('card').$type<{
    brand: string
    last4: string
    expMonth: number
    expYear: number
  }>(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

// Invoices
export const invoices = pgTable('invoices', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  subscriptionId: uuid('subscription_id').references(() => subscriptions.id),
  stripeInvoiceId: text('stripe_invoice_id').notNull().unique(),
  amountDue: integer('amount_due').notNull(), // cents
  amountPaid: integer('amount_paid').notNull().default(0),
  currency: text('currency').notNull().default('usd'),
  status: text('status').notNull(), // 'draft', 'open', 'paid', 'void', 'uncollectible'
  invoicePdf: text('invoice_pdf'),
  hostedInvoiceUrl: text('hosted_invoice_url'),
  periodStart: timestamp('period_start'),
  periodEnd: timestamp('period_end'),
  paidAt: timestamp('paid_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

// Webhook Events (for idempotency)
export const webhookEvents = pgTable('webhook_events', {
  id: uuid('id').primaryKey().defaultRandom(),
  stripeEventId: text('stripe_event_id').notNull().unique(),
  eventType: text('event_type').notNull(),
  processed: boolean('processed').notNull().default(false),
  processedAt: timestamp('processed_at'),
  error: text('error'),
  payload: jsonb('payload').$type<Record<string, unknown>>(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})
```

### 1.2 Module Tables

Create `packages/database/src/schema/modules.ts`:

```typescript
import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  uuid,
  jsonb,
} from 'drizzle-orm/pg-core'
import { users } from './users'

// Available Modules
export const modules = pgTable('modules', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: text('slug').notNull().unique(), // 'guest', 'property-manager', etc.
  name: text('name').notNull(),
  description: text('description'),
  icon: text('icon'), // Lucide icon name
  stripePriceId: text('stripe_price_id'),
  price: integer('price').notNull().default(0), // cents per month
  features: jsonb('features').$type<string[]>().default([]),
  isActive: boolean('is_active').notNull().default(true),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

// User Module Activations
export const moduleActivations = pgTable('module_activations', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  moduleId: uuid('module_id')
    .notNull()
    .references(() => modules.id),
  subscriptionItemId: uuid('subscription_item_id'), // Stripe item if paid
  isActive: boolean('is_active').notNull().default(true),
  activatedAt: timestamp('activated_at').notNull().defaultNow(),
  deactivatedAt: timestamp('deactivated_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

// Usage Records (for metered billing)
export const usageRecords = pgTable('usage_records', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  moduleId: uuid('module_id').references(() => modules.id),
  action: text('action').notNull(), // 'api_call', 'transcription', etc.
  quantity: integer('quantity').notNull().default(1),
  metadata: jsonb('metadata').$type<Record<string, unknown>>().default({}),
  recordedAt: timestamp('recorded_at').notNull().defaultNow(),
})
```

### 1.3 Run Migration

```bash
# Generate migration
pnpm db:generate

# Run migration
pnpm db:migrate

# Verify tables created
pnpm db:studio
```

---

## Phase 2: Stripe Service (1 hour)

### 2.1 Stripe Client Setup

Create `packages/api/src/lib/stripe.ts`:

```typescript
import Stripe from 'stripe'
import { config } from '../config'

if (!config.stripe.secretKey) {
  throw new Error('STRIPE_SECRET_KEY is required')
}

export const stripe = new Stripe(config.stripe.secretKey, {
  apiVersion: '2023-10-16',
  typescript: true,
})

export const STRIPE_PRICES = {
  plans: {
    free: config.stripe.prices.free,
    starter: config.stripe.prices.starter,
    pro: config.stripe.prices.pro,
  },
  modules: {
    guest: config.stripe.prices.moduleGuest,
    'property-manager': config.stripe.prices.moduleProperty,
    student: config.stripe.prices.moduleStudent,
    travel: config.stripe.prices.moduleTravel,
    business: config.stripe.prices.moduleBusiness,
  },
} as const
```

### 2.2 Subscription Service

Create `packages/api/src/services/subscription.service.ts`:

```typescript
import { stripe, STRIPE_PRICES } from '../lib/stripe'
import { db } from '../db'
import {
  subscriptions,
  subscriptionPlans,
  subscriptionItems,
  paymentMethods,
} from '../db/schema'
import { eq, and } from 'drizzle-orm'
import type Stripe from 'stripe'

export class SubscriptionService {
  /**
   * Get or create Stripe customer for user
   */
  async getOrCreateCustomer(
    userId: string,
    email: string,
    name?: string
  ): Promise<string> {
    // Check if user already has a subscription with customer ID
    const existing = await db.query.subscriptions.findFirst({
      where: eq(subscriptions.userId, userId),
    })

    if (existing?.stripeCustomerId) {
      return existing.stripeCustomerId
    }

    // Create new Stripe customer
    const customer = await stripe.customers.create({
      email,
      name,
      metadata: { userId },
    })

    return customer.id
  }

  /**
   * Create a new subscription
   */
  async createSubscription(
    userId: string,
    planId: string,
    paymentMethodId?: string
  ): Promise<{
    subscription: typeof subscriptions.$inferSelect
    clientSecret?: string
  }> {
    // Get plan details
    const plan = await db.query.subscriptionPlans.findFirst({
      where: eq(subscriptionPlans.id, planId),
    })

    if (!plan) {
      throw new Error('Plan not found')
    }

    // Get user for customer creation
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    })

    if (!user) {
      throw new Error('User not found')
    }

    // Get or create Stripe customer
    const customerId = await this.getOrCreateCustomer(
      userId,
      user.email,
      user.name
    )

    // Attach payment method if provided
    if (paymentMethodId) {
      await stripe.paymentMethods.attach(paymentMethodId, {
        customer: customerId,
      })
      await stripe.customers.update(customerId, {
        invoice_settings: { default_payment_method: paymentMethodId },
      })
    }

    // Create Stripe subscription
    const stripeSubscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: plan.stripePriceId! }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
      metadata: { userId, planId },
    })

    // Save subscription to database
    const [subscription] = await db
      .insert(subscriptions)
      .values({
        userId,
        planId,
        stripeCustomerId: customerId,
        stripeSubscriptionId: stripeSubscription.id,
        status: stripeSubscription.status,
        currentPeriodStart: new Date(
          stripeSubscription.current_period_start * 1000
        ),
        currentPeriodEnd: new Date(
          stripeSubscription.current_period_end * 1000
        ),
      })
      .returning()

    // Get client secret for payment confirmation
    const invoice = stripeSubscription.latest_invoice as Stripe.Invoice
    const paymentIntent = invoice?.payment_intent as Stripe.PaymentIntent

    return {
      subscription,
      clientSecret: paymentIntent?.client_secret ?? undefined,
    }
  }

  /**
   * Get user's current subscription
   */
  async getSubscription(userId: string) {
    return db.query.subscriptions.findFirst({
      where: and(
        eq(subscriptions.userId, userId),
        eq(subscriptions.status, 'active')
      ),
      with: {
        plan: true,
        items: true,
      },
    })
  }

  /**
   * Update subscription plan
   */
  async updateSubscription(
    userId: string,
    newPlanId: string
  ): Promise<typeof subscriptions.$inferSelect> {
    const subscription = await this.getSubscription(userId)

    if (!subscription) {
      throw new Error('No active subscription found')
    }

    const newPlan = await db.query.subscriptionPlans.findFirst({
      where: eq(subscriptionPlans.id, newPlanId),
    })

    if (!newPlan) {
      throw new Error('Plan not found')
    }

    // Update Stripe subscription
    const stripeSubscription = await stripe.subscriptions.retrieve(
      subscription.stripeSubscriptionId!
    )

    await stripe.subscriptions.update(subscription.stripeSubscriptionId!, {
      items: [
        {
          id: stripeSubscription.items.data[0].id,
          price: newPlan.stripePriceId!,
        },
      ],
      proration_behavior: 'create_prorations',
    })

    // Update database
    const [updated] = await db
      .update(subscriptions)
      .set({ planId: newPlanId, updatedAt: new Date() })
      .where(eq(subscriptions.id, subscription.id))
      .returning()

    return updated
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(
    userId: string,
    cancelImmediately = false
  ): Promise<typeof subscriptions.$inferSelect> {
    const subscription = await this.getSubscription(userId)

    if (!subscription) {
      throw new Error('No active subscription found')
    }

    if (cancelImmediately) {
      await stripe.subscriptions.cancel(subscription.stripeSubscriptionId!)
    } else {
      await stripe.subscriptions.update(subscription.stripeSubscriptionId!, {
        cancel_at_period_end: true,
      })
    }

    // Update database
    const [updated] = await db
      .update(subscriptions)
      .set({
        status: cancelImmediately ? 'canceled' : subscription.status,
        cancelAtPeriodEnd: !cancelImmediately,
        canceledAt: cancelImmediately ? new Date() : null,
        updatedAt: new Date(),
      })
      .where(eq(subscriptions.id, subscription.id))
      .returning()

    return updated
  }

  /**
   * Resume a canceled subscription
   */
  async resumeSubscription(
    userId: string
  ): Promise<typeof subscriptions.$inferSelect> {
    const subscription = await db.query.subscriptions.findFirst({
      where: and(
        eq(subscriptions.userId, userId),
        eq(subscriptions.cancelAtPeriodEnd, true)
      ),
    })

    if (!subscription) {
      throw new Error('No subscription to resume')
    }

    await stripe.subscriptions.update(subscription.stripeSubscriptionId!, {
      cancel_at_period_end: false,
    })

    const [updated] = await db
      .update(subscriptions)
      .set({
        cancelAtPeriodEnd: false,
        updatedAt: new Date(),
      })
      .where(eq(subscriptions.id, subscription.id))
      .returning()

    return updated
  }

  /**
   * Get billing portal URL
   */
  async getBillingPortalUrl(
    userId: string,
    returnUrl: string
  ): Promise<string> {
    const subscription = await this.getSubscription(userId)

    if (!subscription) {
      throw new Error('No subscription found')
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: subscription.stripeCustomerId,
      return_url: returnUrl,
    })

    return session.url
  }
}

export const subscriptionService = new SubscriptionService()
```

---

## Phase 3: Webhook Handler (45 min)

### 3.1 Webhook Service

Create `packages/api/src/services/webhook.service.ts`:

```typescript
import { stripe } from '../lib/stripe'
import { db } from '../db'
import { subscriptions, invoices, webhookEvents } from '../db/schema'
import { eq } from 'drizzle-orm'
import type Stripe from 'stripe'

export class WebhookService {
  /**
   * Verify and parse webhook event
   */
  async verifyWebhook(
    payload: string | Buffer,
    signature: string
  ): Promise<Stripe.Event> {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!
    return stripe.webhooks.constructEvent(payload, signature, webhookSecret)
  }

  /**
   * Check if event was already processed (idempotency)
   */
  async isEventProcessed(eventId: string): Promise<boolean> {
    const existing = await db.query.webhookEvents.findFirst({
      where: eq(webhookEvents.stripeEventId, eventId),
    })
    return existing?.processed ?? false
  }

  /**
   * Mark event as processed
   */
  async markEventProcessed(
    eventId: string,
    eventType: string,
    error?: string
  ): Promise<void> {
    await db
      .insert(webhookEvents)
      .values({
        stripeEventId: eventId,
        eventType,
        processed: !error,
        processedAt: new Date(),
        error,
      })
      .onConflictDoUpdate({
        target: webhookEvents.stripeEventId,
        set: { processed: !error, processedAt: new Date(), error },
      })
  }

  /**
   * Handle webhook event
   */
  async handleEvent(event: Stripe.Event): Promise<void> {
    // Check idempotency
    if (await this.isEventProcessed(event.id)) {
      console.log(`Event ${event.id} already processed, skipping`)
      return
    }

    try {
      switch (event.type) {
        case 'customer.subscription.created':
        case 'customer.subscription.updated':
          await this.handleSubscriptionUpdate(
            event.data.object as Stripe.Subscription
          )
          break

        case 'customer.subscription.deleted':
          await this.handleSubscriptionDeleted(
            event.data.object as Stripe.Subscription
          )
          break

        case 'invoice.paid':
          await this.handleInvoicePaid(event.data.object as Stripe.Invoice)
          break

        case 'invoice.payment_failed':
          await this.handleInvoicePaymentFailed(
            event.data.object as Stripe.Invoice
          )
          break

        case 'customer.subscription.trial_will_end':
          await this.handleTrialWillEnd(
            event.data.object as Stripe.Subscription
          )
          break

        default:
          console.log(`Unhandled event type: ${event.type}`)
      }

      await this.markEventProcessed(event.id, event.type)
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error'
      await this.markEventProcessed(event.id, event.type, errorMessage)
      throw error
    }
  }

  /**
   * Handle subscription created/updated
   */
  private async handleSubscriptionUpdate(
    stripeSubscription: Stripe.Subscription
  ): Promise<void> {
    const userId = stripeSubscription.metadata.userId

    if (!userId) {
      console.warn(
        'Subscription without userId in metadata:',
        stripeSubscription.id
      )
      return
    }

    await db
      .update(subscriptions)
      .set({
        status: stripeSubscription.status,
        currentPeriodStart: new Date(
          stripeSubscription.current_period_start * 1000
        ),
        currentPeriodEnd: new Date(
          stripeSubscription.current_period_end * 1000
        ),
        cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
        canceledAt: stripeSubscription.canceled_at
          ? new Date(stripeSubscription.canceled_at * 1000)
          : null,
        updatedAt: new Date(),
      })
      .where(eq(subscriptions.stripeSubscriptionId, stripeSubscription.id))
  }

  /**
   * Handle subscription deleted
   */
  private async handleSubscriptionDeleted(
    stripeSubscription: Stripe.Subscription
  ): Promise<void> {
    await db
      .update(subscriptions)
      .set({
        status: 'canceled',
        canceledAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(subscriptions.stripeSubscriptionId, stripeSubscription.id))
  }

  /**
   * Handle invoice paid
   */
  private async handleInvoicePaid(invoice: Stripe.Invoice): Promise<void> {
    // Find subscription
    const subscription = await db.query.subscriptions.findFirst({
      where: eq(
        subscriptions.stripeSubscriptionId,
        invoice.subscription as string
      ),
    })

    if (!subscription) {
      console.warn('No subscription found for invoice:', invoice.id)
      return
    }

    // Upsert invoice record
    await db
      .insert(invoices)
      .values({
        userId: subscription.userId,
        subscriptionId: subscription.id,
        stripeInvoiceId: invoice.id,
        amountDue: invoice.amount_due,
        amountPaid: invoice.amount_paid,
        currency: invoice.currency,
        status: invoice.status!,
        invoicePdf: invoice.invoice_pdf ?? undefined,
        hostedInvoiceUrl: invoice.hosted_invoice_url ?? undefined,
        periodStart: invoice.period_start
          ? new Date(invoice.period_start * 1000)
          : undefined,
        periodEnd: invoice.period_end
          ? new Date(invoice.period_end * 1000)
          : undefined,
        paidAt: new Date(),
      })
      .onConflictDoUpdate({
        target: invoices.stripeInvoiceId,
        set: {
          status: invoice.status!,
          amountPaid: invoice.amount_paid,
          paidAt: new Date(),
        },
      })
  }

  /**
   * Handle invoice payment failed
   */
  private async handleInvoicePaymentFailed(
    invoice: Stripe.Invoice
  ): Promise<void> {
    // Update subscription status
    await db
      .update(subscriptions)
      .set({
        status: 'past_due',
        updatedAt: new Date(),
      })
      .where(
        eq(subscriptions.stripeSubscriptionId, invoice.subscription as string)
      )

    // TODO: Send email notification
    console.log('Payment failed for invoice:', invoice.id)
  }

  /**
   * Handle trial ending soon
   */
  private async handleTrialWillEnd(
    stripeSubscription: Stripe.Subscription
  ): Promise<void> {
    // TODO: Send email notification about trial ending
    console.log('Trial will end for subscription:', stripeSubscription.id)
  }
}

export const webhookService = new WebhookService()
```

---

## Phase 4: API Routes (45 min)

### 4.1 Subscription Routes

Create `packages/api/src/routes/subscription.routes.ts`:

```typescript
import { Router } from 'express'
import { z } from 'zod'
import { subscriptionService } from '../services/subscription.service'
import { authenticate } from '../middleware/auth'
import { validate } from '../middleware/validate'

const router = Router()

// All routes require authentication
router.use(authenticate)

// Create subscription
const createSubscriptionSchema = z.object({
  body: z.object({
    planId: z.string().uuid(),
    paymentMethodId: z.string().optional(),
  }),
})

router.post('/', validate(createSubscriptionSchema), async (req, res, next) => {
  try {
    const { planId, paymentMethodId } = req.body
    const result = await subscriptionService.createSubscription(
      req.user!.id,
      planId,
      paymentMethodId
    )
    res.status(201).json(result)
  } catch (error) {
    next(error)
  }
})

// Get current subscription
router.get('/', async (req, res, next) => {
  try {
    const subscription = await subscriptionService.getSubscription(req.user!.id)
    if (!subscription) {
      return res.status(404).json({ error: 'No active subscription found' })
    }
    res.json(subscription)
  } catch (error) {
    next(error)
  }
})

// Update subscription (change plan)
const updateSubscriptionSchema = z.object({
  body: z.object({
    planId: z.string().uuid(),
  }),
})

router.patch(
  '/',
  validate(updateSubscriptionSchema),
  async (req, res, next) => {
    try {
      const subscription = await subscriptionService.updateSubscription(
        req.user!.id,
        req.body.planId
      )
      res.json(subscription)
    } catch (error) {
      next(error)
    }
  }
)

// Cancel subscription
const cancelSubscriptionSchema = z.object({
  body: z.object({
    cancelImmediately: z.boolean().optional().default(false),
  }),
})

router.delete(
  '/',
  validate(cancelSubscriptionSchema),
  async (req, res, next) => {
    try {
      const subscription = await subscriptionService.cancelSubscription(
        req.user!.id,
        req.body.cancelImmediately
      )
      res.json(subscription)
    } catch (error) {
      next(error)
    }
  }
)

// Resume subscription
router.post('/resume', async (req, res, next) => {
  try {
    const subscription = await subscriptionService.resumeSubscription(
      req.user!.id
    )
    res.json(subscription)
  } catch (error) {
    next(error)
  }
})

export { router as subscriptionRoutes }
```

### 4.2 Billing Routes

Create `packages/api/src/routes/billing.routes.ts`:

```typescript
import { Router } from 'express'
import { z } from 'zod'
import { subscriptionService } from '../services/subscription.service'
import { authenticate } from '../middleware/auth'
import { validate } from '../middleware/validate'
import { db } from '../db'
import { invoices, paymentMethods } from '../db/schema'
import { eq, desc } from 'drizzle-orm'

const router = Router()

router.use(authenticate)

// Get billing portal URL
const portalSchema = z.object({
  query: z.object({
    returnUrl: z.string().url(),
  }),
})

router.get('/portal', validate(portalSchema), async (req, res, next) => {
  try {
    const url = await subscriptionService.getBillingPortalUrl(
      req.user!.id,
      req.query.returnUrl as string
    )
    res.json({ url })
  } catch (error) {
    next(error)
  }
})

// Get invoices
router.get('/invoices', async (req, res, next) => {
  try {
    const userInvoices = await db.query.invoices.findMany({
      where: eq(invoices.userId, req.user!.id),
      orderBy: desc(invoices.createdAt),
      limit: 20,
    })
    res.json(userInvoices)
  } catch (error) {
    next(error)
  }
})

// Get payment methods
router.get('/payment-methods', async (req, res, next) => {
  try {
    const methods = await db.query.paymentMethods.findMany({
      where: eq(paymentMethods.userId, req.user!.id),
    })
    res.json(methods)
  } catch (error) {
    next(error)
  }
})

export { router as billingRoutes }
```

### 4.3 Webhook Route

Create `packages/api/src/routes/webhook.routes.ts`:

```typescript
import { Router } from 'express'
import { webhookService } from '../services/webhook.service'
import express from 'express'

const router = Router()

// Stripe webhook - raw body required
router.post(
  '/stripe',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    const signature = req.headers['stripe-signature'] as string

    if (!signature) {
      return res.status(400).json({ error: 'Missing stripe-signature header' })
    }

    try {
      const event = await webhookService.verifyWebhook(req.body, signature)
      await webhookService.handleEvent(event)
      res.json({ received: true })
    } catch (error) {
      console.error('Webhook error:', error)
      const message =
        error instanceof Error ? error.message : 'Webhook handling failed'
      res.status(400).json({ error: message })
    }
  }
)

export { router as webhookRoutes }
```

### 4.4 Register Routes

Update `packages/api/src/routes/index.ts`:

```typescript
import { Router } from 'express'
import { subscriptionRoutes } from './subscription.routes'
import { billingRoutes } from './billing.routes'
import { webhookRoutes } from './webhook.routes'
// ... other imports

const router = Router()

// ... existing routes

// Subscription & Billing
router.use('/subscriptions', subscriptionRoutes)
router.use('/billing', billingRoutes)
router.use('/webhooks', webhookRoutes)

export { router }
```

---

## Phase 5: Seed Data (15 min)

### 5.1 Seed Subscription Plans

Create `packages/database/src/seed/plans.ts`:

```typescript
import { db } from '../db'
import { subscriptionPlans, modules } from '../schema'

export async function seedPlans() {
  // Subscription Plans
  await db
    .insert(subscriptionPlans)
    .values([
      {
        name: 'free',
        displayName: 'Free',
        description: 'Get started with basic features',
        price: 0,
        maxPersonas: 1,
        features: ['1 Persona', 'Basic transcription', 'Community support'],
      },
      {
        name: 'starter',
        displayName: 'Starter',
        description: 'For individual users',
        stripePriceId: process.env.STRIPE_PRICE_STARTER,
        price: 1000, // $10
        maxPersonas: 3,
        features: [
          '3 Personas',
          'Advanced transcription',
          'Email support',
          'API access',
        ],
      },
      {
        name: 'pro',
        displayName: 'Pro',
        description: 'For power users',
        stripePriceId: process.env.STRIPE_PRICE_PRO,
        price: 2500, // $25
        maxPersonas: -1, // unlimited
        features: [
          'Unlimited Personas',
          'Priority transcription',
          'Priority support',
          'Full API access',
          'Custom integrations',
        ],
      },
    ])
    .onConflictDoNothing()

  // Modules
  await db
    .insert(modules)
    .values([
      {
        slug: 'guest',
        name: 'Guest Module',
        description: 'In-property guest experience',
        icon: 'Users',
        stripePriceId: process.env.STRIPE_PRICE_MODULE_GUEST,
        price: 500, // $5
        features: ['Check-in/out', 'Service requests', 'Local recommendations'],
        sortOrder: 1,
      },
      {
        slug: 'property-manager',
        name: 'Property Manager',
        description: 'Manage your properties',
        icon: 'Building2',
        stripePriceId: process.env.STRIPE_PRICE_MODULE_PROPERTY,
        price: 1000, // $10
        features: [
          'Multi-property dashboard',
          'Automated workflows',
          'Guest management',
        ],
        sortOrder: 2,
      },
      {
        slug: 'student',
        name: 'Student',
        description: 'Academic tools',
        icon: 'GraduationCap',
        stripePriceId: process.env.STRIPE_PRICE_MODULE_STUDENT,
        price: 500, // $5
        features: ['Lecture transcription', 'Flashcards', 'Study groups'],
        sortOrder: 3,
      },
      {
        slug: 'travel',
        name: 'Travel',
        description: 'Trip planning & experiences',
        icon: 'Plane',
        stripePriceId: process.env.STRIPE_PRICE_MODULE_TRAVEL,
        price: 500, // $5
        features: ['Itinerary builder', 'AR tours', 'Local guides'],
        sortOrder: 4,
      },
      {
        slug: 'business',
        name: 'Business',
        description: 'Professional tools',
        icon: 'Briefcase',
        stripePriceId: process.env.STRIPE_PRICE_MODULE_BUSINESS,
        price: 1000, // $10
        features: [
          'Meeting transcription',
          'Action items',
          'Team collaboration',
        ],
        sortOrder: 5,
      },
    ])
    .onConflictDoNothing()

  console.log('Plans and modules seeded')
}
```

---

## Phase 6: Testing (30 min)

### 6.1 Subscription Service Tests

Create `packages/api/src/services/__tests__/subscription.service.test.ts`:

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { subscriptionService } from '../subscription.service'

// Mock Stripe
vi.mock('../../lib/stripe', () => ({
  stripe: {
    customers: {
      create: vi.fn().mockResolvedValue({ id: 'cus_test123' }),
    },
    subscriptions: {
      create: vi.fn().mockResolvedValue({
        id: 'sub_test123',
        status: 'active',
        current_period_start: Date.now() / 1000,
        current_period_end: Date.now() / 1000 + 30 * 24 * 60 * 60,
        latest_invoice: {
          payment_intent: { client_secret: 'pi_secret' },
        },
      }),
      retrieve: vi.fn(),
      update: vi.fn(),
      cancel: vi.fn(),
    },
    paymentMethods: {
      attach: vi.fn(),
    },
    billingPortal: {
      sessions: {
        create: vi
          .fn()
          .mockResolvedValue({ url: 'https://billing.stripe.com/...' }),
      },
    },
  },
}))

describe('SubscriptionService', () => {
  describe('createSubscription', () => {
    it('should create a subscription for a user')
    it('should attach payment method if provided')
    it('should return client secret for payment confirmation')
    it('should throw error if plan not found')
    it('should throw error if user not found')
  })

  describe('getSubscription', () => {
    it('should return active subscription')
    it('should return null if no subscription')
    it('should include plan and items')
  })

  describe('updateSubscription', () => {
    it('should update subscription plan')
    it('should handle proration')
    it('should throw if no active subscription')
  })

  describe('cancelSubscription', () => {
    it('should cancel at period end by default')
    it('should cancel immediately if specified')
  })

  describe('resumeSubscription', () => {
    it('should resume canceled subscription')
    it('should throw if no subscription to resume')
  })

  describe('getBillingPortalUrl', () => {
    it('should return portal URL')
    it('should throw if no subscription')
  })
})
```

### 6.2 Webhook Tests

Create `packages/api/src/services/__tests__/webhook.service.test.ts`:

```typescript
import { describe, it, expect, vi } from 'vitest'
import { webhookService } from '../webhook.service'

describe('WebhookService', () => {
  describe('handleEvent', () => {
    it('should handle subscription.created event')
    it('should handle subscription.updated event')
    it('should handle subscription.deleted event')
    it('should handle invoice.paid event')
    it('should handle invoice.payment_failed event')
    it('should skip already processed events (idempotency)')
    it('should record failed events')
  })
})
```

---

## Success Criteria

| Metric             | Target                 | Status |
| ------------------ | ---------------------- | ------ |
| Schema migration   | Tables created         | [ ]    |
| Stripe integration | Connected (test mode)  | [ ]    |
| Subscription CRUD  | All endpoints working  | [ ]    |
| Webhook handling   | Events processed       | [ ]    |
| Seed data          | Plans & modules seeded | [ ]    |
| Test coverage      | 80%+                   | [ ]    |
| Build passes       | No errors              | [ ]    |

---

## Session Completion Report

Upon completion, provide:

```markdown
## Session 01 Complete

### Deliverables

- Database tables: [count] new tables
- API endpoints: [count] new endpoints
- Services: SubscriptionService, WebhookService
- Test coverage: [percentage]

### Stripe Integration

- Customer creation: [Working/Not working]
- Subscription management: [Working/Not working]
- Webhook handling: [Working/Not working]

### Files Created

[List of files]

### Next Session

Ready for Session 02: Module Management & Usage Tracking
```

---

_Session 01 - Epic 02 Sprint 02_
_Orchestrator: Claude Web (Opus) | Executor: Claude Code CLI (Sonnet)_
