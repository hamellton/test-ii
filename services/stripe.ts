import Stripe from "stripe";
import { StripeTicketData, Attendee, StripeSeriesTicketData } from "@utils/types";
import { getUserById, updateUser } from "@models/user";
import { getSalonById } from "@models/salon";
import { Salon } from "@prisma/client";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

async function findOrCreateCoupon(accountId: string, amountOff: number) {
  try {
    const coupons = await stripe.coupons.list({
      limit: 100,
    }, {
      stripeAccount: accountId,
    });

    const existingCoupon = coupons.data.find(coupon => coupon.amount_off === amountOff && coupon.duration === "once");

    if (existingCoupon) {
      return existingCoupon.id;
    }

    const newCoupon = await stripe.coupons.create({
      amount_off: amountOff,
      currency: "usd",
      duration: "once",
    }, {
      stripeAccount: accountId,
    });

    return newCoupon.id;
  } catch (error) {
    console.error("Error finding or creating coupon:", error);
    throw error;
  }
}

export async function findProductAndPrice(
  salonTitle: string,
  accountId: string
): Promise<{ product: Stripe.Product; price: Stripe.Price }> {
  try {
    const products = await stripe.products.list({
      active: true,
      limit: 100,
    }, {
      stripeAccount: accountId,
    });

    const product = products.data.find(p => p.name === salonTitle);

    if (product) {
      const prices = await stripe.prices.list({
        product: product.id,
        active: true,
        limit: 100,
      }, {
        stripeAccount: accountId,
      });

      const price = prices.data.find(p => p.currency === "usd");

      if (price) {
        return { product, price };
      } else {
        throw new Error(`Price for product "${product.name}" not found.`);
      }
    } else {
      throw new Error(`Product with name "${salonTitle}" not found.`);
    }
  } catch (error) {
    console.error("Error finding product and price:", error);
    throw error;
  }
}

export const getStripePaymentFromSessionId = async (sessionId: string, accountId?: string): Promise<Stripe.PaymentIntent | null> => {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["payment_intent"],
    }, 
    accountId ? { stripeAccount: accountId } : undefined
    );
    
    const paymentIntent = session.payment_intent as Stripe.PaymentIntent | undefined;
    if (!paymentIntent) {
      console.log("No payment intent found for session", sessionId);
      return null;
    }
    return paymentIntent;
  } catch (error) {
    if (error instanceof Stripe.errors.StripeError && error.code === "resource_missing") {
      console.log("Session or PaymentIntent not found", sessionId);
      return null;
    }
    throw error;
  }
};


// Function to create a product and price in the connected account
export async function createProductAndPriceInConnectedAccount(
  productName: string,
  unitAmount: number,
  connectedAccountId: string
) {
  try {
    // Create a product in the connected account
    const product = await stripe.products.create(
      {
        name: productName,
      },
      {
        stripeAccount: connectedAccountId, // Specify the connected account
      }
    );

    // Create a price for the product in the connected account
    const price = await stripe.prices.create(
      {
        unit_amount: unitAmount,
        currency: "usd",
        product: product.id,
      },
      {
        stripeAccount: connectedAccountId, // Specify the connected account
      }
    );

    return { product, price };
  } catch (error) {
    console.error("Error creating product and price:", error);
    throw error;
  }
}

