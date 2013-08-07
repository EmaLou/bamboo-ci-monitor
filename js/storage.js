var Storage = function() {
}

Storage.prototype.getStorage = function() {
  var savedPlans = localStorage.savedPlans;
  if (savedPlans === undefined || savedPlans === "") {
    return [];
  }
  savedPlans = JSON.parse(savedPlans);
  for (i in savedPlans) {
    savedPlans[i] = new Plan(savedPlans[i]);
  }
  return savedPlans;
};

Storage.prototype.setStorage = function(plans) {
  for (i in plans) {
    plans[i] = plans[i].toJSON();
  }
  localStorage.savedPlans = JSON.stringify(plans);
};

Storage.prototype.savePlanToStorage = function(plan) {
  var savedPlans = this.getStorage(),
      saved = false;

  for (i in savedPlans) {
    if (savedPlans[i].equals(plan)) {
      return;
    }
  }
  savedPlans.push(plan);
  this.setStorage(savedPlans);
};

Storage.prototype.updatePlan = function(plan) {
  var savedPlans = this.getStorage(),
      saved = false;

  for (i in savedPlans) {
    if (savedPlans[i].equals(plan)) {
      savedPlans[i] = plan;
      this.setStorage(savedPlans);
      return;
    }
  }
};

Storage.prototype.savePlanStatusToStorage = function(plan, status) {
  var savedPlans = this.getStorage();

  for (i in savedPlans) {
    if (savedPlans[i].key === plan.key
      && savedPlans[i].name === plan.name
      && savedPlans[i].href === plan.href) {
      for (key in status) {
        savedPlans[i][key] = status[key];
      }
      this.setStorage(savedPlans);
      return;
    }
  }
};

Storage.prototype.deletePlanFromStorage = function(plan) {
  var savedPlans = this.getStorage(),
      newSavedPlans = [];
  for (i in savedPlans) {
    if (savedPlans[i].equals(plan)) {
      continue;
    }
    newSavedPlans.push(savedPlans[i]);
  }
  this.setStorage(newSavedPlans);
};

Storage.prototype.findPlanInStorage = function(plan) {
  var savedPlans = this.getStorage();
  for (i in savedPlans) {
    if (savedPlans[i].equals(plan)) {
      return true;
    }
  }
  return false;
};

var storage = new Storage();