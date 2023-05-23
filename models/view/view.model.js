const mongoose = require('mongoose');
const ViewSchema = require('./video.schema')
const ViewsModel = mongoose.model('Views', ViewSchema);

class Views {
    constructor( registredAt, viewerId) {
        this.registredAt = registredAt;
        this.viewerId = viewerId;
    }
    static createView(view) {
        console.log("Parampam")
        return new ViewsModel(view).save();
    }
    static deleteView(viewId) {
        return ViewsModel.deleteOne({_id: viewId});
    }
    static getById(viewId){
        return ViewsModel.findById(viewId);
    }
}
module.exports = Views;
