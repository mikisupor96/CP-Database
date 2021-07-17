const editUser = (
  firstName,
  lastName,
  email,
  newFirstName,
  newLastName,
  newEmail
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
    },
    success: () => {},
    error: (xhr) => {
      // console.log(xhr["responseText"]);
    },
  });
};

export default editUser;
