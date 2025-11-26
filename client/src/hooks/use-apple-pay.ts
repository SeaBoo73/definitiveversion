import { useEffect, useState, useCallback } from 'react';

interface ApplePayHook {
  isApplePayAvailable: boolean;
  isGooglePayAvailable: boolean;
  isLoading: boolean;
  presentApplePay: (amount: number, currency: string, clientSecret: string) => Promise<boolean>;
  presentGooglePay: (amount: number, currency: string, clientSecret: string) => Promise<boolean>;
}

export function useApplePay(): ApplePayHook {
  const [isApplePayAvailable, setIsApplePayAvailable] = useState(false);
  const [isGooglePayAvailable, setIsGooglePayAvailable] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [stripePlugin, setStripePlugin] = useState<any>(null);

  useEffect(() => {
    const checkPaymentMethods = async () => {
      try {
        const { Stripe } = await import('@capacitor-community/stripe');
        
        await Stripe.initialize({
          publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_51RmJeyRemNUXGzu7lcts67FtOOZFuYrqUSvhjCQTNrZyEgAB1051AqnVSzM0jXsDcMeWGThb3JNdMXGFAzj06GbU004axe6Kek',
        });

        try {
          await Stripe.isApplePayAvailable();
          setIsApplePayAvailable(true);
        } catch {
          setIsApplePayAvailable(false);
        }

        try {
          await Stripe.isGooglePayAvailable();
          setIsGooglePayAvailable(true);
        } catch {
          setIsGooglePayAvailable(false);
        }

        setStripePlugin(Stripe);
      } catch (error) {
        console.log('Native payment methods not available:', error);
        setIsApplePayAvailable(false);
        setIsGooglePayAvailable(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkPaymentMethods();
  }, []);

  const presentApplePay = useCallback(async (
    amount: number,
    currency: string,
    clientSecret: string
  ): Promise<boolean> => {
    if (!stripePlugin || !isApplePayAvailable) {
      return false;
    }

    try {
      await stripePlugin.createApplePay({
        paymentIntentClientSecret: clientSecret,
        paymentSummaryItems: [{
          label: 'SeaBoo - Noleggio Barca',
          amount: amount,
        }],
        merchantIdentifier: 'merchant.it.seaboo',
        countryCode: 'IT',
        currency: currency.toUpperCase(),
      });

      const result = await stripePlugin.presentApplePay();
      
      if (result.paymentResult === 'completed') {
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Apple Pay error:', error);
      return false;
    }
  }, [stripePlugin, isApplePayAvailable]);

  const presentGooglePay = useCallback(async (
    amount: number,
    currency: string,
    clientSecret: string
  ): Promise<boolean> => {
    if (!stripePlugin || !isGooglePayAvailable) {
      return false;
    }

    try {
      await stripePlugin.createGooglePay({
        paymentIntentClientSecret: clientSecret,
        paymentSummaryItems: [{
          label: 'SeaBoo - Noleggio Barca',
          amount: amount,
        }],
        merchantIdentifier: 'merchant.it.seaboo',
        countryCode: 'IT',
        currency: currency.toUpperCase(),
      });

      const result = await stripePlugin.presentGooglePay();
      
      if (result.paymentResult === 'completed') {
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Google Pay error:', error);
      return false;
    }
  }, [stripePlugin, isGooglePayAvailable]);

  return {
    isApplePayAvailable,
    isGooglePayAvailable,
    isLoading,
    presentApplePay,
    presentGooglePay,
  };
}
