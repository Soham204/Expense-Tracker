import { LightningElement, wire } from 'lwc';
import getExpenses from '@salesforce/apex/ExpenseController.getExpenses';
import { refreshApex } from '@salesforce/apex';
import { NavigationMixin } from "lightning/navigation";

// Import message service features required for subscribing and the message channel
import { subscribe, MessageContext } from 'lightning/messageService';
import UPDATES_CHANNEL from '@salesforce/messageChannel/updatesChannel__c';

export default class TransactionDetails extends NavigationMixin(LightningElement) {
    subscription = null;
    index = 10;
    currentDate = new Date();
    fromDate = new Date();
   
    toDate =  new Date();
    columns = [
        {
            label: 'Time', fieldName: 'Time', type: "customName", typeAttributes: {
                weekday: { fieldName: 'weekday' }
            }, initialWidth: 250
        },
        { label: 'Category', fieldName: 'Category__c' },
        { label: 'Amount', fieldName: 'Amount__c', type: 'currency', typeAttributes: { currencyCode: 'INR' }, cellAttributes: { alignment: 'left' }, },
        { label: 'Payment Method', fieldName: 'Payment_Method__c' },
        { label: 'Description', fieldName: 'Description__c' }
    ];
    isLoading = true;
    tableData = [];
    wiredExpensesResult;
    
    @wire(getExpenses,{index : '$index',fromDate :'$fromDate',toDate : '$toDate'})
    handledata(results) {
        this.wiredExpensesResult = results;
        const { data, error } = results;
        if (data) {
            let tableRows = [];

            for (let dateKey in data) {

                // Format date for header
                const dt = new Date(dateKey);
                const formattedDate = new Intl.DateTimeFormat('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                }).format(dt);

                const weekday = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(dt);
                // Group Header Row
                tableRows.push({
                    id: `header-${dateKey}`,
                    isGroupHeader: true,
                    Time: formattedDate,
                    weekday: weekday,
                    Category__c: '',
                    Amount__c: '',
                    Payment_Method__c: '',
                    Description__c: ''
                });

                // Child Rows
                data[dateKey].forEach(exp => {
                    const expDate = new Date(exp.Date__c);
                    let hours = expDate.getHours();
                    const minutes = expDate.getMinutes().toString().padStart(2, '0');
                    const ampm = hours >= 12 ? 'PM' : 'AM';
                    hours = hours % 12 || 12;

                    tableRows.push({
                        id: exp.Id,
                        isGroupHeader: false,
                        Time: `${hours}:${minutes} ${ampm}`,
                        Category__c: exp.Category__c,
                        Amount__c: exp.Amount__c,
                        weekday: '',
                        Payment_Method__c: exp.Payment_Method__c,
                        Description__c: exp.Description__c
                    });
                });
            }

            this.tableData = tableRows;
            this.isLoading = false;
        } else {
            console.error(error);
            this.isLoading = false;
        }
    }
    handleRefresh() {
        this.isLoading = true;
        refreshApex(this.wiredExpensesResult).then(
            () => {
                     this.isLoading = false
            }
           
        );
    }
  navigateToNewContactWithDefaults() {
    this[NavigationMixin.Navigate]({
      type: "standard__objectPage",
      attributes: {
        objectApiName: "Expense__c",
        actionName: "new",
      },
    }, true,);
  }
    @wire(MessageContext)
    messageContext;

    // Encapsulate logic for LMS subscribe.
    subscribeToMessageChannel() {
        this.subscription = subscribe(
            this.messageContext,
            UPDATES_CHANNEL,
            (message) => this.handleMessage(message)
        );
    }
    handleMessage(message) {
        if(message) 
            {
                this.index = message.limit;
                this.fromDate = message.fromDate;
            }
        else this.handleRefresh();
        
    }
    connectedCallback() {
        this.fromDate.setMonth(this.currentDate.getMonth());
        this.fromDate.setDate(1);
        this.toDate.setMonth(this.currentDate.getMonth() + 1)
        this.toDate.setDate(0)
        console.log(this.currentDate.getMonth());
        console.log(this.fromDate,this.toDate)
        this.subscribeToMessageChannel();
    }

}