export async function createSeriesCheckoutSession(
  attendees: Attendee[],
  selectedEpisodes: string[],
  stripeConnectedAccountId: string | null,
  bookingFee: number,
  slug: string,
  seriesTitle: string,
) {
  const accountId = stripeConnectedAccountId || "";

  try {
    const episodeData: (Salon | null)[] = await Promise.all(
      selectedEpisodes.map(async (id) => {
        const salon: Salon | null = await getSalonById(id);
        return salon;
      })
    );

    const validEpisodes: Salon[] = episodeData.filter((salon): salon is Salon => salon !== null);

    const episodePrices = await Promise.all(
      validEpisodes.map(async (salon) => {
        const { price: seriesPrice } = await findProductAndPrice(salon.title, accountId);

        if (!seriesPrice || seriesPrice.unit_amount === null) {
          throw new Error(`Price not found or is null for salon: ${salon.title}`);
        }

        return {
          priceId: seriesPrice.id,
          unitAmount: seriesPrice.unit_amount,
          episodeId: salon.id,
          slug: salon.slug,
        };
      })
    );

    const episodeLineItems = episodePrices.map(({ priceId }) => ({
      price: priceId,
      quantity: attendees.length,
    }));

    const totalTicketAmount = episodePrices.reduce((acc, { unitAmount }) => acc + unitAmount * attendees.length, 0);
    const discountAmount = validEpisodes.length > 2 ? Math.round(totalTicketAmount * 0.20) : 0;

    const totalWithDiscount = totalTicketAmount - discountAmount;

    const platformFeePerTicket = Math.round(totalWithDiscount * 0.15);
    const platformFeeTotal = platformFeePerTicket;

    const bookingFeeLineItem = {
      price_data: {
        currency: "usd",
        product_data: {
          name: "Booking Fee",
        },
        unit_amount: bookingFee,
      },
      quantity: 1,
    };

    const lineItems = [...episodeLineItems, bookingFeeLineItem];

    let couponId: string | undefined;
    if (discountAmount > 0) {
      couponId = await findOrCreateCoupon(accountId, discountAmount);
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.NEXTAUTH_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}&accountId=${accountId}&seriesPurchase=true&selectedEpisodes=${encodeURIComponent(JSON.stringify(episodePrices.map(({ episodeId, priceId, slug }) => ({ episodeId, seriesPriceId: priceId, slug }))))}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/series/${slug}`,
      metadata: {
        seriesTicketInfo: JSON.stringify({
          attendees: attendees,
          selectedEpisodes: selectedEpisodes,
          customerEmail: attendees[0].email,
          accountId: accountId,
        } as StripeSeriesTicketData),
      },
      payment_intent_data: {
        capture_method: "manual",
        application_fee_amount: platformFeeTotal + bookingFee,
        description: `${seriesTitle}`,
      },
      discounts: couponId ? [{ coupon: couponId }] : undefined,
    }, {
      stripeAccount: accountId,
    });

    return session;
  } catch (error) {
    console.error("Error creating series checkout session:", error);
    throw error;
  }
}

export async function createTicketCheckoutSession(
  attendees: Attendee[],
  salonId: string,
  slug: string,
  salonTitle: string,
  stripeConnectedAccountId: string | null,
) {
  const accountId = stripeConnectedAccountId || "";

  try {
    const { price: salonPrice } = await findProductAndPrice(salonTitle, accountId);

    if (!salonPrice) {
      throw new Error("Price not found");
    }

    const salonPriceAmount = salonPrice.unit_amount!;
    const bookingFeePerTicket = attendees.length >= 3 ? 300 : 150;
    const bookingFeeTotal = attendees.length >= 3 ? 300 : (150 * attendees.length);
    const platformFeePerTicket = Math.round(salonPriceAmount * 0.15);
    const platformFeeTotal = platformFeePerTicket * attendees.length;

    return await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      payment_intent_data: {
        capture_method: "manual",
        application_fee_amount: platformFeeTotal + bookingFeeTotal,
        description: `${salonTitle}`,
      },
      line_items: [
        {
          price: salonPrice.id,
          quantity: attendees.length,
        },
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Booking Fee",
            },
            unit_amount: bookingFeePerTicket,
          },
          quantity: 1,
        },
      ],
      customer_email: attendees[0].email,
      mode: "payment",
      success_url: `${process.env.NEXTAUTH_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}&salonId=${salonId}&salonSlug=${slug}&accountId=${accountId}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/payment/cancel?salonId=${salonId}&salonSlug=${slug}`,
      metadata: {
        ticketInfo: JSON.stringify({
          attendees: attendees,
          priceId: salonPrice.id,
          salonId: salonId,
          customerEmail: attendees[0].email,
          accountId: accountId,
        } as StripeTicketData),
      },
    }, {
      stripeAccount: accountId
    });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    throw error;
  }
}

export async function createTipCheckoutSession(url: string, hostId: string, priceId: string, connectedAccountId: string) {
  console.log("Creating: ", url, hostId, priceId, connectedAccountId);
  
  return stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [{
      price: priceId,
      quantity: 1,
    }],
    mode: "payment",
    success_url: `${process.env.NEXTAUTH_URL}/${url}`,
    cancel_url: `${process.env.NEXTAUTH_URL}/payment/cancel`,
    metadata: {
      hostId: hostId,
      connectedAccountId: connectedAccountId,
    },
  }, {
    stripeAccount: connectedAccountId,
  });
}


export const findTipProductAndPrice = async (connectedAccountId: string, amount: number) => {
  const products = await stripe.products.list({
    active: true,
    limit: 100,
  }, { stripeAccount: connectedAccountId });

  const tipProduct = products.data.find(product => product.name === "tip");

  if (tipProduct) {
    const prices = await stripe.prices.list({
      product: tipProduct.id,
      active: true,
    }, { stripeAccount: connectedAccountId });

    const tipPrice = prices.data.find(price => price.unit_amount === amount * 100);
    
    if (tipPrice) {
      return tipPrice.id;
    }
  }

  const newProduct = tipProduct || await stripe.products.create({
    name: "tip",
  }, { stripeAccount: connectedAccountId });

  const newPrice = await stripe.prices.create({
    product: newProduct.id,
    unit_amount: amount * 100,
    currency: "usd",
  }, { stripeAccount: connectedAccountId });

  return newPrice.id;
};

export async function findOrCreatePrice(productId: string, unitAmount: number) {
  try {
    // List all prices for the product
    const prices = await stripe.prices.list({ product: productId });

    // Check if any price matches the desired amount
    const existingPrice = prices.data.find(price => price.unit_amount === unitAmount);

    if (existingPrice) {
      return existingPrice;
    } else { // No matching price, create a new one
      const newPrice = await stripe.prices.create({
        unit_amount: unitAmount,
        currency: "usd",
        product: productId,
      });

      return newPrice;
    }
  } catch (error: unknown) {
    console.error("Error in findOrCreatePrice:", error);
    throw error;
  }
}

type AccountCapabilities = {
  card_payments: string;
  transfers: string;
};

type AccountStatus = {
  id: string;
  charges_enabled: boolean;
  payouts_enabled: boolean;
  capabilities: AccountCapabilities | null;
  requirements: Stripe.Account.Requirements;
  details_submitted: boolean;
  email: string | null;
};

export const getAccountStatus = async (accountId: string): Promise<AccountStatus> => {
  try {
    const account = await stripe.accounts.retrieve(accountId);

    const accountStatus: AccountStatus = {
      id: account.id,
      charges_enabled: account.charges_enabled,
      payouts_enabled: account.payouts_enabled,
      capabilities: account.capabilities ? {
        card_payments: account.capabilities.card_payments as string,
        transfers: account.capabilities.transfers as string,
      } : null,
      requirements: account.requirements || {
        currently_due: [],
        eventually_due: [],
        past_due: [],
        pending_verification: [],
        errors: [],
        disabled_reason: null,
        alternatives: [],
        current_deadline: null,
      },
      details_submitted: account.details_submitted || false,
      email: account.email || null,
    };

    return accountStatus;
  } catch (error) {
    console.error("Error retrieving account status:", error);
    throw error;
  }
};

const checkStripeAccountStatus = async (accountId: string) => {
  try {
    const accountStatus = await getAccountStatus(accountId);

    console.log("Account Status:", accountStatus);

    if (accountStatus.capabilities) {
      console.log("Card Payments Capability:", accountStatus.capabilities.card_payments);
      console.log("Transfers Capability:", accountStatus.capabilities.transfers);
    } else {
      console.log("Capabilities are not available.");
    }

    if (accountStatus.payouts_enabled) {
      console.log("Payments are enabled.");
    } else {
      console.log("Payments are not enabled. Further setup may be required.");
    }

    if (!accountStatus.details_submitted) {
      console.log("Account details are not submitted. Prompt the user to complete the setup.");
    }
  } catch (error) {
    console.error("Failed to check account status:", error);
  }
};

type RedirectUrl = string;

// Generate a link for Stripe connection
export const createStripeAccountLink = async (accountId: string, redirectUrl: RedirectUrl): Promise<string> => {
  try {
    const accountLink: Stripe.AccountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${redirectUrl}/dashboard/payouts`,
      return_url: `${redirectUrl}/dashboard/payouts`,
      type: "account_onboarding",
    });

    return accountLink.url;
  } catch (error) {
    console.error("Error creating Stripe account link:", error);
    throw error;
  }
};

