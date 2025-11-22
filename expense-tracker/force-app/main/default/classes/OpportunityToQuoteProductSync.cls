public class OpportunityToQuoteProductSync {
    public static void syncOppProductsToQuote(Id oppId, Id quoteId) {
        List<OpportunityLineItem> oppLines = [
            SELECT Quantity, UnitPrice, Product2Id, PricebookEntryId
            FROM OpportunityLineItem
            WHERE OpportunityId = :oppId
        ];

        List<QuoteLineItem> quoteLines = new List<QuoteLineItem>();
        for (OpportunityLineItem oli : oppLines) {
            quoteLines.add(new QuoteLineItem(
                QuoteId = quoteId,
                Quantity = oli.Quantity,
                UnitPrice = oli.UnitPrice,
                Product2Id = oli.Product2Id,
                PricebookEntryId = oli.PricebookEntryId
            ));
        }

        if (!quoteLines.isEmpty()) {
            insert quoteLines;
        }
    }
}