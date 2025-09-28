# TODO for Task: Display invoices on invoice generation page without customer information

## Information Gathered:
- The invoice generation page previously had a list of invoices including customer names, but it was hidden to comply with hiding customer info.
- To allow viewing invoices without revealing customer details, modify the display to show only amount, description, and paid status.
- Similarly, for payments page, display payments without customer names.

## Plan:
- [ ] Edit script.js: Update updateInvoiceList to display `<li>$${invoice.amount} - ${invoice.description} (Paid: $${invoice.paid})</li>` without customer name.
- [ ] Edit script.js: Update updatePaymentList to display `<li>$${payment.amount} on ${payment.date}</li>` without customer name.

## Dependent Files to be edited:
- script.js (modify the two functions).

## Followup steps:
- [ ] Test: Generate an invoice, navigate to invoices section, confirm list shows without customer names; check payments similarly.

<ask_followup_question>
<question>Proceed with updating the invoice and payment lists to display details without customer names? This will show invoices/payments but hide customer info.</question>
</ask_followup_question>
