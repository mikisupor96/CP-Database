const searchByFirstName = (firstName) => {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: "./libs/php/searchByFirstName.php",
      type: `GET`,
      dataType: `json`,
      data: {
        firstName: firstName,
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
export default searchByFirstName;
