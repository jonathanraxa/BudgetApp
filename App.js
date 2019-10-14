
// BUDGET CONTROLLER


let budgetController = (function() {
    class Expense {
        constructor(id, description, value){
            this.id = id;
            this.description = description;
            this.value = value;
        }
    }
    class Income {
        constructor(id, description, value){
            this.id = id;
            this.description = description;
            this.value = value;
        }
    }
    // function constructor - creating an EXPENSE object
    // let Expense = (id, description, value) => {
    //     this.id = id;
    //     this.description = description;
    //     this.value = value;
    // };

      // function constructor - creating an INCOME object
    //   let Income = (id, description, value) => {
    //     this.id = id;
    //     this.description = description;
    //     this.value = value;
    // };

    let data = {
        allItems: {
            exp: [], 
            inc: [], 
        },
        totals: {
            exp: 0,
            inc: 0
        }
    };

    return {

        // creates a new item (we need a type, description, and value of exp/inc)
        addItem: (type, des, val) => {
            
            // create a new object from this constructor
            let newItem, ID;

            // need a unique id for each item in the array 
            // [1, 2, 3, 4, 5], next ID = 6? What if we deleted stuff?
            // [1, 2, 3, 6, 8], then we'd have two elements with ID of 6
            // solution: ID = last ID + 1

            // handle initial ID at 0 and over 0
            if ( data.allItems[type].length > 0){
                ID = data.allItems[type][data.allItems[type].length -1].id + 1; 
            } else {
                ID = 0; 
            }

            // check for expense of income
            if (type === 'exp'){
                newItem = new Expense(ID, des,val);
            } else if (type === 'inc'){
                // creates a new object based on inc
                newItem = new Income(ID, des, val);
            }

            // pushes the new object newItem into the allItems array
            data.allItems[type].push(newItem);

            // return the new element
            return newItem;

        },

        testing: () => {
            console.log(data);
        }
    };


})(); 


// UI CONTROLLER
let  UIController = (function() {

    // create an object that stores all the querySelector data
    let DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list'
    }
    
    // create a public method that will get returned for the other functions to use
    return {
        getInput: () => {
        // gets the value of the inputs
            return {
                type: document.querySelector(DOMstrings.inputType).value, // will be either inc or exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: document.querySelector(DOMstrings.inputValue).value    
       
                // this is the OLD way of doing it
                // let type = document.querySelector('.add__type').value; // will be either inc or exp
                // let description = document.querySelector('.add__description').value;
                // let value = document.querySelector('.add__value').value;

                // How do we return 3 values at the same time? Use Objects.
            };
        },

        addListItem: (obj, type) => {

            let html, element;

            // Create HTML string with placeholder text
           
           if (type === 'inc') {
               element = DOMstrings.incomeContainer;

           html = 
           `<div class="item clearfix" id="income-${obj.id}">
                <div class="item__description">${obj.description}</div>
                <div class="right clearfix">
                    <div class="item__value">${obj.value}</div>
                    <div class="item__delete">
                        <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                    </div>
                </div>
            </div>`;
           } else if (type === 'exp'){
               element = DOMstrings.expensesContainer;
              html = 
              `<div class="item clearfix" id="expense-${obj.id}">
                <div class="item__description">${obj.description}</div>
                <div class="right clearfix">
                    <div class="item__value">${obj.value}</div>
                    <div class="item__percentage">21%</div>
                    <div class="item__delete">
                        <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                    </div>
                </div>
                </div>
                `;
           }
            // Replace the placeholder text with some actual data
           // --> since we have Es6, we can bypass this step from the code above

            // Insert the HTML into the DOM
           document.querySelector(element).insertAdjacentHTML('beforeend', html); 
        },
             
        getDOMstrings: () => {
            return DOMstrings;
        }
        
    };

})(); // END UIController

// GLOBAL APP CONTROLLER
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
    };


    
    // called when we want to add a new item
    let crtlAddItem = () => {
        
        let input, newItem;

        // 1. Get the field input data
        input = UICtrl.getInput();

        // 2. Add the item to the budget controller
        newItem = budgetCtrl.addItem(input.type, input.description, input.value);

        // 3. Add the item to the UI
        UICtrl.addListItem(newItem, input.type);

        // 4. Calculate the budget

        // 5. Display the budget on the UI
    }

    return {
        init: () => {
            setupEventListeners();
        }
    }
  // these two will be assigned to the function arguments
})(budgetController, UIController); // END controller


controller.init();