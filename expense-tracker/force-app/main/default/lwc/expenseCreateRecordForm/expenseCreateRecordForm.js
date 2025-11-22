import { LightningElement,wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
// Import message service features required for publishing and the message channel
import { publish, MessageContext } from 'lightning/messageService';
import UPDATES_CHANNEL from '@salesforce/messageChannel/updatesChannel__c';
export default class LdsCreateRecord extends LightningElement {
    
    objectApiName = 'Expense__c'; 
    @wire(MessageContext)
    messageContext;


    handleSuccess(event) {
        publish(this.messageContext, UPDATES_CHANNEL);
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success',
                message: 'Expense record created successfully!',
                variant: 'success'
            })
        );

        //  Reset form after success
        this.template.querySelectorAll('lightning-input-field').forEach(field => field.reset());
    }

    handleError(event) {
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Error',
                message: event.detail.message,
                variant: 'error',
                mode: 'sticky'
            })
        );
    }

}