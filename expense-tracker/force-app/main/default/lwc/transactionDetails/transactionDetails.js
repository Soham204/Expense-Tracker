import { LightningElement, wire } from 'lwc';
import getExpenses from '@salesforce/apex/ExpenseController.getExpenses';
import { refreshApex } from '@salesforce/apex';
import { NavigationMixin } from "lightning/navigation";

import { subscribe, MessageContext } from 'lightning/messageService';
import UPDATES_CHANNEL from '@salesforce/messageChannel/updatesChannel__c';

export default class TransactionDetails extends NavigationMixin(LightningElement) {
    subscription = null;
    index = 10;

    currentDate = new Date();

    fromDate = null;
    toDate = null;

    columns = [
        {
            label: 'Time', fieldName: 'Time', type: "customName", typeAttributes: {
                weekday: { fieldName: 'weekday' }
            }, initialWidth: 250
        },
        { label: 'Category', fieldName: 'Category__c' },
        { label: 'Amount', fieldName: 'Amount__c', type: 'currency', typeAttributes: { currencyCode: 'INR' }, cellAttributes: { alignment: 'left' } },
        { label: 'Payment Method', fieldName: 'Payment_Method__c' },
        { label: 'Description', fieldName: 'Description__c' }
    ];

    isLoading = true;
    tableData = [];
    wiredExpensesResult;

    // Wire Apex
    @wire(getExpenses, { index: '$index', fromDate: '$fromDate', toDate: '$toDate' })
    handledata(results) {
        this.wiredExpensesResult = results;
        const { data, error } = results;

        if (data) {
            let tableRows = [];

            for (let dateKey in data) {
                const dt = new Date(dateKey);

                const formattedDate = new Intl.DateTimeFormat('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                }).format(dt);

                const weekday = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(dt);

                tableRows.push({
                    id: `header-${dateKey}`,
                    isGroupHeader: true,
                    Time: formattedDate,
                    weekday,
                    Category__c: '',
                    Amount__c: '',
                    Payment_Method__c: '',
                    Description__c: ''
                });

                // Child rows
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

        } else if (error) {
            console.error(error);
            this.isLoading = false;
        }
    }

    handleRefresh() {
        this.isLoading = true;

        refreshApex(this.wiredExpensesResult).then(() => {
            this.isLoading = false;
        });
    }

    navigateToNewContactWithDefaults() {
        this[NavigationMixin.Navigate]({
            type: "standard__objectPage",
            attributes: {
                objectApiName: "Expense__c",
                actionName: "new",
            },
        }, true);
    }

    @wire(MessageContext)
    messageContext;

    subscribeToMessageChannel() {
        this.subscription = subscribe(
            this.messageContext,
            UPDATES_CHANNEL,
            (message) => this.handleMessage(message)
        );
    }

    handleMessage(message) {
        if (message) {
            this.index = message.limit ?? this.index;

            // Convert incoming LMS date if needed
            if (message.fromDate) {
                this.fromDate = message.fromDate;
            }
            if(message.toDate){
                this.toDate = message.toDate;
            }

            
        }
        this.handleRefresh();
    }

    connectedCallback() {
        // FROM DATE = 1st of current month
        this.fromDate = new Date(
            this.currentDate.getFullYear(),
            this.currentDate.getMonth() - 1,
            1
        );

        // TO DATE = last day of current month
        this.toDate = new Date(
            this.currentDate.getFullYear(),
            this.currentDate.getMonth() + 1,
            0
        );

      

        this.subscribeToMessageChannel();
    }

}