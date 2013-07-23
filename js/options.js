function renderRequestedPlans(data, selector) {
  var projects = '',
      plans = '',
      singleProject,
      singlePlan,
      isSavedPlan;

  for (var i in data.projects.project) {
    plans = '';
    singleProject = data.projects.project[i];
    $(selector).append('<li id="' + singleProject.key + '">' + singleProject.name + '<ul></ul></li>')
    for (var j in singleProject.plans.plan) {
      singlePlan = new Plan({
        name: singleProject.plans.plan[j].name,
        key: singleProject.plans.plan[j].key,
        href: singleProject.plans.plan[j].link.href,
      });
      isSavedPlan = storage.findPlanInStorage(singlePlan);
      $(selector).find('#' + singleProject.key + ' ul').append(
        '<li>' +
          '<input type="checkbox" class="addPlan" data-key="' + singlePlan.key + '" data-name="' + singlePlan.name + '" data-href="' + singlePlan.href + '"'+ (isSavedPlan? ' checked="checked"' : '')  +'>' +
          singlePlan.name +
        '</li>');
    }
  }
  $('.addPlan').on('click', function() {
    var plan = new Plan({key: $(this).data('key'),
                        name: $(this).data('name'),
                        href: $(this).data('href')
                        });
    if ($(this).is(':checked')) {
      savePlan(plan);
    }
    else {
      deletePlan(plan);
    }
  });
  $('#requestPlanError').slideUp('fast');
}

function requestPlans(bambooServerUrl) {
  $('#requestPlanError').html('Loading...');
  $('#requestPlanError').slideDown('fast');
  $.ajax({
    url: bambooServerUrl + 'rest/api/latest/project.json?expand=projects.project.plans.plan',
    success: function(data) {
      renderRequestedPlans(data, '#newPlans > ul');
    },
    error: function() {
      $('#requestPlanError').html('something went wrong...please try again later');
    }
  });
}

function renderSavedPlan(savedPlan) {
  $('#savedPlans ul').append('<li id="' + savedPlan.key + '" data-key="'+savedPlan.key+'" data-href="'+savedPlan.href+'" data-name="'+savedPlan.name+'">' + 
                               '<input type="checkbox" class="deletePlan" checked="checked">' + 
                               savedPlan.getLink() + 
                             '</li>');
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
  var input = $('#newPlans input').filter(function() {
    return $(this).data('key') === plan.key;
  });
  input.prop("checked", false);
}

$(document).ready(function() {
  var savedPlans = storage.getStorage();
  renderSavedPlans(savedPlans);

  $('#bambooServerUrlButton').click(function(e) {
    var bambooServerUrl = $('#bambooServerUrl').val();
    if ($("#bambooServerUrlButton").is(":disabled")) {
      return;
    }
    $('#newPlans ul').html('');
    if (bambooServerUrl.substring(0, 4) !== "http") {
      bambooServerUrl = "http://" + bambooServerUrl;
    }
    if (bambooServerUrl.length > 0 && bambooServerUrl[bambooServerUrl.length -1] !== "/") {
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

  $('.deletePlan').live('click', function() {
    var li = $(this).closest("li"),
        plan = {key: $(li).data('key'),
                name: $(li).data('name'),
                href: $(li).data('href')
              };
    deletePlan(plan);
  });
});
