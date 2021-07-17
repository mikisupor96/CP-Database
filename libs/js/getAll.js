/**
 * *Returns array with: lastName, firstName, email, department, location
 */
const getAll = () => {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: "./libs/php/getAll.php",
      type: `GET`,
      dataType: `json`,
      success: (result) => {
        resolve(result["data"]);
      },

      error: (xhr) => {
        console.log(xhr["responseText"]);
        reject(result);
      },
    });
  });
};

export default getAll;
