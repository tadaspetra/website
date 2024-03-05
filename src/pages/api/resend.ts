import type { APIRoute } from "astro";
import { Resend } from "resend";

export const POST: APIRoute = async ({ url, cookies, redirect }) => {
    const baseUrl = url.origin
    const email = url.searchParams.get("email")
    const resend = new Resend(import.meta.env.RESEND_API_KEY);

    if (!email) {
        return new Response("Email is required", { status: 400 })
    }
    await resend.contacts.create({
        email: email,
        unsubscribed: false,
        audienceId: import.meta.env.RESEND_AUDIENCE_ID_TADAS,
    });



    return new Response(
        JSON.stringify({
            message: "SUCCESS",
            status: 200,
            url: url,
        })
    )
}
