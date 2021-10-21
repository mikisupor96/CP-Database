const addNewLocation = (location) => {
  $.ajax({
    url: "./libs/php/addNewLocation.php",
    type: `GET`,
    dataType: `json`,
    data: {
      location: location,
    },
    success: (result) => {
      $(".alert").remove();
      if (result["data"]) {
        $(".createLocation").prepend(`
                <div class="alert alert-success" role="alert">
                  New location added!
                </div>
              `);
      } else {
        $(".createLocation").prepend(`
              <div class="alert alert-danger" role="alert">
                Please make sure you add a unique location!
              </div>
            `);
      }
    },
    error: (xhr) => {
      console.log(xhr);
    },
  });
};

export default addNewLocation;
