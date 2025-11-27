import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";

const http = httpRouter();

// Stripe webhook endpoint
http.route({
  path: "/stripe-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error("STRIPE_WEBHOOK_SECRET not configured");
      return new Response("Webhook secret not configured", { status: 500 });
    }

    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      return new Response("No signature provided", { status: 400 });
    }

    try {
      // Import Stripe dynamically (node runtime)
      const Stripe = (await import("stripe")).default;
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
        apiVersion: "2025-11-17.clover",
      });

      // Verify webhook signature
      const event = stripe.webhooks.constructEvent(
        body,
        signature,
        webhookSecret
      );

      console.log(`Received Stripe event: ${event.type}`);

      // Handle different event types
      switch (event.type) {
        case "checkout.session.completed": {
          const session = event.data.object as any;

          // Get user by customer ID
          const userId = session.metadata?.userId;
          if (!userId) {
            console.error("No userId in session metadata");
            break;
          }

          // Get subscription details
          const subscriptionId = session.subscription as string;
          if (!subscriptionId) {
            console.error("No subscription ID in session");
            break;
          }

          const subscription = await stripe.subscriptions.retrieve(
            subscriptionId
          ) as any;

          // Determine tier from price ID
          const priceId = subscription.items.data[0].price.id;
          let tier: "starter" | "pro" | "team" = "starter";

          if (priceId.includes("starter")) {
            tier = "starter";
          } else if (priceId.includes("pro")) {
            tier = "pro";
          } else if (priceId.includes("team")) {
            tier = "team";
          }

          // Create subscription record
          await ctx.runMutation(internal.subscriptions.create, {
            userId: userId as any,
            stripeCustomerId: session.customer as string,
            stripeSubscriptionId: subscriptionId,
            stripePriceId: priceId,
            tier,
            status: "active",
            currentPeriodStart: subscription.current_period_start * 1000,
            currentPeriodEnd: subscription.current_period_end * 1000,
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
            trialEnd: subscription.trial_end
              ? subscription.trial_end * 1000
              : undefined,
          });

          break;
        }

        case "customer.subscription.updated": {
          const subscription = event.data.object as any;

          // Determine tier from price ID
          const priceId = subscription.items.data[0].price.id;
          let tier: "starter" | "pro" | "team" = "starter";

          if (priceId.includes("starter")) {
            tier = "starter";
          } else if (priceId.includes("pro")) {
            tier = "pro";
          } else if (priceId.includes("team")) {
            tier = "team";
          }

          // Update subscription
          await ctx.runMutation(internal.subscriptions.update, {
            stripeSubscriptionId: subscription.id,
            stripePriceId: priceId,
            tier,
            status: subscription.status as any,
            currentPeriodStart: subscription.current_period_start * 1000,
            currentPeriodEnd: subscription.current_period_end * 1000,
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
            trialEnd: subscription.trial_end
              ? subscription.trial_end * 1000
              : undefined,
          });

          break;
        }

        case "customer.subscription.deleted": {
          const subscription = event.data.object as any;

          // Mark subscription as canceled
          await ctx.runMutation(internal.subscriptions.update, {
            stripeSubscriptionId: subscription.id,
            status: "canceled",
          });

          break;
        }

        case "invoice.payment_succeeded": {
          const invoice = event.data.object as any;
          console.log(`Payment succeeded for invoice: ${invoice.id}`);
          // Optional: Log payment records
          break;
        }

        case "invoice.payment_failed": {
          const invoice = event.data.object as any;
          console.log(`Payment failed for invoice: ${invoice.id}`);

          // Update subscription status
          if (invoice.subscription) {
            await ctx.runMutation(internal.subscriptions.update, {
              stripeSubscriptionId: invoice.subscription as string,
              status: "past_due",
            });
          }

          break;
        }

        default:
          console.log(`Unhandled event type: ${event.type}`);
      }

      return new Response(JSON.stringify({ received: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error: any) {
      console.error("Webhook error:", error.message);
      return new Response(`Webhook error: ${error.message}`, {
        status: 400,
      });
    }
  }),
});

export default http;
