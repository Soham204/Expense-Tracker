trigger OpportunityTrigger on Opportunity (after update) {
	
    
    
    
    Set<Id> AccIds = new Set<Id>();
    
    for(Opportunity o : Trigger.new){
        AccIds.add(o.AccountId);
    }
    
    Map<Id,Decimal> AccMap = new Map<Id,Decimal>();
    
    for(AggregateResult ar:[
        SELECT AccountId,SUM(Amount) total FROM Opportunity WHERE AccountId IN :AccIds Group by AccountId 
    ]){
        AccMap.put((Id) ar.get('AccountId'),(Decimal) ar.get('total'));
    }
    List<Account> acctoUpdate = new List<Account>();
    for(Id I: AccIds){
        Account acc = new Account(Id = I,AnnualRevenue = AccMap.get(I));
        acctoUpdate.add(acc);
        
    }
    
    update acctoUpdate;
     /*
    List<Quote> quotesToInsert = new List<Quote>();
    
    Map<Id, Opportunity> oppIdToNewOpp = new Map<Id, Opportunity>();
    Map<Id, Opportunity> oppIdToOldOpp = Trigger.oldMap;

    // Identify Opportunities that just became Closed Won
    for (Opportunity opp : Trigger.new) {
        Opportunity oldOpp = oppIdToOldOpp.get(opp.Id);

        if (opp.StageName == 'Closed Won' && oldOpp.StageName != 'Closed Won') {
            oppIdToNewOpp.put(opp.Id, opp);

            Quote newQuote = new Quote(
                Name = 'Quote for ' + opp.Name,
                OpportunityId = opp.Id,
                Status = 'Draft',
                ExpirationDate = opp.CloseDate != null ? opp.CloseDate.addDays(30) : Date.today().addDays(30),
                QuoteToName = opp.Name,
                BillingName = (opp.Account != null) ? opp.Account.Name : null,
                ShippingName = (opp.Account != null) ? opp.Account.Name : null
            );
            quotesToInsert.add(newQuote);
        }
    }

    Map<Id, Id> oppIdToQuoteId = new Map<Id, Id>();

    if (!quotesToInsert.isEmpty()) {
        insert quotesToInsert;
		List<QuoteDocument> qd = new List<QuoteDocument>();
        // Build map of OpportunityId -> QuoteId, add crete quote document
        for (Quote q : quotesToInsert) {
            QuoteDocument newquote = new QuoteDocument(QuoteId = q.Id);
            qd.add(newquote);
            oppIdToQuoteId.put(q.OpportunityId, q.Id);
        }
		
        syncOppProductsToQuotes(oppIdToQuoteId);
        if(!qd.isEmpty()){
            insert qd;
        }
    }

    // Bulkified method to sync OpportunityLineItems to QuoteLineItems
    public static void syncOppProductsToQuotes(Map<Id, Id> oppToQuoteMap) {
        // Fetch all OpportunityLineItems for relevant Opportunities
        List<OpportunityLineItem> oppLines = [
            SELECT OpportunityId, Quantity, UnitPrice, Product2Id, PricebookEntryId
            FROM OpportunityLineItem
            WHERE OpportunityId IN :oppToQuoteMap.keySet()
        ];

        List<QuoteLineItem> quoteLines = new List<QuoteLineItem>();

        for (OpportunityLineItem oli : oppLines) {
            Id quoteId = oppToQuoteMap.get(oli.OpportunityId);

            if (quoteId != null) {
                quoteLines.add(new QuoteLineItem(
                    QuoteId = quoteId,
                    Quantity = oli.Quantity,
                    UnitPrice = oli.UnitPrice,
                    Product2Id = oli.Product2Id,
                    PricebookEntryId = oli.PricebookEntryId
                ));
            }
        }

        if (!quoteLines.isEmpty()) {
            insert quoteLines;
        }
    }
*/
}