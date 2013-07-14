function renderPlans(data) {
  var projects = '',
      plans = '',
      singleProject,
      singlePlan,
      isPlanExist;
  for (var i in data.projects.project) {
    plans = '';
    singleProject = data.projects.project[i];
    for (var j in singleProject.plans.plan) {
      singlePlan = singleProject.plans.plan[j];
      isPlanExist = findPlanInStorage(singlePlan);
      plans += '<li>' + '<input type="checkbox" class="addPlan" value="' + singlePlan.name + '" data-href="' + singlePlan.link.href + '" data-key="' + singlePlan.key + '"'+ (isPlanExist? ' checked="checked"' : '')  +'>' + singlePlan.name + '</li>';
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
    success: renderPlans,
    error: function() {
      $('#requestPlanError').html('something went wrong...please try again later');
    }
  });
}

function getStorage() {
  var savedPlans = localStorage.savedPlans;
  if (savedPlans === undefined || savedPlans === "") {
    return [];
  }
  return JSON.parse(localStorage.savedPlans);
}

function setStorage(savedPlans) {
  localStorage.savedPlans = JSON.stringify(savedPlans);
}

function savePlanToStorage(plan) {
  var savedPlans = getStorage();

  for (i in savedPlans) {
    if (savedPlans[i].key === plan.key 
      && savedPlans[i].name === plan.name 
      && savedPlans[i].href === plan.href) {
      return;
    }
  }
  savedPlans.push(plan);    
  setStorage(savedPlans);
}

function deletePlanFromStorage(plan) {
  var savedPlans = getStorage(),
      newSavedPlans = [];
  for (i in savedPlans) {
    if (savedPlans[i].key === plan.key 
      && savedPlans[i].name === plan.name 
      && savedPlans[i].href === plan.href) {
      continue;
    }
    newSavedPlans.push(savedPlans[i]);
  }
  setStorage(newSavedPlans);
}

function findPlanInStorage(plan) {
  var savedPlans = getStorage();
  for (i in savedPlans) {
    if (savedPlans[i].key === plan.key 
      && savedPlans[i].name === plan.name 
      && (savedPlans[i].href === plan.href
      || savedPlans[i].href === plan.link.href)) {
      return true;
    }
  }
  return false;
}

function getPlanLink(plan) {
  var hostPattern = /^(https?:\/\/)?([A-Za-z\d\.-]+)\//,
      host;
  host = hostPattern.exec(plan.href)[0];
  return '<a href="' + host + 'browse/' + plan.key + '">' + plan.name + '</a>';
}

function savePlan(plan) {
  savePlanToStorage(plan);
  $('#savedPlans ul').append('<li id="' + plan.key + '">' + getPlanLink(plan) + '</li>');
}

function deletePlan(plan) {
  deletePlanFromStorage(plan);
  $('#savedPlans ul').find("#" + plan.key).remove();
}

function renderSavedPlans() {
  var savedPlans = getStorage();
  for (i in savedPlans) {
    $('#savedPlans ul').append('<li id="' + savedPlans[i].key + '">'+getPlanLink(savedPlans[i])+'</li>');
  }
}

$(document).ready(function() {
  renderSavedPlans();

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
              name: $(this).val(),
              href: $(this).data('href')
              };
    if ($(this).is(':checked')) {
      savePlan(plan);
    }
    else {
      deletePlan(plan);
    }
  });
});





