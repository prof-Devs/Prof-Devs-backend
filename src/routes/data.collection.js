'use strict';

class DataCollection {

  constructor(model) {
    this.model = model;
  }

  get(_id) {
    if (_id) {
      return this.model.findOne({ _id });
    }
    else {
      return this.model.find({});
    }
  }

  getForCourse(id,ggg) {
      return this.model.find({id:ggg});
  }

  create(record) {
    let newRecord = new this.model(record);
    return newRecord.save();
  }

  update(_id, record) {
    return this.model.findByIdAndUpdate(_id, record, { new: true });
  }

  // updatedByStudent(_id,solution) {
  //   return this.model.findByIdAndUpdate(_id,solution,{ new: true });
  // }

  delete(_id) {
    return this.model.findByIdAndDelete(_id);
  }

}

module.exports = DataCollection;