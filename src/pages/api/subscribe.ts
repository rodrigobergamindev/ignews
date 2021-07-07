import { getSession } from "next-auth/client";
import { NextApiRequest, NextApiResponse } from "next-auth/internals/utils";
import { stripe } from "../../services/stripe";

export default async (req: NextApiRequest, response: NextApiResponse) => {
    if(req.method === 'POST') {

        const session = await getSession({req})

        const stripeCustomer = await stripe.customers.create({
            email: session.user.email,
            //metadata
        })



        const stripeCheckoutSession = await stripe.checkout.sessions.create({
            customer : stripeCustomer.id,
            payment_method_types: ['card'],
            billing_address_collection: 'required',
            line_items: [
                {price: 'price_1JADnZD123067NVCSIR3TAtg', quantity: 1}
            ],
            mode: 'subscription',
            allow_promotion_codes: true,
            success_url: process.env.STRIPE_SUCESS_URL,
            cancel_url: process.env.STRIPE_CANCEL_URL
        })

        return response.status(200).json({sessionId: stripeCheckoutSession.id})

    }else {
        response.setHeader('Allow', 'POST')
        response.status(405).end('Method not allowed')
    }
}