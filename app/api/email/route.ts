import * as sgMail from '@sendgrid/mail';

if (process.env.SENDGRID_API_KEY) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

export async function POST(request: Request) {
    try {
        const { to, subject, message } = await request.json();

        const msg = {
            to,
            from: 'appreciateyanz@gmail.com',
            subject,
            text: message,
            html: `<div>${message}</div>`,
        };

        await sgMail.send(msg);

        return new Response(JSON.stringify({ message: 'Email sent successfully' }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error: unknown) {
        console.error('Error sending email:', error);

        if (error instanceof Error && 'response' in error) {
            console.error(error.response);
        }

        return new Response(JSON.stringify({ error: 'Error sending email' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}
