const addNewUser = (firstName, lastName, email, department) => {
  $.ajax({
    url: "./libs/php/addNewUser.php",
    type: `GET`,
    dataType: `json`,
    data: {
      firstName: firstName,
      lastName: lastName,
      email: email,
      department: department,
    },
    success: (result) => {
      $(".alert").remove();
      if (result["data"]) {
        $(".createUser").prepend(`
          <div class="alert alert-success" role="alert">
            New user added!
          </div>
        `);
      } else {
        $(".createUser").prepend(`
        <div class="alert alert-danger" role="alert">
          First name, last name or email at least one must be unique!
        </div>
      `);
      }
    },
    error: (xhr) => {
      console.log(xhr);
    },
  });
};

export default addNewUser;
