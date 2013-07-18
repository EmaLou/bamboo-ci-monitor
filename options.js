function renderRequestedPlans(data) {
  var projects = '',
      plans = '',
      singleProject,
      singlePlan,
      isSavedPlan;
  for (var i in data.projects.project) {
    plans = '';
    singleProject = data.projects.project[i];
    for (var j in singleProject.plans.plan) {
      singlePlan = singleProject.plans.plan[j];
      isSavedPlan = storage.findPlanInStorage(singlePlan);
      plans += '<li>' + '<input type="checkbox" class="addPlan" data-key="' + singlePlan.key + '" data-name="' + singlePlan.name + '" data-href="' + singlePlan.link.href + '"'+ (isSavedPlan? ' checked="checked"' : '')  +'>' + singlePlan.name + '</li>';
    }
    plans = '<ul>' + plans + '</ul>';
    projects += '<li>' + singleProject.name + '</li>' + plans;
  }
  projects = '<ul>' + projects + '</ul>';
  $('#newPlans').append(projects);
  $('#requestPlanError').slideUp('fast');
}

function requestPlans(bambooServerUrl) {
  $('#requestPlanError').html('Loading...');
  $('#requestPlanError').slideDown('fast');
  $.ajax({
    url: bambooServerUrl + 'rest/api/latest/project.json?expand=projects.project.plans.plan',
    success: renderRequestedPlans,
    error: function() {
      $('#requestPlanError').html('something went wrong...please try again later');
    }
  });
}

function generateLinkOfPlan(plan) {
  var hostPattern = /^(https?:\/\/)?([A-Za-z\d\.-]+)\//,
      host;
  host = hostPattern.exec(plan.href)[0];
  return '<a href="' + host + 'browse/' + plan.key + '">' + plan.name + '</a>';
}

function renderSavedPlan(savedPlan) {
  $('#savedPlans ul').append('<li id="' + savedPlan.key + '" data-key="'+savedPlan.key+'" data-href="'+savedPlan.href+'" data-name="'+savedPlan.name+'"><input type="checkbox" class="deletePlan" checked="checked">' + generateLinkOfPlan(savedPlan) + '</li>');
}

function renderSavedPlans(savedPlans) {
  for (i in savedPlans) {
    renderSavedPlan(savedPlans[i]);
  }
}

function savePlan(plan) {
  storage.savePlanToStorage(plan);
  renderSavedPlan(plan);
}

function deletePlan(plan) {
  storage.deletePlanFromStorage(plan);
  $('#savedPlans ul').find("#" + plan.key).remove();
}

$(document).ready(function() {
  var savedPlans = storage.getStorage();
  renderSavedPlans(savedPlans);

  $('#bambooServerUrlButton').click(function(e) {
    var bambooServerUrl = $('#bambooServerUrl').val();
    if ($("#bambooServerUrlButton").is(":disabled")) {
      return;
    }
    $('#newPlans').html('');
    if (bambooServerUrl.length > 0 && bambooServerUrl[bambooServerUrl.length -1] !== '/') {
      bambooServerUrl += '/';
    }
    requestPlans(bambooServerUrl);
  });

  $('#bambooServerUrl').keyup(function(e){
    var urlPattern = new RegExp('^(https?:\\/\\/)?([\\da-zA-Z\\.-]+)\\.([A-Za-z\\.]{2,6})([/\\w\\.-]*)*\\/?$');
        bambooServerUrl = $('#bambooServerUrl').val();

    e.preventDefault();
    if (urlPattern.test(bambooServerUrl)) {
      $('#requestPlanError').slideUp();
      $('#bambooServerUrlButton').removeAttr('disabled');
      if (e.keyCode === 13) {
        $('#bambooServerUrlButton').click();
      }
    }
    else {
      $('#requestPlanError').html('invalid url')
      $('#requestPlanError').slideDown();
      $('#bambooServerUrlButton').attr('disabled', 'disabled');
    }
  });

  $('.addPlan').live('click', function() {
    var plan = {key: $(this).data('key'),
              name: $(this).data('name'),
              href: $(this).data('href')
              };
    if ($(this).is(':checked')) {
      savePlan(plan);
    }
    else {
      deletePlan(plan);
    }
  });

  $('.deletePlan').live('click', function() {
    var li = $(this).closest("li"),
        plan = {key: $(li).data('key'),
                name: $(li).data('name'),
                href: $(li).data('href')
              };
    deletePlan(plan);
  });
});
