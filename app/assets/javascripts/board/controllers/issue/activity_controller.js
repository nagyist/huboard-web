var BufferedController = require("../buffered_controller");


var IssueActivityController = BufferedController.extend({
  needs: ["issue"],
  isCollaboratorBinding: "App.repo.is_collaborator",
  isLoggedInBinding: "App.loggedIn",
  currentUserBinding: "App.currentUser",
  mentions: Ember.computed.alias("controllers.issue.mentions"),
  isEditing: false,
  disabled: false,
  canEdit: function(){
    return this.get("isLoggedIn") &&
      ( this.get("isCollaborator") || (this.get("currentUser.id") === this.get("model.user.id")) );

  }.property('{isCollaborator,isLoggedIn,currentUser}'),
  actions: {
    taskChanged: function(body){
      this.set('bufferedContent.body', body);
      this.send('save');
    },
    edit: function(){
      this.set("isEditing", true);
    },
    save: function() {
      var controller = this,
        model = controller.get('model'),
        url = "/api/" + this.get("controllers.issue.model.repo.full_name") + "/issues/comments/" + this.get("model.id");

      this.get('bufferedContent').applyBufferedChanges();

      controller.set("disabled", true);

      if(this._last) { this._last.abort() };
      this._last = Ember.$.ajax({
        url: url,
        type: "PUT",
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify({comment: this.get("model")}),
        success: function(response){
          Ember.set(model, "body_html", response.body_html);
          if(controller.isDestroyed || controller.isDestroying){
            return;
          }
          controller.set("disabled", false);
          controller.set("isEditing", false);
          controller._last = null;
        }
      })
    },

    cancel: function() {
      this.get('bufferedContent').discardBufferedChanges();
      this.set("isEditing", false);
    }
  }
})

module.exports = IssueActivityController;