const createLoginLink = async (accountId: string): Promise<string | null> => {
  try {
    const account = await stripe.accounts.retrieve(accountId);
    if (account.charges_enabled && account.payouts_enabled) {
      const loginLink = await stripe.accounts.createLoginLink(accountId);
      return loginLink.url;
    } else {
      console.log("Account onboarding is not complete.");
      return null;
    }
  } catch (error) {
    console.error("Error creating login link:", error);
    return null;
  }
};

export const findOrCreateConnectedAccount = async (
  email: string,
  userId: string,
  redirectUrl: RedirectUrl
): Promise<{ account: Stripe.Account; connectLink: string, status: any, loginLink: string | null; }> => {
  const user: any = await getUserById(userId);

  if (user?.stripeConnectedAccountId) {
    console.log("Stripe account already exists:", user.stripeConnectedAccountId);
    const existingAccount: Stripe.Account = await stripe.accounts.retrieve(user.stripeConnectedAccountId);

    // Check if the account status is valid
    if (existingAccount) {
      const existingAccountStatus = await getAccountStatus(user.stripeConnectedAccountId);
      const loginLink = await createLoginLink(existingAccount.id);
      const connectLink = await createStripeAccountLink(existingAccount.id, redirectUrl);
      return { account: existingAccount, connectLink, status: existingAccountStatus, loginLink };
    } else {
      console.warn("Existing account not found:", user.stripeConnectedAccountId);
    }
  }

  // Create a new Stripe account if no existing account found
  try {
    const newAccount: Stripe.Account = await stripe.accounts.create({
      type: "express",
      email,
      business_type: "individual",
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
    });

    // Update the user with the new Stripe account ID
    await updateUser(userId, { stripeConnectedAccountId: newAccount.id });

    // Generate and return the Stripe connect link
    const connectLink: string = await createStripeAccountLink(newAccount.id, redirectUrl);
    console.log("Generated Stripe connect link:", connectLink);

    // Get the account status
    const newAccountStatus = await getAccountStatus(newAccount.id);
    const loginLink = await createLoginLink(newAccount.id);

    return { account: newAccount, connectLink, status: newAccountStatus, loginLink };
  } catch (error) {
    console.error("Error creating Stripe account:", error);
    throw error;
  }
};


