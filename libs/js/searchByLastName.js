const searchByLastName = (lastName) => {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: "./libs/php/searchByLastName.php",
      type: `GET`,
      dataType: `json`,
      data: {
        lastName: lastName,
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
export default searchByLastName;
