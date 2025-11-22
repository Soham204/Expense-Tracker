import LightningDatatable from "lightning/datatable";
import transactionDateCell from './transactionDateCell.html'


export default class TransactionDateCell extends LightningDatatable  {

    static customTypes = {
    customName: {
      template: transactionDateCell,
      standardCellLayout: true,
      typeAttributes: ["weekday"],
    },
}
}