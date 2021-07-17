const searchByLocation = (location) => {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: "./libs/php/searchByLocation.php",
      type: `GET`,
      dataType: `json`,
      data: {
        location: location,
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
export default searchByLocation;
