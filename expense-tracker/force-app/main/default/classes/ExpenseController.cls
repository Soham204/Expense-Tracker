public with sharing class ExpenseController {
    
    @AuraEnabled(cacheable=true)
    public static Map<String,List<Expense__c>> getExpenses(Integer index, Date fromDate, Date toDate) {
        // Query the Expense__c records
        Map<String,List<Expense__c>> expMap = new Map<String,List<Expense__c>>();
        List<Expense__c> allRecords= [
            SELECT Id, Payment_Method__c , Amount__c, Date__c, Category__c,Description__c
            FROM Expense__c
            WHERE DAY_ONLY(Date__c ) >= :fromDate
     		AND DAY_ONLY(Date__c ) <= :toDate
            ORDER BY Date__c DESC
            LIMIT :index
        ];
        
        for(Expense__c e : allRecords){
            
            String dt = e.Date__c.date().format();
            if (!expMap.containsKey(dt)) {
                expMap.put(dt, new List<Expense__c>());
            }
            expMap.get(dt).add(e);
        }
        return expMap;
    }
}