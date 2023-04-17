const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  position: { type: String, required: true },
  country: { type: String, required: true },
  city: { type: String, required: true },
  image: { type: String, required: true },
  duration: { type: Number, required: true },
  price: { type: Number, required: true },
  user: { type: String, required: true },
  paymentStatus: { type: String, default: 'unpaid' },
  transactionId: { type: String, default: null }
},{timestamps: true});

bannerSchema.methods = {
  findPaid: function () {
    return mongoose.model('Banner').find({ paymentStatus: 'paid' })
  },
  findUnpaid: function(){
    return mongoose.model("Banner").find({paymentStatus: "unpaid"})
  },
  findByEmail: function (email){
    return mongoose.model("Banner").find({user: email})
  },
  findAll: function(){
    return mongoose.model("Banner").find({})
  },
}

module.exports = mongoose.model('Banner', bannerSchema);
