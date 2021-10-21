const deleteLocation = (location, uiElement) => {
  $.ajax({
    url: "./libs/php/deleteLocation.php",
    type: `GET`,
    dataType: `json`,
    data: {
      location: location,
    },
    success: (result) => {
      if (result["data"]) {
        $(".delete").prepend(`
          <div class="alert alert-success" role="alert">
            Location deleted!
          </div>
        `);
        uiElement.parent().parent().remove();
      } else {
        $(".delete").prepend(`
          <div class="alert alert-danger" role="alert">
            Please remove departments from the current location!
          </div>
        `);
      }
    },
    error: (xhr) => {
      console.log(xhr["responseText"]);
    },
  });
};

export default deleteLocation;
