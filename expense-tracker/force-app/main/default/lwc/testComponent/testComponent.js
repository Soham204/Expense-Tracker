import { LightningElement } from 'lwc';
import {data2} from './sample';

export default class TestComponent extends LightningElement {
    columns = [
        {
            label: 'Time', fieldName: 'Time',  type: "customName", typeAttributes: {
                row: { fieldName: 'row' }
            }
        },
        { label: 'Category', fieldName: 'Category__c',type: 'statusBadge', },
        { label: 'Amount', fieldName: 'Amount__c', type: 'currency', typeAttributes: { currencyCode: 'INR' } },
        { label: 'Payment Method', fieldName: 'Payment_Method__c',type: 'statusBadge', },
        { label: 'Description', fieldName: 'Description__c',type: 'statusBadge', }
    ];
    
   data = data2
}