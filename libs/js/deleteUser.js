const deleteUser = (firstName, lastName, email) => {
  $.ajax({
    url: "./libs/php/deleteUser.php",
    type: `GET`,
    dataType: `json`,
    data: {
      firstName: firstName,
      lastName: lastName,
      email: email,
    },
    success: () => {
      $(".delete").prepend(`
          <div class="alert alert-success" role="alert">
            User deleted!
          </div>
        `);
    },

    error: (xhr) => {
      console.log(xhr["responseText"]);
    },
  });
};

export default deleteUser;
