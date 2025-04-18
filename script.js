$(document).ready(function () {
    // Make an API call to get all employees
    $.get("http://localhost:3000/api/employees", function (data) {
        // Handle the data and append it to the list
        const employeeList = $("#userList");
        if(data==null){
            console.log('null data');
        }
        
        data.forEach(function (users) {
            const listItem = `<li>${users.username}-${users.password}</li>`;
            employeeList.append(listItem);
        });
    });
});
