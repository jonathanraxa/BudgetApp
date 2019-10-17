
// ---------------- BUDGET CONTROLLER ---------------- 


let budgetController = (function () {
    class Expense {
        constructor(id, description, value) {
            this.id = id;
            this.description = description;
            this.value = value;
            this.percentage = -1;
        };
    }
    
    // calculates the percentage
    Expense.prototype.calcPercentage = function (totalIncome) {
        if (totalIncome > 0) {
            console.log(this.value);
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    };


    // has the specific task of return a function
    Expense.prototype.getPercentage = () => {
        return this.percentage;
    }

    class Income {
        constructor(id, description, value) {
            this.id = id;
            this.description = description;
            this.value = value;
        }
    };


    let calculateTotal = (type) => {

        let sum = 0;

        data.allItems[type].forEach((curr) => {
            sum += curr.value;
        });

        data.totals[type] = sum;

        /* 
            0 
            arr = [200, 400, 100]
            
            iterations: 
                sum = 0 + 200
                sum = 200 + 400
                sum = 600 + 100
                sum = 700
        */
    };

    // object that holds all the inc and expenses
    let data = {
        allItems: {
            exp: [],
            inc: [],
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
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
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }

            // check for expense of income
            if (type === 'exp') {
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc') {
                // creates a new object based on inc
                newItem = new Income(ID, des, val);
            }

            // pushes the new object newItem into the allItems array
            data.allItems[type].push(newItem);

            // return the new element
            return newItem;

        },

        calculateBudget: () => {

            // calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');

            // calculate the budget: income - expenses
            data.budget = data.totals.inc - data.totals.exp;


            // calculate the % of income that we spend
            if (data.totals.inc > 0) {
                data.percentage = Math.round(data.totals.exp / data.totals.inc) * 100;
            } else {
                data.percentage = -1;
            }

            /* Expense = 100 and income 200, spent 50% of income ==> 100/200 = 0.5 * 100*/

        },

        deleteItem: (type, id) => {

            let ids, index;

            // this would work if we were CERTAIN that ids were in order --> data.allItems[type][id];
            // [1 2 4 6 8] --> imagine if these were the id's, we'd be deleting the wrong element with the above code
            // ie. id = 3
            // index = 3

            // we need to create an array of all our ID's

            // MAP returns a brand new array
            ids = data.allItems[type].map(function (current) {
                return current.id;
            });

            // find the index of the ID we passed into the method
            index = ids.indexOf(id);

            if (index != -1) {
                // splice --> used to remove elements
                // slice --> used to create a copy
                // (index of the array, and how many to remove)
                data.allItems[type].splice(index, 1);

            }
        },

        calculatePercentages: () => {
            /* 
            a = 20
            b = 10
            c = 40

            income = 100

            a = 20 / 100 = 20%
            b = 10 / 100 = 10%
            c = 40 / 100 = 40% */

            data.allItems.exp.forEach( cur => {
            
                // calculates the percentage for each and every % 
                // in our object
                cur.calcPercentage(data.totals.inc);
            
            });
        },

        getPercentages: () => {
            
            // loop over all the expenses and GET each of them
            // we want to loop and STORE it somewhere --> MAP method
            let allPercentages = data.allItems.exp.map( cur => {
                return cur.getPercentage();
            });

            return allPercentages; // an array of all the percentages
        },

        getBudget: () => {
            // create a method only for returning from our data stucture
            // functions that only set or retrieve data

            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
        },

        testing: () => {
            console.log(data);
        }
    };


})();


