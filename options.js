function requestPlans(bambooServerUrl) {
  $("#requestLoading").fadeIn();
  $.ajax({
    url: bambooServerUrl + "rest/api/latest/project.json?expand=projects.project.plans.plan",
    success: function(data) {
      var projects = "",
          plans = "",
          singleProject,
          singlePlan;
      $("#requestLoading").fadeOut();
      for (var i in data.projects.project) {
        plans = "";
        singleProject = data.projects.project[i];
        for (var j in singleProject.plans.plan) {
          singlePlan = singleProject.plans.plan[j];
          plans += "<li>" + singlePlan.name + "</li>";
        }
        plans = "<ul>" + plans + "</ul>";
        projects += "<li>" + singleProject.name + "</li>" + plans;
      }
      projects = "<ul>" + projects + "</ul>";
      $("#newPlans").append(projects);
    },
    error: function() {
      alert("please try again later...");
    }
  });
}

$(document).ready(function() {
  var urlValidation = null;

  $("#bambooServerUrlButton").click(function() {
    var bambooServerUrl = $("#bambooServerUrl").val();
    if (bambooServerUrl.length > 0 && bambooServerUrl[bambooServerUrl.length -1] !== "/") {
      bambooServerUrl += "/";
    }
    requestPlans(bambooServerUrl);
  });

  $("#bambooServerUrl").on("keyup", function(e){
    var urlPattern = new RegExp("^(https?:\\/\\/)?([\\da-zA-Z\\.-]+)\\.([A-Za-z\\.]{2,6})([/\\w\\.-]*)*\\/?$");
        bambooServerUrl = $("#bambooServerUrl").val();

    if (urlPattern.test(bambooServerUrl)) {
      $("#requestPlanError").slideUp();
      $("#bambooServerUrlButton").removeAttr('disabled');
    }
    else {
      $("#requestPlanError").slideDown();
      $("#bambooServerUrlButton").attr('disabled', 'disabled');
    }
  });
});





