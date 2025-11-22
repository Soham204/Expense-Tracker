public class OpportunityQuoteSyncQueueable implements Queueable {
    private Map<Id, Id> oppToQuoteMap;

    public OpportunityQuoteSyncQueueable(Map<Id, Id> oppToQuoteMap) {
        this.oppToQuoteMap = oppToQuoteMap;
    }

    public void execute(QueueableContext context) {
        List<Opportunity> oppToUpdate = new List<Opportunity>();

        for (Id oppId : oppToQuoteMap.keySet()) {
            oppToUpdate.add(new Opportunity(
                Id = oppId,
                SyncedQuoteId = oppToQuoteMap.get(oppId)
            ));
        }
		for (Id oppId : oppToQuoteMap.keySet()) {
            Id quoteId = oppToQuoteMap.get(oppId);
            OpportunityToQuoteProductSync.syncOppProductsToQuote(oppId, quoteId);
        }
        if (!oppToUpdate.isEmpty()) {
            update oppToUpdate;
        }

        // Sync Opp Products → Quote Line Items
        
    }
}