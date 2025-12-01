import { LightningElement, wire } from 'lwc';
import { publish, MessageContext } from 'lightning/messageService';
import UPDATES_CHANNEL from '@salesforce/messageChannel/updatesChannel__c';
import gettotalexpense from '@salesforce/apex/ExpenseController.getTotalExpense';

export default class OverviewTransactions extends LightningElement {
    fromDate;
    toDate;
    fromDatetime;
    toDatetime;
    currentDate = new Date();
    limit;
    totalexp;
    totalincome;
    totalinvestment;

    @wire(MessageContext)
    messageContext;

    productOptions = [
        { label: '10', value: 10 },
        { label: '25', value: 25 },
        { label: '50', value: 50 },
        { label: '100', value: 100 }
    ];

    expenseType = "Expense";  
    incomeType = "Income";  
    investmentType = "SIP";  

    @wire(gettotalexpense, { 
        fromDate: '$fromDatetime', 
        toDate: '$toDatetime',
        expType: '$expenseType'
    })
    wiredExpense({ data, error }) {
        if (data) {
            this.totalexp = this.formatCurrency(data);
        } else if(error) {
            console.log(error);
        }
    }

    @wire(gettotalexpense, { 
        fromDate: '$fromDatetime', 
        toDate: '$toDatetime',
        expType: '$incomeType'
    })
    wiredIncome({ data, error }) {
        if (data) {
            this.totalincome = this.formatCurrency(data);
        }
    }

    @wire(gettotalexpense, { 
        fromDate: '$fromDatetime', 
        toDate: '$toDatetime',
        expType: '$investmentType'
    })
    wiredInvestment({ data, error }) {
        if (data) {
            this.totalinvestment = this.formatCurrency(data);
        } else if(error) {
            console.log(error);
        }
    }

    formatCurrency(value) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2
        }).format(value);
    }

    connectedCallback() {
        // First day of current month (local timezone)
        const firstDay = new Date(
            this.currentDate.getFullYear(),
            this.currentDate.getMonth(),
            1
        );

        const lastDay = new Date(
            this.currentDate.getFullYear(),
            this.currentDate.getMonth() + 1,
            0
        );

        Date.prototype.yyyymmdd = function() {
            const mm = this.getMonth() + 1; 
            const dd = this.getDate();

            return [
                this.getFullYear(),
                (mm > 9 ? '' : '0') + mm,
                (dd > 9 ? '' : '0') + dd
            ].join('');
        };

       
        this.fromDate = firstDay.yyyymmdd();
        this.toDate = lastDay.yyyymmdd();
        this.fromDatetime = firstDay;
        this.toDatetime = lastDay;
    }

    handleChange(event) {
        const field = event.target.name;

        // Handle page size dropdown
        if (field === 'page') {
            this.limit = event.detail.value;
            publish(this.messageContext, UPDATES_CHANNEL, { limit: this.limit });
        }

        // Handle date selection
        if (field === 'fromDate') {
            const dateStr = event.detail.value; // "YYYY-MM-DD"
            this.fromDatetime = this.toLocalDateTime(dateStr);

            
            const datetime = this.toLocalDateTime(dateStr);
            publish(this.messageContext, UPDATES_CHANNEL, { fromDate: datetime });
        }

        if (field === 'toDate') {
            const dateStr = event.detail.value; // "YYYY-MM-DD"
            this.toDatetime = this.toLocalDateTime(dateStr);

           
            const datetime = this.toLocalDateTime(dateStr);
            publish(this.messageContext, UPDATES_CHANNEL, { toDate: datetime });
        }
    }

    dateTimeToDateString(dateTime) {
        const year = dateTime.getFullYear();
        const month = String(dateTime.getMonth() + 1).padStart(2, '0');
        const day = String(dateTime.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`; // "YYYY-MM-DD" for lightning-input
    }

    toLocalDateTime(dateStr) {
        const [y, m, d] = dateStr.split('-').map(Number);
        return new Date(y, m - 1, d); // local date
    }
}