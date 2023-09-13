// Importing necessary modules from the Lightning Web Components (LWC) and Salesforce Apex
import { LightningElement,api,track} from 'lwc';
import getPlayerList from '@salesforce/apex/getPlayer.getPlayerList';
import {NavigationMixin} from 'lightning/navigation';

// Defining actions for the data table
const actions=[
    {label:'View',name:'view'},
];

// Defining columns for the data table
const columns=[
    {label:'Player Name',fieldName:'Name'},
    {label:'Country',fieldName:'Country__c'},
    {
        type:'action',
        typeAttributes : { rowActions : actions},
    },
];

// Exporting the default class which extends NavigationMixin and LightningElement
export default class RelatedPlayer extends NavigationMixin(LightningElement ){
    @track showPlayer='Show Player'; // Track variable for button label

    @track isVisible=false; // Track variable for visibility of player list

    @api recordId; // Record Id from the parent component

    @track data=[]; // Track variable for storing player data

    @track playerData=[]; // Track variable for storing player data

    columns=columns; // Columns for the data table
    
    error; // Variable to store any error during Apex method call

    // Lifecycle hook which fires when component is inserted into DOM
    connectedCallback(){
        console.log(this.recordId);
        //get player list 
        getPlayerList({SelectedId:this.recordId})
        .then(result=>{
            this.data=result;
            console.log(result);
        })
        .catch(error=>{
            this.error=error;
        })
    }

    // Function to handle click event of the button
    handleclick(event){
        const label=event.target.label;
        if(label==='Show Player'){
            this.showPlayer='Hide Player';
            this.isVisible=true;

        }else if(label==="Hide Player"){
            this.showPlayer="Show Player"
            this.isVisible=false;

        }
    }
    
    // Function to handle row action of the data table
    handleRowAction(event){
        const actionName=event.detail.action.name;
        const row=event.detail.row;
         switch(actionName){
            case 'view':
                this.navigateToPlayerRecordPage(row);
                break
            default:
         }

    }
   
     // Function to navigate to player record page
     navigateToPlayerRecordPage(rowData){
        const player=rowData;
        console.log(player);
        console.log('Playrer Id' , player.Id);

        if(player.Id){
           this[NavigationMixin.Navigate]({
                type: 'standard__recordPage',
                attributes: {
                    recordId: player.Id,
                    actionName: 'view',
                },
            })

        }


    }
}
