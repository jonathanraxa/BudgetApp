
// ----------------  GLOBAL APP CONTROLLER ---------------- 

let controller = (function(budgetCtrl, UICtrl) {
    
    // how do we call this? create a public initialization function
    let setupEventListeners = () => {

        //  sets all the DOM query selectors
        let DOM = UICtrl.getDOMstrings();
        
        // attach an event listener to the button class
        document.querySelector(DOM.inputBtn).addEventListener('click', crtlAddItem);


        // add event listener to the GLOBAL document for ANY key, not specific to any class
        document.addEventListener('keypress', evt => {
            
            // make sure that it's a ENTER keypress
            // 'which' is for older browswers that don't know about the keycode property
            if(evt.keyCode === 13 || evt.which === 13){
                crtlAddItem();
            }

        });

        // EVENT LISTENER: called each time someone clicks in this container to DELETE
        // an item and allows the event to bubble up
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);
    };


    let updateBudget = () => {
        // 1. Calc budget
        budgetCtrl.calculateBudget();

        // 2. return the budget
        let budget = budgetCtrl.getBudget();

        // 3. Display the budget on the UI
        UICtrl.displayBudget(budget);
    };


    let updatePercentages = () => {
        
        // 1. Calculate percentages
        budgetCtrl.calculatePercentages();

        // 2. Read % from the budget controller
        let percentages = budgetCtrl.getPercentages();

        // 3. update the Ui with the new percentages
        UICtrl.displayPercentages(percentages);
    }

    
    // called when we want to add a new item
    let crtlAddItem = () => {
        
        let input, newItem;

        // 1. Get the field input data
        input = UICtrl.getInput();


        // if the description isn't empty
        // & if the value is not, not a number
        // & if the value is greater than 0
        if(input.description !== "" && !isNaN(input.value) && (input.value) > 0) {
            // 2. Add the item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            // 3. Add the item to the UI
            UICtrl.addListItem(newItem, input.type);

            // 4. Clear the fields
            UICtrl.clearFields();

            // 5. Calculate the budget / also display it
            updateBudget();

            // 6. calculate and update the percentages
            updatePercentages();



        }    
    };

    // we need the evt because we want to know the TARGET element
    let ctrlDeleteItem = evt => {
        let itemID, splitID, type, ID;

        // we heavily rely on the DOM structure in this case - not ideal though
        itemID = evt.target.parentNode.parentNode.parentNode.parentNode.id;

        // check if there's an ID
        if (itemID) {
            
            // NOTE: primative --> objects so we can use them as objects and use methods on them

            // inc-1 --> the format
            splitID = itemID.split('-'); // returns ['inc','1'] -- it splits at '-'
            type = splitID[0]; // determines (inc or exp) as the type
            ID = parseInt(splitID[1]);

            // 1. delete the item from the data structure
            budgetCtrl.deleteItem(type, ID); // we're comparing a string to a number

            // 2. delete the item from the user interface 
            UICtrl.deleteListItem(itemID);

            // 3. update and show the new budget
            updateBudget(); // contains all the updating functionality 

        }
    };

    return {
        init: () => {
            // pass an obj with everything set to 0
            UICtrl.displayMonth();

            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            }); // want everything set to 0
            setupEventListeners();
        }
    }
  // these two will be assigned to the function arguments
})(budgetController, UIController); // END controller


controller.init();