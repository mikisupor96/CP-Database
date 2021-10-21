const editUser = (
  firstName,
  lastName,
  email,
  newFirstName,
  newLastName,
  newEmail,
  newDepartment
) => {
  $.ajax({
    url: "./libs/php/editUser.php",
    type: `GET`,
    dataType: `json`,
    data: {
      firstName: firstName,
      lastName: lastName,
      email: email,
      newFirstName: newFirstName,
      newLastName: newLastName,
      newEmail: newEmail,
      newDepartment: newDepartment,
    },
    success: (result) => {
      $(".alert").remove();

      if (result["data"]) {
        $(".editUser").prepend(`
          <div class="alert alert-success" role="alert">
            User Edited Successfully.
          </div>
        `);
      } else {
        $(".editUser").prepend(`
        <div class="alert alert-danger" role="alert">
          Something went wrong, please check your details.
        </div>
      `);
      }
    },
    error: (xhr) => {
      console.log(xhr["responseText"]);
    },
  });
};

export default editUser;
