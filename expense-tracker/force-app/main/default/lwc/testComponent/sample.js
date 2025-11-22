export const data2 = [
    {
        id: '1',
        Time: '09:15 AM',
        Category__c: 'Food',
        Amount__c: 25,
        Payment_Method__c: 'Credit Card',
        Description__c: 'Lunch at cafe',
        row:'Something',
        _children: [
            {
                id: '1-1',
                Time: '09:15 AM',
                Category__c: 'Food - Sub',
                Amount__c: 10,
                Payment_Method__c: 'Cash',
                Description__c: 'Coffee'
            },
            {
                id: '1-2',
                Time: '09:20 AM',
                Category__c: 'Food - Sub',
                Amount__c: 15,
                Payment_Method__c: 'Credit Card',
                Description__c: 'Sandwich'
            }
        ]
    },
    {
        id: '2',
        Time: '02:30 PM',
        Category__c: 'Transport',
        Amount__c: 50,
        Payment_Method__c: 'Cash',
        row:'Something',
        Description__c: 'Taxi fare',
        _children: [
            {
                id: '2-1',
                Time: '02:30 PM',
                Category__c: 'Transport - Sub',
                Amount__c: 30,
                Payment_Method__c: 'Cash',
                Description__c: 'Taxi to office'
            },
            {
                id: '2-2',
                Time: '02:45 PM',
                Category__c: 'Transport - Sub',
                Amount__c: 20,
                Payment_Method__c: 'Cash',
                Description__c: 'Taxi back home'
            }
        ]
    },
    {
        id: '3',
        Time: '06:00 PM',
        Category__c: 'Entertainment',
        Amount__c: 100,
        row:'Something',
        Payment_Method__c: 'Credit Card',
        Description__c: 'Movie night',
        _children: [
            {
                id: '3-1',
                Time: '06:00 PM',
                Category__c: 'Entertainment - Sub',
                Amount__c: 100,
                Payment_Method__c: 'Credit Card',
                Description__c: 'Movie tickets'
            }
        ]
    }
];