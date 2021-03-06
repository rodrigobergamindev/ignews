import { query } from "faunadb";
import { getSession } from "next-auth/client";
import { NextApiRequest, NextApiResponse } from "next-auth/internals/utils";
import { fauna } from "../../services/fauna";
import { stripe } from "../../services/stripe";

type User = {
    ref : {
        id: string;
    },
    data: {
        stripe_customer_id: string
    }
}

export default async (req: NextApiRequest, response: NextApiResponse) => {

    if(req.method === 'POST') {

        const session = await getSession({req})

        const user = await fauna.query<User>(
            query.Get(
                query.Match(
                    query.Index('user_by_email'),
                    query.Casefold(session.user.email)
                )
            )
        )

        let customerId = user.data.stripe_customer_id;

        if(!customerId) {

            const stripeCustomer = await stripe.customers.create({
                email: session.user.email,
                //metadata
            })
    
            await fauna.query(
                query.Update(
                    query.Ref(query.Collection('users'), user.ref.id),
                    {
                        data: {
                            stripe_customer_id: stripeCustomer.id
                        }
                    }
                )
            
            )
        
            customerId = stripeCustomer.id
        }
      



        const stripeCheckoutSession = await stripe.checkout.sessions.create({
            customer : customerId,
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