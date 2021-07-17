const deleteUser = (firstName) => {
  $.ajax({
    url: "./libs/php/deleteUser.php",
    type: `GET`,
    dataType: `json`,
    data: {
      firstName: firstName,
    },
    success: () => {
      //   console.log("User deleted!");
    },

    error: (xhr) => {
      console.log(xhr["responseText"]);
    },
  });
};

export default deleteUser;
