const addNewUser = (firstName, lastName, email, department, locationID) => {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: "./libs/php/addNewUser.php",
      type: `GET`,
      dataType: `json`,
      data: {
        firstName: firstName,
        lastName: lastName,
        email: email,
        department: department,
        locationID: locationID,
      },
      success: (result) => {
        resolve(result["data"]);
      },

      error: (xhr) => {
        reject(xhr);
        console.log(xhr["responseText"]);
      },
    });
  });
};

export default addNewUser;
