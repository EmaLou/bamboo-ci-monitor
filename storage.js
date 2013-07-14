var storage = {
  getStorage: function() {
    var savedPlans = localStorage.savedPlans;
    if (savedPlans === undefined || savedPlans === "") {
      return [];
    }
    return JSON.parse(localStorage.savedPlans);
  },

  setStorage: function(plans) {
    localStorage.savedPlans = JSON.stringify(plans);
  },

  savePlanToStorage: function(plan) {
    var savedPlans = this.getStorage();

    for (i in savedPlans) {
      if (savedPlans[i].key === plan.key 
        && savedPlans[i].name === plan.name 
        && savedPlans[i].href === plan.href) {
        return;
      }
    }
    savedPlans.push(plan);    
    this.setStorage(savedPlans);
  },

  deletePlanFromStorage: function(plan) {
    var savedPlans = this.getStorage(),
        newSavedPlans = [];
    for (i in savedPlans) {
      if (savedPlans[i].key === plan.key 
        && savedPlans[i].name === plan.name 
        && savedPlans[i].href === plan.href) {
        continue;
      }
      newSavedPlans.push(savedPlans[i]);
    }
    this.setStorage(newSavedPlans);
  },

  findPlanInStorage: function(plan) {
    var savedPlans = this.getStorage();
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
}
