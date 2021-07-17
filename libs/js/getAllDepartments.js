/**
 * *Returns array with: name of current departments
 */
const getAllDepartments = () => {
  return new Promise((resolve) => {
    $.ajax({
      url: "./libs/php/getAllDepartments.php",
      type: `GET`,
      dataType: `json`,
      success: (result) => {
        resolve(result);
      },

      error: (xhr) => {
        console.log(xhr["responseText"]);
      },
    });
  });
};

export default getAllDepartments;
