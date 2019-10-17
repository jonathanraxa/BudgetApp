
// ---------------- UI CONTROLLER ---------------- 


let UIController = (function () {

    // create an object that stores all the querySelector data
    let DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month'

    }

    formatNumber = (num, type) => {
        /*
            + or - before number
            exactly 2 decimal points comma separating the thousands

            2310.4567 --> 2,310.46
            2000 --> + 2,000.00
        */

        let numSplit, int, dec, sign;

        num = Math.abs(num); // 
        num = num.toFixed(2); // # of decimal places (method of the numbers prototype)

        // need decimal part and int part
        numSplit = num.split('.');

        int = numSplit[0];

        // dec = numSplit[1];

        if (int.length > 3) {
            // substring, gives us only a part of the string that we want
            // start at position 0, and read 1 element
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3); // input 2310, output 2,310 
        }

        dec = numSplit[1];


        return (type === 'exp' ? sign = '-' : sign = '+') + ' ' + int + '.' + dec;
    };


        let nodeListForEach = (list, callback) => {
            for (let i = 0; i < list.length; i++) {
                callback(list[i], i);
            }
        }

    // create a public method that will get returned for the other functions to use
    return {
        getInput: () => {
            // gets the value of the inputs
            return {
                type: document.querySelector(DOMstrings.inputType).value, // will be either inc or exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)

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
                    `<div class="item clearfix" id="inc-${obj.id}">
                <div class="item__description">${obj.description}</div>
                <div class="right clearfix">
                    <div class="item__value">${formatNumber(obj.value, type)}</div>
                    <div class="item__delete">
                        <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                    </div>
                </div>
            </div>`;
            } else if (type === 'exp') {
                element = DOMstrings.expensesContainer;
                html =
                    `<div class="item clearfix" id="exp-${obj.id}">
                <div class="item__description">${obj.description}</div>
                <div class="right clearfix">
                    <div class="item__value">${formatNumber(obj.value, type)}</div>
                    <div class="item__percentage">${obj.percentages}</div>
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

        deleteListItem: selectorID => {

            let el = document.getElementById(selectorID);

            // remove child method
            // but we need to know the parent first
            el.parentNode.removeChild(el);

        },

        clearFields: () => {
            let fields, fieldsArr;

            // fields create a LIST, but we want to turn it into an array via SLICE method
            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue); // selecting query just like CSS 

            // fields.slice() this wouldn't work since fields is a list

            // this will trick the slice method that we gave it an array and then return an array
            fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach((current, index, array) => {
                // apply an anon funct to each unit of the array

                current.value = ""; // set the value back to empty

            });

            fieldsArr[0].focus();
        },

        // displays the budget at the top of the page
        displayBudget: (obj) => {
            let type;
            obj.budget > 0 ? type = 'inc' : type = 'exp';

            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');

            // if there's a %, then add the % sign
            if (obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%'; // only shows when % > 0
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---'; // shows that it's empty
            }
        },

        displayPercentages: function (percentages) {

            var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);


            nodeListForEach(fields, function (current, index) {

                if (percentages[index] > 0) {
                    current.textContent = percentages[index] + '%';
                } else {
                    current.textContent = '---';
                }
            });

        },

        displayMonth: () => {
            let now, year, month;
            now = new Date();
            // let christmas = new Date( 2019, 12, 25); 
            months = [
                'January',
                'February',
                'March',
                'April',
                'May',
                'June',
                'July',
                'August',
                'September',
                'October',
                'November',
                'December'
            ];
            month = now.getMonth();

            year = now.getFullYear(); // returns the current year

            document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ', ' + year; // sets the year on display
           
        },

        changedType: () => {
            // 1. select all the three elements that receive the red-focus class

            let fields = document.querySelectorAll(
                DOMstrings.inputType + ',' +
                DOMstrings.inputDescription + ',' +
                DOMstrings.inputValue
            );

            nodeListForEach(fields, cur => {
                cur.classList.toggle('red-focus');
            });

            document.querySelector(DOMstrings.inputBtn).classList.toggle('red');
        },

        getDOMstrings: () => {
            return DOMstrings;
        }

    };

})(); // END UIController




