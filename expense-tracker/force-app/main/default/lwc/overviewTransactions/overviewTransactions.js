import { LightningElement, wire } from 'lwc';
import { publish, MessageContext } from 'lightning/messageService';
import UPDATES_CHANNEL from '@salesforce/messageChannel/updatesChannel__c';

export default class OverviewTransactions extends LightningElement {
    fromDate = '2008-02-01';
    currentDate = new Date();
    limit;

    @wire(MessageContext)
    messageContext;

    productOptions = [
        { label: '10', value: 10 },
        { label: '25', value: 25 },
        { label: '50', value: 50 },
        { label: '100', value: 100 }
    ];

    handleChange(event) {
        const field = event.target.name;

        // Handle page size
        if (field === 'page') {
            this.limit = event.detail.value;

            const payload = {
                limit: this.limit
               
            };

            publish(this.messageContext, UPDATES_CHANNEL, payload);
        }

        // Handle date field
        if (field === 'fromDate') {
            this.fromDate = event.detail.value;

            const payload = {
              
                fromDate: this.fromDate
            };

            publish(this.messageContext, UPDATES_CHANNEL, payload);
        }
    }
    connectedCallback() {
       // this.myDate.setMonth(this.currentDate.getMonth());
        //this.myDate.setDate(1);
     }
}