import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface Invoice {
  id: string;
  client_name: string;
  client_email: string;
  client_company?: string;
  invoice_number: string;
  total_amount: number;
  status: string;
  due_date?: string;
  notes?: string;
  created_at: string;
  publications: Array<{
    name: string;
    price: number;
    quantity: number;
    customPrice?: number;
  }>;
}

const generateInvoiceHTML = (invoice: Invoice) => {
  const publicationsHTML = invoice.publications.map(pub => {
    const price = pub.customPrice || pub.price;
    const lineTotal = price * pub.quantity;
    return `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${pub.name}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">${pub.quantity}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">$${price.toFixed(2)}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">$${lineTotal.toFixed(2)}</td>
      </tr>
    `;
  }).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Invoice ${invoice.invoice_number}</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0;">
        <h1 style="margin: 0; font-size: 2.5em;">INVOICE</h1>
        <p style="margin: 10px 0 0 0; font-size: 1.2em;">${invoice.invoice_number}</p>
      </div>
      
      <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 30px;">
          <div>
            <h3 style="margin: 0 0 10px 0; color: #667eea;">Bill To:</h3>
            <p style="margin: 5px 0;"><strong>${invoice.client_name}</strong></p>
            ${invoice.client_company ? `<p style="margin: 5px 0;">${invoice.client_company}</p>` : ''}
            <p style="margin: 5px 0;">${invoice.client_email}</p>
          </div>
          <div style="text-align: right;">
            <p style="margin: 5px 0;"><strong>Date:</strong> ${new Date(invoice.created_at).toLocaleDateString()}</p>
            ${invoice.due_date ? `<p style="margin: 5px 0;"><strong>Due Date:</strong> ${new Date(invoice.due_date).toLocaleDateString()}</p>` : ''}
          </div>
        </div>

        <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <thead>
            <tr style="background: #667eea; color: white;">
              <th style="padding: 15px; text-align: left;">Service</th>
              <th style="padding: 15px; text-align: center;">Qty</th>
              <th style="padding: 15px; text-align: right;">Price</th>
              <th style="padding: 15px; text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${publicationsHTML}
          </tbody>
          <tfoot>
            <tr style="background: #f8f9fa;">
              <td colspan="3" style="padding: 20px; text-align: right; font-size: 1.2em; font-weight: bold;">
                <strong>Total Amount:</strong>
              </td>
              <td style="padding: 20px; text-align: right; font-size: 1.5em; font-weight: bold; color: #667eea;">
                <strong>$${invoice.total_amount.toFixed(2)}</strong>
              </td>
            </tr>
          </tfoot>
        </table>

        ${invoice.notes ? `
          <div style="margin-top: 30px; padding: 20px; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h4 style="margin: 0 0 10px 0; color: #667eea;">Notes:</h4>
            <p style="margin: 0; white-space: pre-wrap;">${invoice.notes}</p>
          </div>
        ` : ''}

        <div style="margin-top: 30px; padding: 20px; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h4 style="margin: 0 0 15px 0; color: #667eea;">Payment Information</h4>
          <p style="margin: 5px 0;">Please contact us for payment instructions and methods.</p>
          <p style="margin: 5px 0;">If you have any questions about this invoice, please contact our billing department.</p>
        </div>

        <div style="margin-top: 30px; text-align: center; color: #6b7280;">
          <p style="margin: 0;">Thank you for your business!</p>
          <p style="margin: 0; font-size: 0.9em;">Just Featured - Premium Publication Services</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { invoice, clientEmail } = await req.json();

    if (!invoice || !clientEmail) {
      return new Response(
        JSON.stringify({ error: "Invoice data and client email are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Sending invoice ${invoice.invoice_number} to ${clientEmail}`);

    const htmlContent = generateInvoiceHTML(invoice);

    const emailResponse = await resend.emails.send({
      from: "Just Featured <billing@yourdomain.com>", // Update with your domain
      to: [clientEmail],
      subject: `Invoice ${invoice.invoice_number} - Just Featured`,
      html: htmlContent,
    });

    console.log("Invoice email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Invoice sent successfully",
      emailId: emailResponse.data?.id 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error("Error in send-invoice function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);