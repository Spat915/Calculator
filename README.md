# Summary

This is a simple calculator application.  We have two API endpoints available; one returns the list of operations and required operands for that operation, the other performs the calculation itself.

# Objective

Create a Page that displays a list of possible Calculator Operations based on the results from the API.  The user will be able to select one of the operations, and be able to enter in numbers to calculate.  The amount of numbers is based on the possible operands that the operator supports.  There should be a calculate button that will make an API call to the calculator and display the result.  The user should be able to easily switch between operations, and clear our their entered numbers and result.

## API

The Base URL is:

https://b2swne134l.execute-api.us-east-1.amazonaws.com/default/calculator

The following table details the API:

~~~~
Name: GetAllCalculatorOperations
Method: GET
Path: /
Response Schema:
[
    {
        "operation": string,
        "operand": number
    }
]
~~~~
~~~~
Name: PerformCalculate
Method: POST
Path: /
Request Schema:
{
    "operation": string,
    "operand1": number,
    "operand2"?: number
}
Response Schema:
number
~~~~

## Dependencies

This shell requires the following global dependencies:

* NodeJS
* Ionic

The shell uses the following frameworks/dependencies:

* Ionic 4.X
* Angular 7.X
* SCSS

