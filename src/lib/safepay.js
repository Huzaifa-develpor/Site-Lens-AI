import { Safepay } from '@sfpy/node-sdk';

export const safepay = new Safepay({
  environment: process.env.SAFEPAY_ENV || 'sandbox',
  apiKey: process.env.SAFEPAY_API_KEY,
  // v1Secret is the MERCHANT secret (Dashboard > Developer > API) —
  // this is NOT the same as the webhook shared secret. Using the wrong
  // one here is what caused the 401 on /passport/v1/token.
  v1Secret: process.env.SAFEPAY_V1_SECRET,
  webhookSecret: process.env.SAFEPAY_WEBHOOK_SECRET,
});

export async function verifySafepayWebhook(payload) {
  try {
    // 1. Subscription Checkout Session Creation Logic
    if (payload && payload.planId) {
      // NOTE: subscription checkouts use safepay.checkout.createSubscription(),
      // NOT safepay.checkout.create() — that method is only for one-time
      // payments and doesn't accept a `plan` param, which is why the old
      // code was silently failing.
      //
      // The sandbox hosted checkout page also needs an authorization token
      // embedded in the URL, or it throws "Missing authorization credentials"
      // when it makes its own internal calls. So we first mint a short-lived
      // auth token via safepay.authorization.create(), then pass it into
      // createSubscriptionWithToken().
      const authToken = await safepay.authorization.create();

      const result = await safepay.checkout.createSubscriptionWithToken({
        planId: payload.planId,
        reference: payload.reference,
        cancelUrl: payload.cancelUrl,
        redirectUrl: payload.redirectUrl,
        authToken,
      });

      // Once this is working correctly, this should resolve to a plain URL string.
      // Keeping defensive fallbacks in case the SDK wraps it in an object.
      if (typeof result === 'string') return result;
      if (result?.url) return result.url;
      if (result?.data?.url) return result.data.url;

      console.error('Unexpected createSubscriptionWithToken response shape:', result);
      return null;
    }

    // 2. Webhook Verification Logic
    const { rawBody, bodyObject, signature } = payload || {};
    if (signature) {
      if (bodyObject) return safepay.verify.webhook(bodyObject, signature);
      if (rawBody) return safepay.verify.webhook(JSON.parse(rawBody), signature);
    }

    return false;
  } catch (error) {
    console.error('Safepay Execution Error:', error);
    return null;
  }
}