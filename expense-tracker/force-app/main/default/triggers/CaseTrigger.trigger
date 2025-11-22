trigger CaseTrigger on Case (before update) {
    for (Case c : Trigger.new){
        Case cc = Trigger.OldMap.get(c.Id);
        if(c.status != cc.Status){
            System.debug(System.now().addDays(-10));
            c.addError('Status cannot be changed');
        }
    }
}