const searchByEmail = (email) => {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: "./libs/php/searchByEmail.php",
      type: `GET`,
      dataType: `json`,
      data: {
        email: email,
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
export default searchByEmail;