// Function to get the product and price IDs from the connected account
export async function getProductAndPriceIdsFromConnectedAccount(
  connectedAccountId: string,
  productName: string
): Promise<{ productId: string; priceId: string }> {
  try {
    // List all products in the connected account
    const products = await stripe.products.list(
      { limit: 100 },
      { stripeAccount: connectedAccountId }
    );

    // Find the product by name
    const product = products.data.find(p => p.name === productName);

    if (!product) {
      throw new Error(`Product not found for name: ${productName}`);
    }

    // List all prices for the product in the connected account
    const prices = await stripe.prices.list(
      { product: product.id },
      { stripeAccount: connectedAccountId }
    );

    // Find the price (assuming there’s at least one)
    const price = prices.data[0]; // Adjust as needed if you have multiple prices

    if (!price) {
      throw new Error(`Price not found for product: ${product.id}`);
    }

    return { productId: product.id, priceId: price.id };
  } catch (error) {
    console.error("Error retrieving product and price IDs:", error);
    throw error;
  }
}

export const getPaymentsForConnectedAccount = async (connectedAccountId: string) => {
  try {
    const payments = await stripe.charges.list(
      {
        limit: 20,
      },
      {
        stripeAccount: connectedAccountId,
      }
    );

    return payments.data;
  } catch (error) {
    console.error("Error during getting payments:", error);
  }
};

export async function getTotalAmountsOfTransactions(accountId: string): Promise<{
  totalTicketSales: number;
  totalTips: number;
  totalPayout: number;
}> {
  let totalTicketSales = 0;
  let totalTips = 0;
  let startingAfter: string | undefined = undefined;
  const limit = 100;
  
  const fetchTransactions = async () => {
    const params: { limit: number; starting_after?: string } = {
      limit,
      ...(startingAfter ? { starting_after: startingAfter } : {}),
    };
    return stripe.charges.list(params, {
      stripeAccount: accountId,
    });
  };

  do {
    const transactions = await fetchTransactions();

    transactions.data.forEach(transaction => {
      const description = transaction.description || "Tip";
      if (description === "Tip") {
        totalTips += transaction.amount;
      } else {
        totalTicketSales += transaction.amount;
      }
    });

    startingAfter = transactions.data.length > 0 ? transactions.data[transactions.data.length - 1].id : undefined;
  } while (startingAfter);

  const totalPayout = totalTicketSales + totalTips;

  return {
    totalTicketSales: totalTicketSales / 100, // Convert from cents to dollars
    totalTips: totalTips / 100,
    totalPayout: totalPayout / 100,
  };
}

export async function getStripeTransactions(
  accountId: string,
  startingAfter?: string,
  limit: number = 10
) {
  try {
    const params: { limit: number; starting_after?: string } = {
      limit,
      ...(startingAfter ? { starting_after: startingAfter } : {}),
    };

    const transactions = await stripe.charges.list(params, {
      stripeAccount: accountId,
    });

    const totalsPromise = getTotalAmountsOfTransactions(accountId);
    const totals = await totalsPromise;

    return {
      transactions: transactions.data,
      hasMore: transactions.has_more,
      nextStartingAfter: transactions.data.length > 0 ? transactions.data[transactions.data.length - 1].id : undefined,
      ...totals,
    };
  } catch (error) {
    console.error("Error fetching transactions from Stripe:", error);
    throw error;
  }
}