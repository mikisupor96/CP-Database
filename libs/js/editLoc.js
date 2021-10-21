const editLoc = (location, newLocation) => {
  $.ajax({
    url: "./libs/php/editLoc.php",
    type: `GET`,
    dataType: `json`,
    data: {
      location: location,
      newLocation: newLocation,
    },
    success: (result) => {
      $(".alert").remove();
      if (result["data"]) {
        $(".editLoc").prepend(`
                <div class="alert alert-success" role="alert">
                  Location Edited Successfully.
                </div>
              `);
      } else {
        $(".editLoc").prepend(`
              <div class="alert alert-danger" role="alert">
                Something went wrong, please check your details.
              </div>
            `);
      }
    },
    error: (xhr) => {
      console.log(xhr["responseText"]);
    },
  });
};

export default editLoc;
