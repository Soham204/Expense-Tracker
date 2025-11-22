public class ExpenseTriggerHandler {
    
    //Before Insert Handler
    public static void onBeforeInsert(List<Expense__c> allRecords){
        for (Expense__c e : allRecords){
            if(e.Amount__c < 5) e.addError('Amount is very low');
            if(e.Date__c == null) e.Date__c = System.now();
        }
    }
}