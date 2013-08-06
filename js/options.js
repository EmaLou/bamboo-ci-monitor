function triggerInvalidUrlError(isValid){
  if (isValid) {
    $('#urlInvalidation').slideUp();
    $('#bambooServerUrl').css('border-color', '#1abc9c');
    $('#bambooServerUrlButton').css({
      'background-color': '#1abc9c'
    });
    $('#bambooServerUrlButton').removeAttr('disabled');
  }
  else {
    $('#urlInvalidation').slideDown();
    $('#bambooServerUrl').css('border-color', '#bdc3c7');
    $('#bambooServerUrlButton').css({
      'background-color': '#bdc3c7'
    });
    $('#bambooServerUrlButton').attr('disabled', 'disabled');
  }
}

function triggerRequestFailureError(isSuccessful) {
  if (isSuccessful) {
    $('#requestPlanError').slideUp();
    $('#bambooServerUrl').css('border-color', '#1abc9c');
    $('#bambooServerUrlButton').css('background-color', '#1abc9c');
  }
  else {
    $('#requestPlanError').slideDown();
    $('#bambooServerUrl').css('border-color', '#e74c3c');
    $('#bambooServerUrlButton').css('background-color', '#e74c3c');
  }
}

function renderRequestedPlans(data, selector) {
  var projects = '',
      plans = '',
      singleProject,
      singlePlan,
      isSavedPlan;

  try {
    for (var i in data.projects.project) {
      plans = '';
      singleProject = data.projects.project[i];
      $(selector).append('<li id="' + singleProject.key + '" class="project">' + singleProject.name + '</li><ul></ul>')
      for (var j in singleProject.plans.plan) {
        singlePlan = new Plan({
          name: singleProject.plans.plan[j].name,
          key: singleProject.plans.plan[j].key,
          href: singleProject.plans.plan[j].link.href,
        });
        isSavedPlan = storage.findPlanInStorage(singlePlan);
        $(selector).find('#' + singleProject.key).next('ul').append(
          '<li class="plan addPlan' + (isSavedPlan? ' saved': '') + '" data-key="' + singlePlan.key + '" data-name="' + singlePlan.name + '" data-href="' + singlePlan.href + '">' +
            singlePlan.name +
            '<span class="save">✔</span>' +
          '</li>');
      }
    }
    $('.addPlan').on('click', function() {
      var plan = new Plan({key: $(this).data('key'),
                          name: $(this).data('name'),
                          href: $(this).data('href')
                          });
      if (!$(this).hasClass('saved')) {
        savePlan(plan);
        $(this).addClass('saved');
      }
      else {
        deletePlan(plan);
        $(this).removeClass('saved');
      }
    });
    triggerRequestFailureError(true);
    return true;
  }
  catch (error) {
    triggerRequestFailureError(false);
    return false;
  }
}

function saveUrlAndData(bambooServerUrl, data){
  var bambooServerConfig = {
    bambooServerUrl: bambooServerUrl,
    data: data
  };
  localStorage.bambooServerConfig = JSON.stringify(bambooServerConfig);
}

function requestPlans(bambooServerUrl) {
  triggerRequestFailureError(true);
  $('#requestLoading').slideDown();
  $.ajax({
    url: bambooServerUrl + 'rest/api/latest/project.json?expand=projects.project.plans.plan',
    success: function(data) {
      if (renderRequestedPlans(data, '#newPlans > ul', bambooServerUrl)) {
        saveUrlAndData(bambooServerUrl, data);
      }
    },
    error: function() {
      triggerInvalidUrlError(false);
    },
    complete: function() {
      $('#requestLoading').slideUp();
    }
  });
}

function renderSavedPlan(savedPlan) {
  $('#savedPlans ul').append('<li id="' + savedPlan.key + '" class="plan" data-key="'+savedPlan.key+'" data-href="'+savedPlan.href+'" data-name="'+savedPlan.name+'">' + 
                               savedPlan.renderLink() + 
                               '<span class="deletePlan">✘</span>' +
                             '</li>');
  $('.deletePlan').on('click', function() {
    var li = $(this).closest("li"),
        plan = {key: $(li).data('key'),
                name: $(li).data('name'),
                href: $(li).data('href')
              };
    deletePlan(plan);
  });
}

function renderSavedPlans(savedPlans) {
  for (i in savedPlans) {
    renderSavedPlan(savedPlans[i]);
  }
}

function renderSavedBambooServerConfig(){
  if (localStorage.bambooServerConfig === undefined || localStorage.bambooServerConfig === "") {
    return;
  }
  var bambooServerConfig = JSON.parse(localStorage.bambooServerConfig);
  $('#bambooServerUrl').val(bambooServerConfig.bambooServerUrl);
  renderRequestedPlans(bambooServerConfig.data, '#newPlans > ul');
}

function savePlan(plan) {
  storage.savePlanToStorage(plan);
  renderSavedPlan(plan);
}

function deletePlan(plan) {
  storage.deletePlanFromStorage(plan);
  $('#savedPlans ul').find("#" + plan.key).remove();
  var planList = $('#newPlans li').filter(function() {
    return $(this).data('key') === plan.key;
  });
  planList.removeClass('saved');
}

$(document).ready(function() {
  var savedPlans = storage.getStorage();
  renderSavedPlans(savedPlans);
  renderSavedBambooServerConfig();

  $('#bambooServerForm').submit(function(e) {
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
    triggerRequestFailureError(true);
    triggerInvalidUrlError(urlPattern.test(bambooServerUrl));
  });

  $('#bambooServerUrl').trigger('keyup');
});
