trigger AccountTrigger on Account (before update) {
    if(Trigger.isUpdate){
        set<Id> AccIds = Trigger.newMap.keySet();

        Map<Id,Integer> AccMap = new Map<Id,Integer>();
        for(AggregateResult ar :[
            Select AccountId,COUNT(Id) Total
            FROM Contact
            WHERE AccountId IN :AccIds
            GROUP By AccountId
        ]){
            AccMap.put((Id) ar.get('AccountId'),(Integer) ar.get('Total'));
        }
        
        List<Account> AcctoUpdate = new List<Account>();
        
        for (Account acc : Trigger.new){            
            acc.NumberOfEmployees = Accmap.get(acc.Id);
        }
    }
}