trigger LeadStatusTrigger on Lead (after update) {
    List<Task> tasksToInsert = new List<Task>();

    for (Lead ld : Trigger.new) {
        Lead oldLead = Trigger.oldMap.get(ld.Id);

        // Proceed only if Status has changed
        if (ld.Status != oldLead.Status) {
            Task newTask;

            // Handle Contacted or Qualified → Log a Call
            if (ld.Status == 'Contacted' || ld.Status == 'Qualified') {
                newTask = new Task(
                    WhoId = ld.Id,
                    OwnerId = ld.OwnerId,
                    Subject = 'Log a Call',
                    Status = 'Not Started',
                    Priority = 'Normal',
                    Description = 'Follow up after status changed to ' + ld.Status
                );
            }

            // Handle Email → Email Task
            else if (ld.Status == 'Email') {
                newTask = new Task(
                    WhoId = ld.Id,
                    OwnerId = ld.OwnerId,
                    Subject = 'Email',
                    Status = 'Not Started',
                    Priority = 'Normal',
                    Description = 'Send email after status changed to Email'
                );
            }

            if (newTask != null) {
                tasksToInsert.add(newTask);
            }
        }
    }

    if (!tasksToInsert.isEmpty()) {
        insert tasksToInsert;
    }
}