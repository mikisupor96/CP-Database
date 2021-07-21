# Company CMS
*For all your data entry needs*

## What is this project about?

This project was designed to replicate all the CRUD functionalities found in any data entry application i.e GET, POST, PUT, DELETE. As a user you are able to look for an users information, add a new user, edit a current user and delete them aswell. The information in the tables is:
* First name
* Last name
* email
* department 
* location

## How does it work?

When a user attempt to make a search by pressing the search button the app will check if the information is correct by checking the information the back end has sent back if it is correct it will display the user(s) if it is wrong it will display an error message, this app is a fullstack PHP application.

## Technical Information

The app uses HTML, Javascript, Jquery and Bootstrap on the front end and PHP and MySql on the back end. When the user first loads the page the forms on the page get loaded with the current departments in the database using an ajax call through a php routine. After this the when a user makes a search by selecting the different categories the app checks the data agains the database again using a php routine and returns either an error or the information. 

> Hope you like my app and if you have any questions/suggestions feel free to contact me at mihainstein@gmail.com  :smiley:
